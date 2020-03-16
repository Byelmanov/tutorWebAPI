'use strict';

let form = document.forms['sendVerificationEmailAgain'];

form.addEventListener('submit', function (e) {
    e.preventDefault();
    sendAjax();
});

function sendAjax() {
    let formData = new FormData(form);
    let action = form.getAttribute('action');
    let xhr = new XMLHttpRequest();

    try {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status == 404) {
                    throw new Error(xhr.status + ": " + xhr.statusText);
                }
                if (xhr.status == 200) {
                    let arrayJSON = JSON.parse(xhr.responseText);
                    let linkToRedirect = arrayJSON.redirect;
                    if (linkToRedirect) {
                        window.location.href = linkToRedirect;
                    } else {
                        let message = arrayJSON.message;
                        if (message) {
                            putTextInSuccessAlertAndShowIt(message);
                        } else {
                            throw new Error('cant find message');
                        }
                    }
                } else {
                    putTextInAlertAndShowIt('Упс, что-то пошло не так(');
                }
            }
        }

        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.open("POST", action);
        xhr.send(formData);

    } catch (e) {
        console.log(e);
        putTextInAlertAndShowIt('Упс, что-то пошло не так(');
    }
}

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

