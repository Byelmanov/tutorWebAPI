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

                if (xhr.status == 404) {
                    putTextInAlertAndShowIt('Что-то пошло не так(');
                    throw new Error('404 server not found');
                }

                let arrayJSON = JSON.parse(xhr.responseText);

                if (xhr.status == 200) {
                    let linkToRedirect = arrayJSON.redirect;
                    if (linkToRedirect) {
                        window.location.href = linkToRedirect;
                    } else {
                        putTextInAlertAndShowIt('Что-то пошло не так(');
                        throw new Error('cant find link');
                    }

                } else {
                    let arrayOfErrors = arrayJSON.errors;
                    if (arrayOfErrors) {
                        let strWithErrors = '';
                        for (let error in arrayOfErrors) {
                            strWithErrors += error + '\n';
                        }
                        putTextInAlertAndShowIt(strWithErrors);
                    } else {
                        putTextInAlertAndShowIt('Что-то пошло не так(');
                    }

                }
            }
        }


        xhr.open('POST', action);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(formData);



    } catch (e) {
        console.log(e);
    }
}


function checkAllInputsAreEmpty() {
    let login = document.getElementById('login').value;
    let password = document.getElementById('password').value;
    if (checkStringIsEmpty(login) && checkEmail(login) && checkStringIsEmpty(password) && checkPasswordLength(password)) {
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

function checkEmail(str) {
    str = str.toString();
    var regExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (regExp.test(str)) {
        return true;
    } else {
        return false;
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