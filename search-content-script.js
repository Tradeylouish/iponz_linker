chrome.storage.sync.get(['register', 'app_number'], load_case);

function load_case(data) {
  // Exit if there's no data to load
  if (JSON.stringify(data) === '{}') {
    return 0;
  }
  var field_id = '';
  var button_id = '';

  switch (data.register) {
    case 'pt':
      field_id = '#MainContent_ctrlPTSearch_txtGtNr';
      button_id = '#MainContent_ctrlPTSearch_lnkbtnSearch';
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

  search_button.focus();
  search_button.click();

  chrome.storage.sync.remove(['app_number', 'register']);
}