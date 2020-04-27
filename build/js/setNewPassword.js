'use strict';

function checkPassword(str) {
    if (str.length < 8 || str == "" || str == null || str == undefined) {
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

document.getElementById('passwordInput').addEventListener('input', function () {
    let passwordValue = this.value;
    let capture = document.getElementById('passwordLength');
    if (checkPassword(passwordValue)) {
        capture.style.visibility = "hidden";
    } else {
        capture.style.visibility = 'visible';
        document.querySelector('.setNewPassword__submit').classList.remove('setNewPassword__submit--active');
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
        document.querySelector('.setNewPassword__submit').classList.remove('setNewPassword__submit--active');
    }

    if (checkAllInputs()) {
        allDataIsValid();
    }
});

function allDataIsValid() {
    document.getElementById('passwordLength').style.visibility = "hidden";
    document.getElementById('passwordsAreNotTheSame').style.visibility = "hidden";
    document.querySelector('.setNewPassword__submit').classList.add('setNewPassword__submit--active');

}

function checkAllInputs() {
    let email = document.getElementById('emailInput').value;
    let password = document.getElementById('passwordInput').value;
    let passwordRepeat = document.getElementById('passwordRepeatInput').value;
    if (checkEmail(email) && checkPassword(password) && password === passwordRepeat) {
        return true;
    } else {
        return false;
    }
}

let form = document.forms['setNewPassword'];
form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (checkAllInputs()) {
        sendAjaxSetNewPassword();
    }
});

function sendAjaxSetNewPassword() {
    let formData = new FormData(form); // creating form data object
    let action = form.getAttribute('action'); // getting an action attribute from html 
    let xhr = new XMLHttpRequest(); // creating new http request without reloading a page

    try {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status == 422) {
                    putTextInAlertAndShowIt('Упс, что-то пошло не так(');
                    throw new Error(xhr.status + ": " + xhr.statusText);
                } else if (xhr.status == 200) {
                    let linkToRedirect = JSON.parse(xhr.responseText).redirect;
                    if (linkToRedirect) {
                        window.location.href = linkToRedirect;
                    } else {
                        putTextInAlertAndShowIt('Упс, что-то пошло не так(');
                        throw new Error('cant find link');
                    }
                } else {
                    putTextInAlertAndShowIt('Упс, что-то пошло не так(');
                }
            }
        }

        xhr.open('POST', action); // initial new request
        xhr.setRequestHeader('Accept', 'application/json'); // set header of request
        xhr.send(formData); // send request

    } catch (e) { // if some errors
        console.log(e); // show them in console
    }
}
