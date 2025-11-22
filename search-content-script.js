// Convert ISO format dates to slash separated e.g. 01/01/2025
function convertToSlashesDate(dateStr) {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

chrome.storage.local.get(['params'], runSearch);

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
      const fullId = `${mapping.prefix}txt${mapping[key]}`;
      const field = document.getElementById(fullId);
      if (field) {
        let valueToSet = value;
        if (key.includes('Date')) {
          valueToSet = convertToSlashesDate(value);
        }
        field.value = valueToSet;
      }
    }
  }

  // After all the fields are filled, click the search button to run the search
  const searchButton = document.getElementById(`${mapping.prefix}${mapping.button}`);
  if (searchButton) {
    // Focus to faciliate easy manual search by pressing Enter, in case the dispatched click fails
    searchButton.focus();

    // Ensure the click is not dispatched multiple times, so search is not rerun unnecessarily
    let clicked = false;
    const dispatchClick = () => {
      if (!clicked) {
        clicked = true;
        // The proxy-click script runs in the MAIN world of the DOM, to avoid the js of the button being blocked by CSP
        window.dispatchEvent(new MouseEvent('proxy-click', { relatedTarget: searchButton }));
      }
    };

    // Wait for the page to finish applying styles, before running the search. Search breaks styling otherwise
    const observer = new MutationObserver(() => {
      observer.disconnect();
      dispatchClick();
    });
    observer.observe(searchButton, { attributes: true, attributeFilter: ['style', 'class'] });

    // Fallback timeout of one second in case styling finish was missed
    setTimeout(() => {
      observer.disconnect();
      dispatchClick();
    }, 1000);
  }

  // After the search is run, remove the data from storage to allow normal use of register
  chrome.storage.local.remove(['params']);
}
