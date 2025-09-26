// Example URLs: 
// https://github.com/Tradeylouish/iponz_linker?pt=519157
// https://github.com/Tradeylouish/iponz_linker?ds=433816
// https://github.com/Tradeylouish/iponz_linker?tm=1263964
const current_Url = new URL(window.location.href);
const params = new URLSearchParams(current_Url.search);

const register = params.get('register');
const number = params.get('number');
const agent = params.get('agent');
const applicant = params.get('applicant');
const classification = params.get('classification');
const filingDateFrom = params.get('filingDateFrom');
const filingDateTo = params.get('filingDateTo');

// Basic validation: check if register is present
if (register) {
  chrome.storage.sync.set({ register, number, agent, applicant, classification, filingDateFrom, filingDateTo }, redirect);
}

function redirect() {
  window.location.replace('https://app.iponz.govt.nz/app/Extra/Default.aspx?op=EXTRA_' + register + '_qbe&fcoOp=EXTRA__Default&directAccess=true');
}
