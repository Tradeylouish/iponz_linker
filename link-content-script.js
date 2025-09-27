var title = document.title;
var data;
if (title.startsWith('Search ')) {
  data = extractSearchData(title);
} else {
  data = extractRecordData(title);
}
var link = createLink(data);
copyText(link);

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
    if (key !== 'button' && key !== 'prefix') {
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
  return data;
}

function copyText(text) {
  try {
    navigator.clipboard.writeText(text);
    alert("Copied link to clipboard: " + text);
  } catch (error) {
    console.error(error);
  }
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
