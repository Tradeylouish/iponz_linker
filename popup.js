const iponz_url = 'https://app.iponz.govt.nz/app/Extra/IP/';

document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    if (tab.url.startsWith(iponz_url)) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["link-content-script.js"]
      });
    } else {
      document.getElementById('status').textContent = 'Visit an IPONZ register to create links:';
      document.getElementById('register-links').style.display = 'block';
    }
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'linkGenerated') {
    navigator.clipboard.writeText(request.link).then(() => {
      document.getElementById('status').style.display = 'none';
      const linkDisplay = document.getElementById('link-display');
      const linkElement = document.getElementById('link');
      linkElement.href = request.link;
      linkElement.textContent = request.link;
      linkDisplay.style.display = 'block';
    }).catch((error) => {
      console.error('Failed to copy to clipboard:', error);
      document.getElementById('status').textContent = 'Failed to copy to clipboard.';
    });
  }
});
