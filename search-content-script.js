// Convert ISO format dates to slash separated e.g. 01/01/2025
function convertToSlashesDate(dateStr) {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

chrome.storage.sync.get(['params'], runSearch);

function runSearch(storage) {
  const params = new URLSearchParams(storage.params);
  // Exit if there's no data to load
  if (!params || !params.has('register')) {
    return 0;
  }

  // fieldMappings defined in the mappings.js script
  const mapping = fieldMappings[params.get('register')];
  if (!mapping) return;

  // Fill fields
  for (const [key, value] of params) {
    if (key !== 'register' && mapping[key] && value) {
      const fullId = `#${mapping.prefix}txt${mapping[key]}`;
      const field = document.querySelector(fullId);
      if (field) {
        let valueToSet = value;
        if (key.includes('Date')) {
          valueToSet = convertToSlashesDate(value);
        }
        field.value = valueToSet;
      }
    }
  }

  // Click the search button
  const searchButton = document.querySelector(`#${mapping.prefix}${mapping.button}`);
  if (searchButton) {
    // Focus to make manual search easier in case the automatic click fails
    searchButton.focus();
    // The proxy-click script runs in the MAIN world of the DOM, to avoid the js of the button being blocked by CSP
    window.dispatchEvent(new MouseEvent('proxy-click', { relatedTarget: searchButton }));
  }

  // After the search is run, remove the data from storage to allow normal use of register
  chrome.storage.sync.remove(['params']);
}
