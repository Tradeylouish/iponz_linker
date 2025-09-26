chrome.storage.sync.get(['register', 'number', 'agent', 'applicant', 'class', 'filingDate'], run_search);

const fieldMappings = {
  pt: {
    number: '#MainContent_ctrlPTSearch_txtGtNr',
    agent: '#MainContent_ctrlPTSearch_txtLocalAgentNameSearch',
    applicant: '#MainContent_ctrlPTSearch_txtapplicantNameSearch',
    classification: '#MainContent_ctrlPTSearch_txtIPCKeywork',
    filingDateFrom: '#MainContent_ctrlPTSearch_txtFilingDateFrom',
    filingDateTo: '#MainContent_ctrlPTSearch_txtFilingDateTo',
    button: '#MainContent_ctrlPTSearch_lnkbtnSearch'
  },
  ds: {
    number: '#MainContent_ctrlDSSearch_txtAppNr',
    agent: '#MainContent_ctrlDSSearch_txtLocalAgentNameSearch',
    applicant: '#MainContent_ctrlDSSearch_txtapplicantNameSearch',
    classification: '#MainContent_ctrlDSSearch_txtLocarnoClassification',
    filingDateFrom: '#MainContent_ctrlDSSearch_txtFilingDateFrom',
    filingDateTo: '#MainContent_ctrlDSSearch_txtFilingDateTo',
    button: '#MainContent_ctrlDSSearch_lnkbtnSearch'
  },
  tm: {
    number: '#MainContent_ctrlTMSearch_txtAppNr',
    agent: '#MainContent_ctrlTMSearch_txtLocalAgentNameSearch',
    applicant: '#MainContent_ctrlTMSearch_txtapplicantNameSearch',
    classification: '#MainContent_ctrlTMSearch_txtNiceClassification',
    filingDateFrom: '#MainContent_ctrlTMSearch_txtFilingDateFrom',
    filingDateTo: '#MainContent_ctrlTMSearch_txtFilingDateTo',
    button: '#MainContent_ctrlTMSearch_lnkbtnSearch'
  }
};

function run_search(data) {
  // Exit if there's no data to load
  if (JSON.stringify(data) === '{}') {
    return 0;
  }

  const mapping = fieldMappings[data.register];
  if (!mapping) return;

  // Fill fields
  Object.keys(mapping).forEach(key => {
    if (key !== 'button' && data[key]) {
      const field = document.querySelector(mapping[key]);
      if (field) {
        field.value = data[key];
      }
    }
  });

  // Focus on number field and insert text if present
  // if (data.number) {
  //   const numberField = document.querySelector(mapping.number);
  //   if (numberField) {
  //     numberField.focus();
  //     document.execCommand('insertText', false, data.number);
  //   }
  // }

  // Click the search button
  const searchButton = document.querySelector(mapping.button);
  if (searchButton) {
    searchButton.focus();
    window.dispatchEvent(new MouseEvent('proxy-click', { relatedTarget: searchButton }));
  }

  chrome.storage.sync.remove(['register', 'number', 'agent', 'applicant', 'class', 'filingDate']);
}
