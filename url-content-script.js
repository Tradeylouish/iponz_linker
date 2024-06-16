// Example URLs: 
// https://github.com/Tradeylouish/iponz_linker?pt=519157
// https://github.com/Tradeylouish/iponz_linker?ds=519157
// https://github.com/Tradeylouish/iponz_linker?tm=519157
const current_Url = new URL(window.location.href);
const search_string = current_Url.search; // In format: ?pt=519157

const register = search_string.slice(1, 3);
const app_number = search_string.slice(4);

chrome.storage.sync.set({register: register, app_number: app_number}, function() {
    window.location.replace('https://app.iponz.govt.nz/app/Extra/Default.aspx?op=EXTRA_' + register + '_qbe&fcoOp=EXTRA__Default&directAccess=true')
})