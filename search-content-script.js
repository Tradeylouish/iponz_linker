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

  // Fill text fields
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

  // Fill dropdowns
  if (mapping.dropdowns) {
    for (const [key, value] of params) {
      if (key !== 'register' && mapping.dropdowns[key] && value) {
        const fullId = `${mapping.prefix}${mapping.dropdowns[key]}`;
        const field = document.getElementById(fullId);
        if (field) {
          field.value = value;
        }
      }
    }
  }

  // Fill checkboxes
  if (mapping.checkboxes) {
    for (const [key, value] of params) {
      if (key !== 'register' && mapping.checkboxes[key] && value) {
        const fullId = `${mapping.prefix}${mapping.checkboxes[key]}`;
        const field = document.getElementById(fullId);
        if (field) {
          field.checked = value === 'true' || value === '1';
        }
      }
    }
  }

  // Fill radio buttons
  if (mapping.radios) {
    // Derive the ASP.NET name prefix from the id prefix:
    // 'MainContent_ctrlTMSearch_' -> 'ctl00$MainContent$ctrlTMSearch$'
    const namePrefix = 'ctl00$' + mapping.prefix.replace(/_/g, '$');
    for (const [key, value] of params) {
      if (key !== 'register' && mapping.radios[key] && value) {
        const radioName = `${namePrefix}${mapping.radios[key]}`;
        const radio = document.querySelector(`input[name="${radioName}"][value="${value}"]`);
        if (radio) {
          radio.checked = true;
        }
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

        // Expand every collapsible section that contains a filled input.
        // This prevents the page from collapsing sections the user filled in.
        expandFilledSections(mapping);

        // The proxy-click script runs in the MAIN world of the DOM, to avoid the js of the button being blocked by CSP
        window.dispatchEvent(new MouseEvent('proxy-click', { relatedTarget: searchButton }));
      }
    };

    // Wait for the page to finish applying styles, before running the search. Search breaks styling otherwise.
    // We wait for the button to have jQuery UI's ui-button class AND for the document to be fully initialized
    // (readyState === 'complete'). The MutationObserver alone fires on the first attribute change, which can be
    // too early — collapsible section handlers may not be bound yet, causing sections to collapse unexpectedly.
    let observerDisconnected = false;
    const tryDispatch = () => {
      if (observerDisconnected && document.readyState === 'complete' && !clicked) {
        dispatchClick();
      }
    };

    // Check if button is already styled (page may have loaded before this script ran)
    if (searchButton.classList.contains('ui-button')) {
      observerDisconnected = true;
      tryDispatch();
    }

    const observer = new MutationObserver(() => {
      observer.disconnect();
      observerDisconnected = true;
      tryDispatch();
    });
    observer.observe(searchButton, { attributes: true, attributeFilter: ['class'] });

    // Fallback timeout of one second in case styling finish was missed
    setTimeout(() => {
      observer.disconnect();
      observerDisconnected = true;
      tryDispatch();
    }, 1000);

    // Also listen for the load event in case the page is still loading
    if (document.readyState !== 'complete') {
      window.addEventListener('load', () => {
        tryDispatch();
      }, { once: true });
    }
  }

  // After the search is run, remove the data from storage to allow normal use of register
  chrome.storage.local.remove(['params']);
}

/**
 * Expands all collapsible sections that contain at least one filled input field.
 * On the IPONZ registers, each section has a header element (h3/h4) with an id ending
 * in '_header' and class 'expanded' or 'collapsed'.  Clicking a collapsed header
 * expands it.  We only click headers that are collapsed AND whose section contains
 * a non-empty form input.
 */
function expandFilledSections(mapping) {
  // Find all collapsible headers on the page
  const headers = document.querySelectorAll('[id$="_header"].collapsed');
  headers.forEach(header => {
    // The section content follows the header as a sibling.  Walk forward until
    // we find the containing block (a div, table, or fieldset).
    let container = header.nextElementSibling;
    if (container) {
      // Check whether any input, select, or textarea inside this container has a value
      const inputs = container.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea');
      let hasValue = false;
      for (const input of inputs) {
        if (input.type === 'checkbox' || input.type === 'radio') {
          if (input.checked) {
            hasValue = true;
            break;
          }
        } else {
          if (input.value && input.value.trim()) {
            hasValue = true;
            break;
          }
        }
      }
      if (hasValue) {
        // Simulate a click on the header to expand the section
        header.click();
      }
    }
  });
}
