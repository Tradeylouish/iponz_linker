function extract_data() {
  const title = document.title;
  const chunks = title.split(' - ');
  // Ignore "Session Expired: " text if present 
  const app_number = chunks[0].includes("Session ") ? chunks[0].split(' ')[2] : chunks[0];

  if (chunks[1].includes('Patent')) {
    register = 'pt';
  } else if (chunks[1].includes('Design')) {
    register = 'ds';
  } else if (chunks[1].includes('Trade Mark')) {
    register = 'tm';
  }
  
  chrome.storage.sync.set({register: register, app_number: app_number});
}

function copy_text(text) {
  console.log(text);
  try {
    navigator.clipboard.writeText(text);
    alert("Copied link to clipboard: " + text);
  } catch (error) {
    console.error(error);
  }
}

const iponz_url = 'https://app.iponz.govt.nz/app/Extra/IP/'

// Make this function produce a link and copy to clipboard
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.startsWith(iponz_url)) {
    
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: extract_data,
    });

    chrome.storage.sync.get(['register', 'app_number'], function(data) {
      const link = 'https://github.com/Tradeylouish/iponz_linker?' + data.register + '=' + data.app_number;
      console.log(link);
      chrome.storage.sync.remove(['register, app_number']);

      // Save to clipboard
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: copy_text,
        args: [link],
      });
    
    })
  }
});