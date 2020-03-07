'use strict';

let form = document.forms['authorization'];

form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (checkAllInputsAreEmpty()) {
        sendAuthorizationAjax();
    } else {
        putTextInAlertAndShowIt('Заполните все поля!');
    }
});

function sendAuthorizationAjax() {
    let formData = new FormData(form);
    let action = form.getAttribute('action');
    let xhr = new XMLHttpRequest();

    try {

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                let arrayJSON = JSON.parse(xhr.responseText);
                if (xhr.status == 200) {

                    if (arrayJSON.result == 'ok') {
                        let linkToRedirect = arrayJSON.link;

                        if (linkToRedirect) {
                            window.location.href = linkToRedirect;
                        } else {
                            throw new Error('cant find link');
                        }

                    } else {
                        putTextInAlertAndShowIt(arrayJSON.result);
                    }

                } else {

                    let error = arrayJSON.error;
                    if (error) {
                        putTextInAlertAndShowIt(error);
                    } else {
                        putTextInAlertAndShowIt('Что-то пошло не так(');
                        throw new Error('cant find error in JSON');
                    }

                }
            }
        }



    } catch (e) {
        console.log(e);
    }
}


function checkAllInputsAreEmpty() {
    let login = document.getElementById('login').value;
    let password = document.getElementById('password').value;
    if (checkStringIsEmpty(login) && checkStringIsEmpty(password) && checkPasswordLength(password)) {
        return true;
    } else {
        return false;
    }
}

function checkStringIsEmpty(str) {
    if (str == "" || str == null || str == undefined) {
        return false;
    } else {
        return true;
    }
}

function checkPasswordLength(str) {
    if (str.length < 4) {
        return false;
    } else {
        return true;
    }
}

document.getElementById('login').addEventListener('input', function () {
    let submitButton = document.getElementById('submit');
    if (checkAllInputsAreEmpty()) {
        submitButton.style.background = '#f9e547';
    } else {
        submitButton.style.background = '#fdf7cb';
    }

});
document.getElementById('password').addEventListener('input', function () {
    let password = this.value;
    let warning = document.querySelector('.authorization__captureWarning');
    let submitButton = document.getElementById('submit');
    if (!checkPasswordLength(password)) {
        warning.style.visibility = 'visible';
        if (checkAllInputsAreEmpty()) {
            submitButton.style.background = '#f9e547';
        } else {
            submitButton.style.background = '#fdf7cb';
        }
    } else {
        warning.style.visibility = 'hidden';
        if (checkAllInputsAreEmpty()) {
            submitButton.style.background = '#f9e547';
        } else {
            submitButton.style.background = '#fdf7cb';
        }
    }
});

function putTextInAlertAndShowIt(text) {
    document.getElementById('alertText').innerText = text;
    document.getElementById('alert').style.display = 'block';
}

document.getElementById('alertCross').addEventListener('click', function () {
    document.getElementById('alert').style.display = 'none';
});