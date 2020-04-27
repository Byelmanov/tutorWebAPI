'use strict';

// this function show an error message
function putTextInAlertAndShowIt(text) {
    document.getElementById('alertErrorText').innerText = text;
    document.getElementById('alertError').style.display = 'block';
}

// this function show a succes message
function putTextInSuccessAlertAndShowIt(text) {
    document.getElementById('alertSuccessText').innerText = text;
    document.getElementById('alertSuccess').style.display = 'block';
}

// this function hide an error message
document.getElementById('alertErrorCross').addEventListener('click', function () {
    document.getElementById('alertError').style.display = 'none';
});

// this function hide a succes message
document.getElementById('alertSuccessCross').addEventListener('click', function () {
    document.getElementById('alertSuccess').style.display = 'none';
});