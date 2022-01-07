/* eslint-disable no-unused-expressions, no-var, prefer-template, vars-on-top, no-console, no-template-curly-in-string */

!(function () {
  // Do nothing if install code is missing
  if (!window.MemberSpace) {
    return;
  }

  var currentBundleSource = 'PROD';
  var ENTRY_POINTS = {
    DEV: 'http://localhost:3000/static/js/bundle.js',
    STAGING: '//cdn.memberspace-staging.com/scripts/widgets.js',
    PROD: '//cdn.memberspace.com/scripts/widgets.js',
  };

  window.MemberSpace.overrideBundle = function (rawSrc, rawEnvSet) {
    if (!rawSrc) {
      // Clear previous overrides
      sessionStorage.removeItem('ms-bundleSource');
      sessionStorage.removeItem('ms-envSet');

      window.location.reload();
      return 'CLEARED';
    }

    var src = rawSrc.toUpperCase();
    var envSet = rawEnvSet && rawEnvSet.toUpperCase();

    if (src !== 'DEV' && src !== 'STAGING' && src !== 'PROD')
      return "bundleSource must be one of [ 'DEV' / 'STAGING' / 'PROD' ]";

    if (envSet && envSet !== 'DEV' && envSet !== 'STAGING' && envSet !== 'PROD')
      return "envSet must be one of [ undef / 'DEV' / 'STAGING' / 'PROD' ]";

    // store bundleSource in LS
    sessionStorage.setItem('ms-bundleSource', src);

    // store envSet in LS
    if (envSet) {
      sessionStorage.setItem('ms-envSet', envSet);
    } else {
      sessionStorage.removeItem('ms-envSet');
    }

    window.location.reload();
    return 'OK';
  };

  function init() {
    var b = '//cdn.memberspace.com/20220105T161525X077384102';
    var s = document.createElement('script');
    s.setAttribute('src', b + '/scripts/main.js');
    document.getElementsByTagName('head')[0].appendChild(s);
    var l = document.createElement('link');
    l.setAttribute('rel', 'stylesheet');
    l.setAttribute('type', 'text/css');
    l.setAttribute('href', b + '/styles/widget.css');
    document.getElementsByTagName('head')[0].appendChild(l);
  }

  function alternateInit(source) {
    console.warn(
      'Loading alternate (' + source + ') bundle from: ' + ENTRY_POINTS[source]
    );

    var s = document.createElement('script');
    s.setAttribute('src', ENTRY_POINTS[source]);
    document.getElementsByTagName('head')[0].appendChild(s);
  }

  function testCapabilities() {
    // Do not redirect if check is disabled
    if (window.MemberSpace.disableOldBrowserRedirect) {
      return;
    }

    // Fail gracefully on "less than modern" browsers
    try {
      // Test global capabilities
      if (!Array.prototype.includes)
        throw new Error('Browser is not Array includes capable');
      if (!window.fetch) throw new Error('Browser is not fetch capable');
      if (!window.MutationObserver)
        throw new Error('Browser is not MutationObserver capable');
      if (!window.URL) throw new Error('Browser is not URL capable');
      if (!window.URLSearchParams)
        throw new Error('Browser is not URLSearchParams capable');
      if (!window.CustomEvent)
        throw new Error('Browser is not CustomEvent capable');
      // if (!window.ResizeObserver)
      //  throw new Error('Browser is not ResizeObserver capable');

      if (!window.Intl)
        // https://formatjs.io/docs/react-intl/#runtime-requirements
        throw new Error('Browser is not Intl capable');
      if (!window.Intl.NumberFormat)
        throw new Error('Browser is not Intl.NumberFormat capable');
      if (!window.Intl.DateTimeFormat)
        throw new Error('Browser is not Intl.DateTimeFormat capable');

      // Test element capabilities
      var testEl = document.createElement('ms-test');
      if (!testEl.replaceWith)
        throw new Error('Browser is not element.replaceWith capable');

      if (!testEl.remove)
        throw new Error('Browser is not element.remove capable');
    } catch (e) {
      console.error(
        'Memberspace widget: UA failed capabilities check: ' + e.message
      );
      var fallback = 'https://outdated-browser.com';
      if (window.MemberSpace && window.MemberSpace.subdomain) {
        fallback = fallback + '?subdomain=' + window.MemberSpace.subdomain;
      }
      window.location.href = fallback;
    }
  }

  var overrideBundleSource = sessionStorage.getItem('ms-bundleSource');
  if (overrideBundleSource && overrideBundleSource !== currentBundleSource) {
    alternateInit(overrideBundleSource);
    return;
  }

  init();
  testCapabilities();
})();
