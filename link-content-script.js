var title = document.title;
var data = extract_data(title);
var link = create_link(data);
copy_text(link);

function extract_data(title) {
  const chunks = title.split(' - ');
  // Ignore "Session Expired: " text if present 
  const app_number = chunks[0].includes("Session ") ? chunks[0].split(' ')[2] : chunks[0];

  if (chunks[1].includes('Patent') || chunks[1].includes('PCT')) {
    register = 'pt';
  } else if (chunks[1].includes('Design')) {
    register = 'ds';
  } else if (chunks[1].includes('Trade Mark') || chunks[1].includes('International')) {
    register = 'tm';
  }

  return { app_number, register };
}

function copy_text(text) {
  try {
    navigator.clipboard.writeText(text);
    alert("Copied link to clipboard: " + text);
  } catch (error) {
    console.error(error);
  }
}

function create_link(data) {
  const link = 'https://github.com/Tradeylouish/iponz_linker?' + data.register + '=' + data.app_number;
  console.log(link);
  return link;
}