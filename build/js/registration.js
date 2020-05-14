'use strict';

function checkIsEmpty(str) {
    if (str == null || str == undefined || str == '') {
        return false;
    } else {
        return true;
    }
}

function checkPassword(str) {
    let strLength = str.length;
    if (str == null || str == undefined || str == '' || strLength < 8 || strLength > 128) {
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

let registrationForm = document.forms["registerForm"];
let registerEmailInput = document.getElementById('registerEmail');
let registerPasswordInput = document.getElementById('registerPassword');

registerEmailInput.addEventListener('focus', function () {
    if (($('#registerEmailLabel').hasClass('register__emailLabel--small')) == false) {
        let textToShowAboveInput = document.getElementById('registerTextEmail');
        textToShowAboveInput.style.visibility = 'visible';
    }

    this.setAttribute('placeholder', '');
    document.getElementById('registerCapture').style.display = 'block';
    document.getElementById('registerWarningEmail').style.display = 'none';
});

registerEmailInput.addEventListener('blur', function () {

    if (($('#registerEmailLabel').hasClass('register__emailLabel--small')) == false) {
        let textToShowAboveInput = document.getElementById('registerTextEmail');
        textToShowAboveInput.style.visibility = 'hidden';
    }

    this.setAttribute('placeholder', 'Email');
    let valueFromInput = this.value;
    if (checkIsEmpty(valueFromInput) && checkEmail(valueFromInput)) {

    } else {
        document.getElementById('registerCapture').style.display = 'none';
        document.getElementById('registerWarningEmail').style.display = 'block';
    }
});

registerEmailInput.addEventListener('input', function () {
    let email = this.value;
    let nextButton = document.getElementById('registerNextButton');
    if (checkIsEmpty(email) && checkEmail(email)) {
        nextButton.classList.add('register__nextButton--active');
    } else {
        nextButton.classList.remove('register__nextButton--active');
    }
});

document.getElementById('registerNextButton').addEventListener('click', function () {
    let valueFromInput = registerEmailInput.value;
    let windowWidth = window.outerWidth;
    let paddingTop = windowWidth <= 450 ? '20px' : '60px';
    if (checkIsEmpty(valueFromInput) && checkEmail(valueFromInput)) {
        let form = $('#registartionForm');
        form.animate({
            'padding-top': paddingTop
        }, 1000);
        $('#registerEmailLabel').animate({
            'width': '60%'
        }, 1000);
        $('#registerEmailLabel').addClass('register__emailLabel--small');
        document.getElementById('registerTextEmail').style.display = 'none';
        $('#registerPasswordLabel').fadeIn(1500);
    } else {
        document.getElementById('registerCapture').style.display = 'none';
        document.getElementById('registerWarningEmail').style.display = 'block';
    }
});

registerPasswordInput.addEventListener('focus', function () {
    let textToShow = document.getElementById('registerTextPassword');
    textToShow.style.visibility = 'visible';
    this.setAttribute('placeholder', '');
});
registerPasswordInput.addEventListener('blur', function () {
    let textToShow = document.getElementById('registerTextPassword');
    textToShow.style.visibility = 'hidden';
    this.setAttribute('placeholder', 'Password');
});

registerPasswordInput.addEventListener('input', function () {
    let password = this.value;
    if (checkIsEmpty(password) && checkPassword(password)) {
        $('#registerSubmit').css({
            'background-color': '#31d5d4',
            'color': '#ffffff'
        });
        $('#registerPasswordLabel').addClass('register__passwordLabel--small');
        document.getElementById('registerWarningPassword').style.color = '#D1D0D0';
    } else {
        document.getElementById('registerWarningPassword').style.color = '#A02515';
        $('#registerPasswordLabel').removeClass('register__passwordLabel--small');
        $('#registerSubmit').css({
            'background-color': '#f4f6fb',
            'color': '#262626'
        });
    }
});

registrationForm.addEventListener('submit', function (event) {
    event.preventDefault();
    let emailValue = registerEmailInput.value;
    let passwordValue = registerPasswordInput.value;
    let error = true;
    if (!checkIsEmpty(emailValue) || !checkEmail(emailValue)) {
        document.getElementById('registerWarningEmail').style.display = 'block';
        $('.register__wrapUnderInput--email').css({
            'visibility': 'visible'
        });
        error = false;
    }
    if (!checkIsEmpty(passwordValue) || !checkPassword(passwordValue)) {
        document.getElementById('registerWarningPassword').style.display = 'block';
        error = false;
    }

    if (error) {
        sendAjaxWithRegisterData();
    }

});


function sendAjaxWithRegisterData() {
    let formData = new FormData(registrationForm);
    let action = registrationForm.getAttribute('action');
    let xhr = new XMLHttpRequest();

    try {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status == 404) {
                    putTextInAlertAndShowIt('Упс, что-то пошло не так(');
                    throw new Error('404 server not found');
                }
                let arrayJSON = JSON.parse(xhr.responseText);

                if (xhr.status == 200) {
                    let linkToRedirect = arrayJSON.redirect;
                    if (linkToRedirect) {
                        window.location.href = linkToRedirect;
                    } else {
                        putTextInAlertAndShowIt('Упс, что-то пошло не так(');
                        throw new Error('cant find link');
                    }
                } else {
                    let arrayOfErrors = arrayJSON.errors;
                    let strWithErrors = '';

                    for (let error in arrayOfErrors) {
                        strWithError += errors[error][0] + '\n';
                    }

                    putTextInAlertAndShowIt(strWithErrors);
                }
            }
        }

        xhr.open("POST", action);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send(formData);

    } catch (e) {
        console.log(e);
    }
}