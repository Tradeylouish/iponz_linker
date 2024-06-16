chrome.storage.sync.get(['register', 'app_number'], function(data) {

    var field_id = '';
    var button_id = '';

    switch(data.register) {
        case 'pt':
            field_id = '#MainContent_ctrlPTSearch_txtGtNr';
            button_id = '#MainContent_ctrlPTSearch_lnkbtnSearch'
            break;
        case 'ds':
            field_id = '#MainContent_ctrlDSSearch_txtAppNr';
            button_id = '#MainContent_ctrlDSSearch_lnkbtnSearch';
            break;
        case 'tm':
            field_id = '#MainContent_ctrlTMSearch_txtAppNr';
            button_id = '#MainContent_ctrlTMSearch_lnkbtnSearch';
    }
    const search_field = document.querySelector(field_id);
    const search_button = document.querySelector(button_id);

    search_field.focus();
    document.execCommand('insertText', false, data.app_number);
    search_field.dispatchEvent(new Event('change', {bubbles: true})); // usually not needed

    search_button.focus();
    search_button.click();

    chrome.storage.local.remove(['app_number', 'register']);
})