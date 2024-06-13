setTimeout(run_search(), 3000)

function run_search() {

    const app_number = chrome.storage.local.get('app_number')

    const search_field = document.querySelector('#MainContent_ctrlPTSearch_txtGtNr');
    const search_button = document.querySelector('#MainContent_ctrlPTSearch_lnkbtnSearch');

    search_field.focus();
    document.execCommand('insertText', false, app_number);
    search_field.dispatchEvent(new Event('change', {bubbles: true})); // usually not needed

    search_button.focus();
    search_button.click();

    chrome.storage.local.remove('app_number')
}