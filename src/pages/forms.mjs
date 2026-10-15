import { u, esc, arr, icon } from '../lib/html.mjs';
import { layout } from '../templates/layout.mjs';
import { crumbs } from '../templates/parts.mjs';
import { FLOW } from '../content/services.mjs';
import { POSTCODES } from '../content/areas.mjs';
import { LEADS, BUSINESS } from '../content/site.mjs';

const clientConfig = () => ({
  leads: LEADS, email: BUSINESS.email, successPath: '/thank-you/',
  quoteMode: 'remote-first', multiServiceReviewThreshold: 4,
  areas: POSTCODES, flow: FLOW
});
const configScript = () => `<script>window.STRIDE_CONFIG=${JSON.stringify(clientConfig()).replace(/</g, '\\u003c')};</script>`;

const choice = (type, name, value, label, extra = '', small = '') =>
  `<label class="choice"><input type="${type}" name="${name}" value="${esc(value)}"${extra}><span>${label}${small ? `<small>${small}</small>` : ''}</span></label>`;

const serviceCards = () => `
  <div class="choices" data-choice-grid>
    ${FLOW.services.primary.map((s) => `<label class="choice choice--card"><input type="checkbox" name="services" value="${s.id}"><span>${icon(s.icon, 'ico')}${esc(s.label)}</span></label>`).join('')}
  </div>
  <details class="more-services"><summary>+ More services (pool surrounds, solar, decks, fences…)</summary>
    <div class="choices">${FLOW.services.more.map((s) => choice('checkbox', 'services', s.id, esc(s.label))).join('')}</div>
  </details>`;

const postcodeField = (id) => `
  <div class="field" style="max-width:340px">
    <label class="flabel" for="${id}">Property postcode</label>
    <input class="input" id="${id}" name="postcode" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" autocomplete="postal-code" required data-postcode data-error="Please enter a 4-digit postcode.">
    <p class="area-result" data-area-result hidden aria-live="polite"></p>
  </div>`;

const photoField = (hint) => `
  <div class="field">
    <span class="flabel">Photos <span class="opt">optional, up to ${LEADS.maxPhotos}</span></span>
    <span class="hint">${hint}</span>
    <label class="dropzone" data-dropzone>
      <input type="file" accept="image/*" multiple data-files aria-label="Add photos">
      ${icon('camera')}
      <strong>Add photos</strong>
      <span class="small">Tap to take or choose photos, or drag them here. They’re resized on your device before sending.</span>
    </label>
    <div class="thumbs" data-thumbs></div>
    <p class="small" data-file-count aria-live="polite"></p>
  </div>`;

const contactFields = (prefix, { addressRequired = false } = {}) => `
  <div class="row-2">
    <div class="field"><label class="flabel" for="${prefix}-name">Your name</label><input class="input" id="${prefix}-name" name="name" autocomplete="name" required data-error="Please tell us your name."></div>
    <div class="field"><label class="flabel" for="${prefix}-phone">Mobile</label><input class="input" id="${prefix}-phone" name="phone" type="tel" autocomplete="tel" required data-error="Please enter a phone number we can reach you on."></div>
  </div>
  <div class="field"><label class="flabel" for="${prefix}-email">Email</label><input class="input" id="${prefix}-email" name="email" type="email" autocomplete="email" required data-error="Please enter a valid email address."></div>
  <div class="field"><label class="flabel" for="${prefix}-address">Street address${addressRequired ? '' : ' <span class="opt">optional — helps us quote accurately</span>'}</label><input class="input" id="${prefix}-address" name="address" autocomplete="street-address"${addressRequired ? ' required data-error="We need the address to book the job."' : ''}></div>
  <fieldset class="qgroup"><legend>Best way to reach you</legend><div class="choices">
    ${choice('radio', 'contactPref', 'phone', 'Phone call', ' checked')}${choice('radio', 'contactPref', 'sms', 'Text message')}${choice('radio', 'contactPref', 'email', 'Email')}
  </div></fieldset>
  <div class="field"><label class="flabel" for="${prefix}-notes">Anything else? <span class="opt">optional</span></label><textarea class="textarea" id="${prefix}-notes" name="notes" placeholder="Gate codes, pets, fragile plants, what’s bothering you most…"></textarea></div>
  <div class="hp" aria-hidden="true"><label>Leave this empty<input name="company_website" tabindex="-1" autocomplete="off"></label></div>
  <label class="consent"><input type="checkbox" name="consent" required data-error="Please agree so we can contact you about your enquiry."><span>I agree to Stride using these details and photos to respond to my enquiry, as set out in the <a class="link" href="${u('/privacy/')}" target="_blank">privacy policy</a>.</span></label>`;

