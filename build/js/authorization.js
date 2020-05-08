'use strict';

let form = document.forms['authorization'];

form.addEventListener('submit', function (e) {
    e.preventDefault();
    let password = document.getElementById('password').value;
    let login = document.getElementById('login').value;

    if (checkAllInputsAreEmpty()) {
        sendAuthorizationAjax();
    } else if (checkEmail(login) && !checkPasswordLength(password)) {
        putTextInAlertAndShowIt('Короткий пароль!');
    } else if (!checkEmail(login) && checkPasswordLength(password)) {
        putTextInAlertAndShowIt('Неправильный формат почты!');
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
                    putTextInAlertAndShowIt('Упс, что-то пошло не так(');
                    throw new Error('404 server not found');
                }

                if (xhr.status == 200) {
                    let arrayJSON = JSON.parse(xhr.responseText);
                    let linkToRedirect = arrayJSON.redirect;
                    if (linkToRedirect) {
                        window.location.href = linkToRedirect;
                    } else {
                        putTextInAlertAndShowIt('Упс, что-то пошло не так(');
                        throw new Error('cant find link');
                    }

                } else {
                    try {
                        let arrayJSON = JSON.parse(xhr.responseText);
                        let arrayOfErrors = arrayJSON.errors;
                        let strWithErrors = '';
                        for (let error in arrayOfErrors) {
                            strWithErrors += error[0] + '\n';
                        }
                        putTextInAlertAndShowIt(strWithErrors);
                    } catch (e) {
                        putTextInAlertAndShowIt('Упс, что-то пошло не так(');
                        console.log(e);
                    }

                }
            }
        }

        xhr.open('POST', action);
        xhr.setRequestHeader('Accept', 'application/json');
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
    if (str.length < 8) {
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
        submitButton.classList.add('authorization__submit--active');
    } else {
        submitButton.classList.remove('authorization__submit--active');
    }

});
document.getElementById('password').addEventListener('input', function () {
    let password = this.value;
    let submitButton = document.getElementById('submit');

    if (checkAllInputsAreEmpty()) {
        submitButton.classList.add('authorization__submit--active');
    } else {
        submitButton.classList.remove('authorization__submit--active');
    }

});
