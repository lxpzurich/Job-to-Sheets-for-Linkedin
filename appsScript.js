function doGet(e) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var params = e.parameter;
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var descColumnIndex = headers.indexOf("Job Description") + 1;
    if (descColumnIndex === 0) {
        return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'message': 'Job Description column not found' })).setMimeType(ContentService.MimeType.JSON);
    }

    if ('jobDescChunk' in params) {
        var dataRange = sheet.getRange(2, descColumnIndex, sheet.getLastRow() - 1, 1);
        var data = dataRange.getValues();
        var placeholderRow = -1;

        for (var i = 0; i < data.length; i++) {
            if (data[i][0].indexOf('replace_job_desc_with_chunks') !== -1) {
                placeholderRow = i + 2;
                break;
            }
        }

        if (placeholderRow === -1) {
            return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'message': 'Placeholder not found' })).setMimeType(ContentService.MimeType.JSON);
        }

        var currentDesc = sheet.getRange(placeholderRow, descColumnIndex).getValue();
        currentDesc += params.jobDescChunk;

        if (params.isLast === 'true') {
            currentDesc = currentDesc.replace('replace_job_desc_with_chunks', '');
        }

        sheet.getRange(placeholderRow, descColumnIndex).setValue(currentDesc);
    } else {
        sheet.appendRow([params.jobTitle, params.pageURL, params.workType, params.companyName, params.location, 'replace_job_desc_with_chunks']);
    }

    return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' })).setMimeType(ContentService.MimeType.JSON);
}