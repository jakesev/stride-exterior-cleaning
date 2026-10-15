/* Stride — lead qualification.
 *
 * Deliberately separate from the UI: this decides WHAT KIND of lead an enquiry
 * is and what the cheapest reliable next action is. It is a pure function of
 * (lead, config) so it can be unit-tested in Node without a browser.
 *
 * Outcomes
 *   REMOTE_QUOTE_CANDIDATE  enough information to price without travelling
 *   MANUAL_REVIEW           probably remote, but a human should look first
 *   ONSITE_ASSESSMENT       complexity, risk or access makes a visit worthwhile
 *   OUTSIDE_SERVICE_AREA    do not put through the normal pipeline
 *
 * Nothing here decides whether a lead is WORTH having — that is scoreLead(),
 * which sets callback priority only. A low score is still a real customer.
 */
const api = (function () {
  'use strict';

  var OUTCOME = {
    REMOTE: 'REMOTE_QUOTE_CANDIDATE',
    MANUAL: 'MANUAL_REVIEW',
    ONSITE: 'ONSITE_ASSESSMENT',
    OUTSIDE: 'OUTSIDE_SERVICE_AREA'
  };

  /* ------------------------------------------------------------- postcode */
  function resolveArea(postcode, areas) {
    var pc = String(postcode == null ? '' : postcode).trim();
    if (!/^\d{4}$/.test(pc)) return { tier: 'invalid', postcode: pc, label: '', message: '' };
    var tier = areas.core[pc] ? 'core'
      : areas.discretionary[pc] ? 'discretionary'
        : areas.excluded && areas.excluded[pc] ? 'excluded' : 'unknown';
    var label = (areas.core[pc] || areas.discretionary[pc] ||
      (areas.excluded && areas.excluded[pc]) || '');
    return { tier: tier, postcode: pc, label: label, message: areas.messages[tier] || '' };
  }

  /* ---------------------------------------------------------- qualification */
  function qualifyLead(lead, config) {
    config = config || {};
    var areas = config.areas;
    var flow = config.flow || {};
    var reasons = [];
    var multiThreshold = config.multiServiceReviewThreshold || 4;

    var area = resolveArea(lead.postcode, areas);
    if (area.tier === 'excluded' || area.tier === 'unknown' || area.tier === 'invalid') {
      return { outcome: OUTCOME.OUTSIDE, area: area, reasons: ['postcode_outside_service_area'] };
    }
    if (area.tier === 'discretionary') reasons.push('postcode_discretionary');

    /* Business may choose to inspect every property regardless. One switch. */
    if (config.quoteMode === 'always-assess') {
      return { outcome: OUTCOME.ONSITE, area: area, reasons: reasons.concat(['policy_always_assess']) };
    }

    var services = lead.services || [];
    var flags = lead.flags || {};

    /* --- hard on-site triggers ------------------------------------------- */
    if (lead.propertyType === 'commercial' || lead.propertyType === 'strata') {
      reasons.push('property_type_' + lead.propertyType);
      return { outcome: OUTCOME.ONSITE, area: area, reasons: reasons };
    }
    if (String(lead.storeys) === '3') {
      reasons.push('three_or_more_storeys');
      return { outcome: OUTCOME.ONSITE, area: area, reasons: reasons };
    }
    if (flags.accessIssue) {
      reasons.push('access_difficulty');
      return { outcome: OUTCOME.ONSITE, area: area, reasons: reasons };
    }

    /* --- review triggers -------------------------------------------------- */
    var lookup = {};
    ['primary', 'more'].forEach(function (group) {
      ((flow.services && flow.services[group]) || []).forEach(function (s) { lookup[s.id] = s; });
    });
    var notRemotable = services.filter(function (id) {
      return !lookup[id] || lookup[id].remoteQuotable === false;
    });

    if (notRemotable.length) reasons.push('service_needs_review:' + notRemotable.join('+'));
    if (flags.heavyStaining) reasons.push('heavy_staining');
    if (flags.largeScale) reasons.push('large_scale');
    if (services.length >= multiThreshold) reasons.push('multi_service');

    var hasPhotos = (lead.photoCount || 0) > 0;
    var detailsSufficient = !!(lead.propertyType && lead.storeys && lead.improve);

    if (reasons.filter(function (r) { return r !== 'postcode_discretionary'; }).length) {
      return { outcome: OUTCOME.MANUAL, area: area, reasons: reasons };
    }
    if (area.tier === 'discretionary') {
      return { outcome: OUTCOME.MANUAL, area: area, reasons: reasons };
    }

    /* --- remote candidate -------------------------------------------------- */
    if (hasPhotos && detailsSufficient) {
      return { outcome: OUTCOME.REMOTE, area: area, reasons: reasons.concat(['photos_and_details_sufficient']) };
    }
    if (!hasPhotos) reasons.push('no_photos');
    if (!detailsSufficient) reasons.push('incomplete_details');
    return { outcome: OUTCOME.MANUAL, area: area, reasons: reasons };
  }

  /* ------------------------------------------------------------- priority */
  /* Sales callback order only. Never used to discard a lead. */
  function scoreLead(lead, config) {
    config = config || {};
    var flow = config.flow || {};
    var score = 0;
    var services = lead.services || [];

    var timing = (flow.timing || []).filter(function (t) { return t.id === lead.timing; })[0];
    if (timing && typeof timing.score === 'number') score += timing.score;

    if (services.length >= 2) score += 3;
    if (services.indexOf('roof') > -1 && services.indexOf('house') > -1) score += 3;
    if ((lead.photoCount || 0) > 0) score += 2;

    var area = resolveArea(lead.postcode, config.areas);
    if (area.tier === 'core') score += 2;
    else if (area.tier !== 'discretionary') score -= 3;

    if (lead.improve && lead.improve !== 'unsure') score += 2;
    if (lead.propertyType === 'house') score += 1;

    return score;
  }

  return {
    OUTCOME: OUTCOME,
    resolveArea: resolveArea,
    qualifyLead: qualifyLead,
    scoreLead: scoreLead
  };
})();
export const { OUTCOME, resolveArea, qualifyLead, scoreLead } = api;
export default api;
