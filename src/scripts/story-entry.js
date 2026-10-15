import { startStory } from './story.js';

const root = document.querySelector('[data-story]');
if (root) {
  // If the page was scrolled before the 3D arrived, keep the reader where they are.
  const ok = startStory(root);
  if (!ok) root.setAttribute('data-mode', 'static');
}
