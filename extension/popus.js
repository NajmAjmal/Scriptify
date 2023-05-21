document.addEventListener('DOMContentLoaded', function() {
  var featureDropdown = document.getElementById('feature-dropdown');
  var siteSelector = document.getElementById('site-selector');
  var scriptEditor = document.getElementById('script-editor');
  var siteSelect = document.getElementById('site-select');
  var editScriptBtn = document.getElementById('edit-script-btn');
  var scriptInput = document.getElementById('script-input');

  featureDropdown.addEventListener('change', function() {
    var selectedFeature = featureDropdown.value;
    hideAllSections();
    if (selectedFeature === 'edit') {
      showSection(siteSelector);
      populateSiteSelector();
    } else if (selectedFeature === 'add') {
      showSection(scriptEditor);
    } else if (selectedFeature === 'settings') {
      showSection(document.getElementById('settings'));
    }
  });

  siteSelect.addEventListener('change', function() {
    var selectedSite = siteSelect.value;
    loadSavedScript(selectedSite);
  });

  editScriptBtn.addEventListener('click', function() {
    var selectedSite = siteSelect.value;
    var scriptCode = scriptInput.value;
    saveScript(selectedSite, scriptCode);
    executeScript(selectedSite, scriptCode);
  });

  function hideAllSections() {
    var sections = document.querySelectorAll('.section');
    sections.forEach(function(section) {
      section.classList.add('hidden');
    });
  }

  function showSection(section) {
    section.classList.remove('hidden');
  }

  function populateSiteSelector() {
    chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
      var tab = tabs[0];
      var selectedSite = getHostname(tab.url);
      if (selectedSite) {
        siteSelect.value = selectedSite;
        loadSavedScript(selectedSite);
      }
    });
  }

  function getHostname(url) {
    var hostname = new URL(url).hostname;
    return hostname.startsWith('www.') ? hostname.substring(4) : hostname;
  }

  function loadSavedScript(site) {
    chrome.storage.sync.get('scripts', function(data) {
      var scripts = data.scripts || {};
      var scriptCode = scripts[site] || '';
      scriptInput.value = scriptCode;
    });
  }

  function saveScript(site, scriptCode) {
    chrome.storage.sync.get('scripts', function(data) {
      var scripts = data.scripts || {};
      scripts[site] = scriptCode;
      chrome.storage.sync.set({ 'scripts': scripts });
    });
  }

  function executeScript(site, scriptCode) {
    chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
      var tab = tabs[0];
      chrome.tabs.executeScript(tab.id, { code: scriptCode });
    });
  }
});
