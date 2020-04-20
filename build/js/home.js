'use strict';

document.getElementById('editEmailCross').addEventListener('click', hideEditEmailSection);
document.getElementById('editEmailButton').addEventListener('click', showEditEmailSection);

document.getElementById('editPasswordCross').addEventListener('click', hideEditPasswordSection);
document.getElementById('editPasswordButton').addEventListener('click', showEditPasswordSection);

function hideEditEmailSection() {
    document.getElementById('editEmailSection').style.display = 'none';
    document.removeEventListener('keydown', checkEscAndHideWindow);
}
function showEditEmailSection() {
    document.getElementById('editEmailSection').style.display = 'flex';
    document.addEventListener('keydown', checkEscAndHideWindow);
}
function hideEditPasswordSection() {
    document.getElementById('editPasswordSection').style.display = 'none';
    document.removeEventListener('keydown', checkEscAndHideWindow);
}
function showEditPasswordSection() {
    document.getElementById('editPasswordSection').style.display = 'flex';
    document.addEventListener('keydown', checkEscAndHideWindow);
}

function checkEscAndHideWindow(e) {
    e = e || window.event;
    if (e.keyCode === 27) {
        hideEditEmailSection();
        hideEditPasswordSection();
    }
}



let formEditEmail = document.forms['editEmail'];
formEditEmail.addEventListener('submit', function (e) {
    e.preventDefault();
    let email = document.getElementById('editEmailInput').value;
    if (checkEmail(email)) {
        sendAjaxEditEmail();
    }
});

function sendAjaxEditEmail() {
    let formData = new FormData(formEditEmail);
    let action = formEditEmail.getAttribute('action');
    let xhr = new XMLHttpRequest();

    try {

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                hideEditEmailSection();
                if (xhr.status == 200) {
                    putTextInSuccessAlertAndShowIt('Данные успешно обновлены');
                } else {
                    try {
                        let arrayJSON = JSON.parse(xhr.responseText);
                        let errors = arrayJSON.errors;
                        if (errors) {
                            let strWithError = '';
                            for (let error in errors) {
                                strWithError += error + '\n';
                            }
                            putTextInAlertAndShowIt(strWithError);
                        } else {
                            putTextInAlertAndShowIt('Упс, что-то пошло не так(');
                        }
                    } catch (e) {
                        putTextInAlertAndShowIt('Упс, что-то пошло не так(');
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


let formEditPassword = document.forms['editPassword'];
formEditPassword.addEventListener('submit', function (e) {
    e.preventDefault();
    if (checkAllInputs()) {
        sendAjaxEditPassword();
    }
});

function sendAjaxEditPassword() {
    let formData = new FormData(formEditPassword);
    let action = formEditPassword.getAttribute('action');
    let xhr = new XMLHttpRequest();

    try {

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                hideEditPasswordSection();
                if (xhr.status == 200) {
                    putTextInSuccessAlertAndShowIt('Данные успешно обновлены');
                } else {
                    try {
                        let arrayJSON = JSON.parse(xhr.responseText);
                        let errors = arrayJSON.errors;
                        if (errors) {
                            let strWithError = '';
                            for (let error in errors) {
                                strWithError += error + '\n';
                            }
                            putTextInAlertAndShowIt(strWithError);
                        } else {
                            putTextInAlertAndShowIt('Упс, что-то пошло не так(');
                        }
                    } catch (e) {
                        putTextInAlertAndShowIt('Упс, что-то пошло не так(');
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

function checkEmail(str) {
    str = str.toString();
    var regExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (regExp.test(str)) {
        return true;
    } else {
        return false;
    }
}
function checkPassword(str) {
    if (str.length < 4 || str == "" || str == null || str == undefined) {
        return false;
    } else {
        return true;
    }
}


document.getElementById('editEmailInput').addEventListener('input', function () {
    let value = this.value;
    let button = document.querySelector('.editEmail__submit');
    if (checkEmail(value)) {
        button.style.background = '#f9e547';
    } else {
        button.style.background = '#fdf7cb';
    }
});

document.getElementById('passwordInput').addEventListener('input', function () {
    let passwordValue = this.value;
    let capture = document.getElementById('passwordLength');
    if (checkPassword(passwordValue)) {
        capture.style.visibility = "hidden";
    } else {
        capture.style.visibility = 'visible';
        document.querySelector('.editPassword__submit').style.background = '#fdf7cb';
    }

    if (checkAllInputs()) {
        allDataIsValid();
    }
});

document.getElementById('passwordRepeatInput').addEventListener('input', function () {
    let passwordRepeat = this.value;
    let password = document.getElementById('passwordInput').value;
    let capture = document.getElementById('passwordsAreNotTheSame');

    if (passwordRepeat === password) {
        capture.style.visibility = "hidden";
    } else {
        capture.style.visibility = 'visible';
        document.querySelector('.editPassword__submit').style.background = '#fdf7cb';
    }

    if (checkAllInputs()) {
        allDataIsValid();
    }
});


function checkAllInputs() {
    let password = document.getElementById('passwordInput').value;
    let passwordRepeat = document.getElementById('passwordRepeatInput').value;
    if (checkPassword(password) && password === passwordRepeat) {
        return true;
    } else {
        return false;
    }
}

function allDataIsValid() {
    document.getElementById('passwordLength').style.visibility = "hidden";
    document.getElementById('passwordsAreNotTheSame').style.visibility = "hidden";
    document.querySelector('.editPassword__submit').style.background = '#f9e547';
}