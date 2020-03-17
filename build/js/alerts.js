'use strict';

function putTextInAlertAndShowIt(text) {
    document.getElementById('alertErrorText').innerText = text;
    document.getElementById('alertError').style.display = 'block';
}

function putTextInSuccessAlertAndShowIt(text) {
    document.getElementById('alertSuccessText').innerText = text;
    document.getElementById('alertSuccess').style.display = 'block';
}

document.getElementById('alertErrorCross').addEventListener('click', function () {
    document.getElementById('alertError').style.display = 'none';
});

document.getElementById('alertSuccessCross').addEventListener('click', function () {
    document.getElementById('alertSuccess').style.display = 'none';
});