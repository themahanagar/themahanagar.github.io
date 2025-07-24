'use strict';

const indexCfg = { cache: true };

indexCfg.doc = {
  id: 'id',
  field: ['title', 'content'],
  store: ['title', 'href'],
};

const index = FlexSearch.create('balance', indexCfg);

(function() {
  const input = document.querySelector('#search-input');
  const results = document.querySelector('#search-results');

  if (!input) {
    return
  }

  input.addEventListener('focus', init);
  input.addEventListener('keyup', search);

  document.addEventListener('keypress', focusSearchFieldOnKeyPress);

  /**
   * @param {Event} event
   */
  function focusSearchFieldOnKeyPress(event) {
    if (input === document.activeElement) {
      return;
    }

    const characterPressed = String.fromCharCode(event.charCode);
    if (!isHotkey(characterPressed)) {
      return;
    }

    input.focus();
    event.preventDefault();
  }

  /**
   * @param {String} character
   * @returns {Boolean}
   */
  function isHotkey(character) {
    const dataHotkeys = input.getAttribute('data-hotkeys') || '';
    return dataHotkeys.indexOf(character) >= 0;
  }

  function init() {
    input.removeEventListener('focus', init); // init once
    input.required = true;

    (function() {
      window.SearchIndex = index;
    })();
    input.required = false;
    search();
  }

  function search() {
    while (results.firstChild) {
      results.removeChild(results.firstChild);
    }

    if (!input.value) {
      return;
    }

    const searchHits = window.SearchIndex.search(input.value, 10);
    searchHits.forEach(function(page) {
      const li = document.createElement('li'),
            a = li.appendChild(document.createElement('a'));

      a.href = page.href;
      a.textContent = page.title;

      results.appendChild(li);
    });
  }

  /**
   * @param {String} src
   * @param {Function} callback
   */
  function loadScript(src, callback) {
    const script = document.createElement('script');
    script.defer = true;
    script.async = false;
    script.src = src;
    script.onload = callback;

    document.head.appendChild(script);
  }
})();