const shell = (title, sub, steps, aside, kind) => `
<section class="section section--tight"><div class="wrap">
  ${crumbs([['Home', '/'], [title, `/${kind === 'quote' ? 'quote' : 'book'}/`]])}
  <div class="form-shell">
    <form class="form-card" data-flow="${kind}" novalidate>
      <div class="progress"><span class="spec spec--ink" data-step-label></span><span class="spec num" data-step-count></span></div>
      <div class="progress-track" aria-hidden="true"><span class="progress-fill" data-progress></span></div>
      ${steps}
      <input type="hidden" name="qualification" data-field="qualification"><input type="hidden" name="qualificationReasons" data-field="reasons">
      <input type="hidden" name="serviceArea" data-field="area"><input type="hidden" name="priority" data-field="priority"><input type="hidden" name="photoCount" data-field="photoCount" value="0">
      <div class="form-nav">
        <button class="btn btn--ghost" type="button" data-back hidden>${icon('arrowLeft', 'arr')} Back</button>
        <button class="btn btn--lg" type="button" data-next>Continue ${arr()}</button>
        <button class="btn btn--lg" type="submit" data-send hidden>${kind === 'quote' ? 'Send my quote request' : 'Send booking request'} ${arr()}</button>
      </div>
      <div data-form-status hidden></div>
    </form>
    <aside class="form-aside">${aside}</aside>
  </div>
</div></section>`;

export function quotePage() {
  const steps = `
  <div class="step-pane" data-step data-label="What needs cleaning">
    <h1 class="h2" tabindex="-1">What needs cleaning?</h1>
    <p class="small">Tick everything you’d like priced. About two minutes, start to finish.</p>
    <fieldset class="qgroup" data-services-group><legend class="sr">Services</legend>${serviceCards()}</fieldset>
    <div class="upsell" data-upsell hidden></div>
    ${postcodeField('q-pc')}
  </div>
  <div class="step-pane" data-step data-label="About the property" hidden>
    <h2 class="h2" tabindex="-1">About the property</h2>
    <p class="small">These help us price it without a visit where we can.</p>
    <fieldset class="qgroup"><legend>Property type</legend><div class="choices">
      ${choice('radio', 'propertyType', 'house', 'House', ' required data-error="Please choose a property type."')}${choice('radio', 'propertyType', 'townhouse', 'Townhouse / duplex')}${choice('radio', 'propertyType', 'strata', 'Unit / strata')}${choice('radio', 'propertyType', 'commercial', 'Commercial')}
    </div></fieldset>
    <fieldset class="qgroup"><legend>Storeys</legend><div class="choices">
      ${choice('radio', 'storeys', '1', 'Single storey', ' required data-error="Please choose the number of storeys."')}${choice('radio', 'storeys', '2', 'Two storeys')}${choice('radio', 'storeys', '3', 'Three or more')}
    </div></fieldset>
    <fieldset class="qgroup" data-when="roof" hidden><legend>Roof type</legend><div class="choices">
      ${choice('radio', 'roofType', 'concrete-tile', 'Concrete tile')}${choice('radio', 'roofType', 'terracotta', 'Terracotta tile')}${choice('radio', 'roofType', 'colorbond', 'Colorbond / metal')}${choice('radio', 'roofType', 'unsure', 'Not sure')}
    </div></fieldset>
    <fieldset class="qgroup" data-when="driveway" hidden><legend>Driveway size</legend><div class="choices">
      ${choice('radio', 'drivewaySize', 'single', 'Single', '', 'about 1 car wide')}${choice('radio', 'drivewaySize', 'double', 'Double', '', '2 cars wide')}${choice('radio', 'drivewaySize', 'large', 'Large / long', '', 'more than double')}
    </div></fieldset>
    <fieldset class="qgroup" data-when="window" hidden><legend>Roughly how many windows?</legend><div class="choices">
      ${choice('radio', 'windowCount', 'under10', 'Under 10')}${choice('radio', 'windowCount', '10to20', '10–20')}${choice('radio', 'windowCount', 'over20', 'More than 20')}
    </div></fieldset>
    <fieldset class="qgroup"><legend>Anything that makes it trickier?</legend><span class="hint">Tick any that apply — it just helps us plan.</span><div class="choices">
      <label class="choice"><input type="checkbox" name="flags" value="heavyStaining" data-flag="heavyStaining"><span>Heavy staining<small>hasn’t been cleaned in years</small></span></label>
      <label class="choice"><input type="checkbox" name="flags" value="accessIssue" data-flag="accessIssue"><span>Tricky access<small>steep block, no side access</small></span></label>
      <label class="choice"><input type="checkbox" name="flags" value="largeScale" data-flag="largeScale"><span>Large property<small>acreage or a lot of hard surface</small></span></label>
    </div></fieldset>
    ${photoField('Two or three photos of each area usually let us quote without a visit. Stand back far enough to show the whole surface.')}
    <fieldset class="qgroup"><legend>When are you hoping to have it done?</legend><div class="choices">
      ${FLOW.timing.map((t, i) => choice('radio', 'timing', t.id, esc(t.label), i === 0 ? ' required data-error="Please choose a timeframe."' : '')).join('')}
    </div></fieldset>
  </div>
  <div class="step-pane" data-step data-label="Your details" hidden>
    <h2 class="h2" tabindex="-1">Where should we send the quote?</h2>
    <p class="small">A real person reviews every request — no call centre, no spam.</p>
    <div class="panel mb-3" data-qual-note hidden></div>
    ${contactFields('q')}
    <dl class="summary mt-3" data-summary></dl>
  </div>`;
  const aside = `<span class="spec">How quoting works</span>
  <ul class="aside-list mt-2">
    <li>${icon('camera')}<span><b>Photos first</b>Most homes are quoted from photos. If yours needs a look, we’ll book a free visit.</span></li>
    <li>${icon('doc')}<span><b>A written scope</b>Each surface, its method, and what will lift versus only lighten.</span></li>
    <li>${icon('clock')}<span><b>Within one business day</b>Usually sooner. ${BUSINESS.hours}.</span></li>
    <li>${icon('shield')}<span><b>No obligation</b>$10m public liability. Nothing is booked until you say so.</span></li>
  </ul>
  <p class="small mt-3">Prefer to pick dates now? <a class="link" href="${u('/book/')}">Request a booking</a> instead.</p>`;
  const body = shell('Free quote', '', steps, aside, 'quote');
  return layout({ path: '/quote/', title: 'Get a Free Exterior Cleaning Quote', description: 'Get a free, no-obligation exterior cleaning quote from Stride. Tick the services, add a few photos and we’ll reply within one business day.', body, head: configScript(), scripts: ['/assets/js/forms.js'], mbar: false });
}

