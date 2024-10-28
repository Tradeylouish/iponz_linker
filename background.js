const iponz_url = 'https://app.iponz.govt.nz/app/Extra/IP/'

chrome.action.onClicked.addListener(on_click);

function on_click(tab) {
  // Exit if not an IPONZ page
  if (!tab.url.startsWith(iponz_url)) {
    return 0;
  }

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["link-content-script.js"],
  });
}