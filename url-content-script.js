const app_number = '519157';

chrome.storage.local.set({app_number: app_number})

window.location.replace('https://app.iponz.govt.nz/app/Extra/Default.aspx?op=EXTRA_pt_qbe&fcoOp=EXTRA__Default&directAccess=true')