export function bookPage() {
  const steps = `
  <div class="step-pane" data-step data-label="Services & postcode">
    <h1 class="h2" tabindex="-1">Request a booking</h1>
    <p class="small">Choose the services and two or three dates that suit. We’ll confirm the price and an arrival window before anything is locked in.</p>
    <fieldset class="qgroup" data-services-group><legend>What would you like booked?</legend>${serviceCards()}</fieldset>
    ${postcodeField('b-pc')}
  </div>
  <div class="step-pane" data-step data-label="Preferred dates" hidden>
    <h2 class="h2" tabindex="-1">Pick up to three dates</h2>
    <p class="small">Weekdays only. We’ll confirm one of them — or suggest the nearest alternative.</p>
    <fieldset class="qgroup"><legend class="sr">Preferred dates</legend>
      <div class="cal" data-cal>
        <div class="cal-head"><strong data-cal-title></strong><div class="cal-nav"><button type="button" data-cal-prev aria-label="Previous month">${icon('arrowLeft')}</button><button type="button" data-cal-next aria-label="Next month">${icon('arrow')}</button></div></div>
        <div class="cal-grid" data-cal-grid role="grid"></div>
      </div>
      <div class="picked" data-picked aria-live="polite"></div>
      <input type="hidden" name="dates" data-dates required data-error="Please choose at least one date.">
    </fieldset>
    <fieldset class="qgroup"><legend>Time of day</legend><div class="choices">
      ${choice('radio', 'window', 'morning', 'Morning', ' checked', 'from 8am')}${choice('radio', 'window', 'afternoon', 'Afternoon', '', 'from 12pm')}${choice('radio', 'window', 'either', 'Either')}
    </div></fieldset>
    <fieldset class="qgroup"><legend>Will someone be home?</legend><div class="choices">
      ${choice('radio', 'home', 'yes', 'Yes', ' checked')}${choice('radio', 'home', 'no', 'No — access is open')}${choice('radio', 'home', 'unsure', 'Not sure yet')}
    </div></fieldset>
  </div>
  <div class="step-pane" data-step data-label="Your details" hidden>
    <h2 class="h2" tabindex="-1">Your details</h2>
    <p class="small">We need the address to plan the job and confirm the price.</p>
    ${contactFields('b', { addressRequired: true })}
    ${photoField('Optional, but photos let us confirm the price before we arrive.')}
    <dl class="summary mt-3" data-summary></dl>
  </div>`;
  const aside = `<span class="spec">How booking works</span>
  <ul class="aside-list mt-2">
    <li>${icon('calendar')}<span><b>You choose dates</b>Up to three weekdays that suit you.</span></li>
    <li>${icon('doc')}<span><b>We confirm in writing</b>Price, scope and arrival window — within one business day.</span></li>
    <li>${icon('check')}<span><b>Then it’s locked in</b>Nothing is charged by sending this request.</span></li>
  </ul>
  <p class="small mt-3">Not sure what you need yet? <a class="link" href="${u('/quote/')}">Get a free quote</a> first.</p>`;
  const body = shell('Request a booking', '', steps, aside, 'book');
  return layout({ path: '/book/', title: 'Request a Booking', description: 'Request an exterior cleaning booking with Stride: choose services and preferred weekdays, and we’ll confirm the price and arrival window.', body, head: configScript(), scripts: ['/assets/js/forms.js'], mbar: false });
}
