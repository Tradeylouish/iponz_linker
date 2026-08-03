var title = document.title;
var data;
if (title.startsWith('Search ')) {
  data = extractSearchData(title);
} else {
  data = extractRecordData(title);
}
var link = createLink(data);
chrome.runtime.sendMessage({action: 'linkGenerated', link: link});

function extractRecordData(title) {
  const chunks = title.split(' - ');
  // Ignore "Session Expired: " text if present
  const app_number = chunks[0].includes("Session ") ? chunks[0].split(' ')[2] : chunks[0];

  let register;
  if (chunks[1].includes('Patent') || chunks[1].includes('PCT')) {
    register = 'pt';
  } else if (chunks[1].includes('Design')) {
    register = 'ds';
  } else if (chunks[1].includes('Trade Mark') || chunks[1].includes('International')) {
    register = 'tm';
  }

  return { register, number: app_number };
}

// Convert slash separated date e.g. 01/01/2025 to ISO format
function convertToISO(dateStr) {
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
  }
  return dateStr;
}

function extractSearchData(title) {
  let register;
  if (title.includes('Patent')) {
    register = 'pt';
  } else if (title.includes('Design')) {
    register = 'ds';
  } else if (title.includes('Trade Mark')) {
    register = 'tm';
  }

  const data = { register };
  // Use the mappings defined in mappings.js to iterate over all search fields and retrieve their data
  const mapping = fieldMappings[register];
  Object.keys(mapping).forEach(key => {
    if (key !== 'button' && key !== 'prefix' && key !== 'dropdowns' && key !== 'checkboxes' && key !== 'radios') {
      const fullId = `#${mapping.prefix}txt${mapping[key]}`;
      const field = document.querySelector(fullId);
      if (field && field.value.trim()) {
        let value = field.value.trim();
        // Convert any dates to ISO format for readability in the URL, using key to identify
        if (key.includes('Date')) {
          value = convertToISO(value);
        }
        data[key] = value;
      }
    }
  });

  // Extract dropdown values
  if (mapping.dropdowns) {
    Object.keys(mapping.dropdowns).forEach(key => {
      const fullId = `#${mapping.prefix}${mapping.dropdowns[key]}`;
      const field = document.querySelector(fullId);
      if (field && field.value && field.value !== '-1') {
        data[key] = field.value;
      }
    });
  }

  // Extract checkbox values
  if (mapping.checkboxes) {
    Object.keys(mapping.checkboxes).forEach(key => {
      const fullId = `#${mapping.prefix}${mapping.checkboxes[key]}`;
      const field = document.querySelector(fullId);
      if (field && field.checked) {
        data[key] = 'true';
      }
    });
  }

  // Extract radio button values
  if (mapping.radios) {
    const namePrefix = 'ctl00$' + mapping.prefix.replace(/_/g, '$');
    Object.keys(mapping.radios).forEach(key => {
      const radioName = `${namePrefix}${mapping.radios[key]}`;
      const checkedRadio = document.querySelector(`input[name="${radioName}"]:checked`);
      if (checkedRadio) {
        // Only include if the value differs from the default selection
        // For rblTxtDeno default is '0' (Word), for others default is '-1' (Undefined)
        const defaults = { titleType: '0', series: '-1', maori: '-1' };
        if (checkedRadio.value !== (defaults[key] || '-1')) {
          data[key] = checkedRadio.value;
        }
      }
    });
  }

  return data;
}



function createLink(data) {
  const params = new URLSearchParams();
  Object.keys(data).forEach(key => {
    if (data[key]) {
      params.append(key, data[key]);
    }
  });
  const link = `https://iponz.link?${params.toString()}`;
  console.log(link);
  return link;
}
