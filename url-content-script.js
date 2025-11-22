// Example URLs:
// https://github.com/Tradeylouish/iponz_linker?register=pt&number=519157
// https://github.com/Tradeylouish/iponz_linker?register=ds&number=433816
// https://github.com/Tradeylouish/iponz_linker?register=tm&number=1263964
const current_Url = new URL(window.location.href);
const params = new URLSearchParams(current_Url.search);

// Basic validation: check if register is present
if (params.has("register")) {
  chrome.storage.local.set({ params: params.toString() }, redirect);
}

function redirect() {
  window.location.replace(`https://app.iponz.govt.nz/app/Extra/Default.aspx?op=EXTRA_${params.get('register')}_qbe&fcoOp=EXTRA__Default&directAccess=true`);
}
