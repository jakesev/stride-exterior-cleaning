/* Markdown + research-file parsing for the education centre and FAQs. */
import fs from 'node:fs';
import path from 'node:path';
import { Marked } from 'marked';

const slugify = (s) => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

/** Minimal front-matter reader: `key: value` and `key:` followed by `  - item` lists. */
export function frontMatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { data: {}, body: src };
  const data = {};
  let listKey = null;
  for (const line of m[1].split('\n')) {
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && listKey) { data[listKey].push(item[1].trim()); continue; }
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!kv) continue;
    if (kv[2] === '') { listKey = kv[1]; data[listKey] = []; }
    else { listKey = null; data[kv[1]] = /^\d+$/.test(kv[2]) ? Number(kv[2]) : kv[2].replace(/^["']|["']$/g, ''); }
  }
  return { data, body: src.slice(m[0].length) };
}

export function renderArticle(body) {
  const toc = [];
  const marked = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const id = slugify(text);
        if (depth === 2) toc.push({ id, text: text.replace(/<[^>]+>/g, '') });
        const isSources = depth === 2 && /^sources$/i.test(text.trim());
        return `<h${depth} id="${id}"${isSources ? ' class="sources-h"' : ''}>${text}</h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const ext = /^https?:/.test(href);
        return `<a href="${href}"${title ? ` title="${title}"` : ''}${ext ? ' rel="noopener" target="_blank"' : ''}>${text}</a>`;
      },
      table(token) {
        const head = token.header.map((c) => `<th>${this.parser.parseInline(c.tokens)}</th>`).join('');
        const rows = token.rows.map((r) => `<tr>${r.map((c) => `<td>${this.parser.parseInline(c.tokens)}</td>`).join('')}</tr>`).join('');
        return `<div class="table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
      }
    }
  });
  let html = marked.parse(body);
  // Wrap the Sources list for styling.
  html = html.replace(/(<h2 id="sources" class="sources-h">Sources<\/h2>\s*)(<ul>[\s\S]*?<\/ul>)/, '$1<div class="sources">$2</div>');
  return { html, toc: toc.filter((t) => t.id !== 'sources') };
}

export function loadArticles(dir) {
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => {
    const { data, body } = frontMatter(fs.readFileSync(path.join(dir, f), 'utf8'));
    const { html, toc } = renderArticle(body);
    const words = body.split(/\s+/).length;
    return { ...data, slug: data.slug || f.replace(/\.md$/, ''), html, toc, words, readingMinutes: data.readingMinutes || Math.max(3, Math.round(words / 220)) };
  });
}

const inline = new Marked({ gfm: true, renderer: { link({ href, tokens }) { return `<a href="${href}" rel="noopener" target="_blank">${this.parser.parseInline(tokens)}</a>`; } } });
const md1 = (s) => inline.parseInline(s.trim());

/** FAQ blocks: "### n. Question" + answer paragraph(s) + optional "*Source(s): …*". */
export function parseFaqFile(file, { refs } = {}) {
  const src = fs.readFileSync(file, 'utf8');
  const groups = [];
  let group = { title: '', items: [] };
  const lines = src.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const h2 = lines[i].match(/^## (.*)/);
    if (h2) { if (group.items.length) groups.push(group); group = { title: h2[1].trim(), items: [] }; continue; }
    const h3 = lines[i].match(/^### (?:\d+\.\s*)?(.*)/);
    if (!h3) continue;
    const q = h3[1].trim();
    const buf = [];
    let j = i + 1;
    while (j < lines.length && !/^#{2,3} /.test(lines[j]) && !/^---\s*$/.test(lines[j])) { buf.push(lines[j]); j++; }
    i = j - 1;
    const text = buf.join('\n').trim();
    const srcLine = text.match(/^\*Sources?:([\s\S]*?)\*\s*$/m);
    let answer = (srcLine ? text.replace(srcLine[0], '') : text).trim();
    let sources = [];
    if (srcLine) {
      if (/Editorial/i.test(srcLine[1])) sources = [];
      else sources = [...srcLine[1].matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].map((m) => ({ title: m[1], url: m[2] }));
    }
    if (refs) {   // "[Key]" reference style
      const keys = [...answer.matchAll(/\[([A-Za-z0-9-]+)\](?!\()/g)].map((m) => m[1]);
      sources = keys.map((k) => refs[k]).filter(Boolean);
      answer = answer.replace(/\s*\[[A-Za-z0-9-]+\](?!\()/g, '').trim();
    }
    if (!answer) continue;
    group.items.push({ q, a: answer.split(/\n{2,}/).map((p) => `<p>${md1(p)}</p>`).join(''), sources });
  }
  if (group.items.length) groups.push(group);
  return groups;
}

export function parseRefs(file) {
  const out = {};
  for (const m of fs.readFileSync(file, 'utf8').matchAll(/^- \[([A-Za-z0-9-]+)\] \[([^\]]+)\]\(([^)]+)\)/gm)) out[m[1]] = { title: m[2], url: m[3] };
  return out;
}

/** "Did you know" facts: numbered list items with bold lead and a source. */
export function parseFacts(file, refs) {
  const src = fs.readFileSync(file, 'utf8');
  const sec = src.split(/^## \(c\)[^\n]*\n/m)[1] || '';
  const body = sec.split(/^---\s*$|^## /m)[0];
  return [...body.matchAll(/^\d+\.\s+([\s\S]*?)(?=^\d+\.\s|(?![\s\S]))/gm)].map((m) => {
    const t = m[1].trim();
    const link = t.match(/\[([^\]]+)\]\((https?:[^)]+)\)/);
    const key = t.match(/Source:\s*\[([A-Za-z0-9-]+)\]/);
    const source = link ? { title: link[1], url: link[2] } : key && refs ? refs[key[1]] : null;
    const text = t.replace(/\*?Source:[\s\S]*$/m, '').replace(/\s+/g, ' ').trim();
    return { html: md1(text), source };
  }).filter((f) => f.html);
}
