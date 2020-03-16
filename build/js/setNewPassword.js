'use strict';

function checkPassword(str) {
    if (str.length < 4 || str == "" || str == null || str == undefined) {
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
        document.querySelector('.setNewPassword__submit').style.background = '#fdf7cb';
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
        document.querySelector('.setNewPassword__submit').style.background = '#fdf7cb';
    }

    if (checkAllInputs()) {
        allDataIsValid();
    }
});

function allDataIsValid() {
    document.getElementById('passwordLength').style.visibility = "hidden";
    document.getElementById('passwordsAreNotTheSame').style.visibility = "hidden";
    document.querySelector('.setNewPassword__submit').style.background = '#f9e547';

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
    let formData = new FormData(form);
    let action = form.getAttribute('action');
    let xhr = new XMLHttpRequest();

    try {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status == 200) {
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

        xhr.open('POST', action);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(formData);

    } catch (e) {
        console.log(e);
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
