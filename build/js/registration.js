'use strict';

// This function check if string is empty
function checkIsEmpty(str) {  
    if (str == "" || str == null || str == undefined) { // if string is empty 
        return false; // return error
    } else {
        return true;
    }
}

// This function check if string is long enaught
function checkPasswordLength(str) { 
    if (str.length < 8) { // if lenght is < 8 symbols
        return false; // return error
    } else { 
        return true;
    }
}

// This function check if e-mail is valid
function checkEmail(str) {
    str = str.toString(); // translate str to string
    var regExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/; // Regular expression for e-mail 

    if (regExp.test(str)) { // if e-mail is valid
        return true;
    } else { // else
        return false; // return error
    }
}

let registrationForm = document.forms["registerForm"]; // get form
let registerEmailInput = document.getElementById('registerEmail'); // get e-mail input 
let registerPasswordInput = document.getElementById('registerPassword'); // get password input

registerEmailInput.addEventListener('focus', function () { // if user focus on e-mail input
    if (($('#registerEmailLabel').hasClass('register__emailLabel--small')) == false) {  // if e-mail label is big
        let textToShowAboveInput = document.getElementById('registerTextEmail'); // get small label
        textToShowAboveInput.style.visibility = 'visible'; // make it visible
    }

    this.setAttribute('placeholder', ''); // remove placeholder "Email"
    document.getElementById('registerCapture').style.display = 'block'; // show capture 
    document.getElementById('registerWarningEmail').style.display = 'none'; // hide big label
});

registerEmailInput.addEventListener('blur', function () { // if user get out input

    if (($('#registerEmailLabel').hasClass('register__emailLabel--small')) == false) {  // 
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

document.getElementById('registerNextButton').addEventListener('click', function () { // if user click on registerNextButton
    let valueFromInput = registerEmailInput.value; // get e-mail value
    let windowWidth = window.outerWidth; // get window width
    let paddingTop = windowWidth <= 450 ? '20px' : '60px';  // choosing padding top from window width: small for mobile, big for desktop
    if (checkIsEmpty(valueFromInput) && checkEmail(valueFromInput)) { // if valueFromInput is valid
        let form = $('#registartionForm'); // get form
        form.animate({ // make form animation
            'padding-top': paddingTop // add padding
        }, 1000);
        $('#registerEmailLabel').animate({ // width animation
            'width': '60%'
        }, 1000);
        $('#registerEmailLabel').addClass('register__emailLabel--small'); // add small e-mail label
        document.getElementById('registerTextEmail').style.display = 'none'; // hide register text e-mail
        $('#registerPasswordLabel').fadeIn(1500); // show registerPasswordLabel
    } else {
        document.getElementById('registerCapture').style.display = 'none'; // else hode capture
        document.getElementById('registerWarningEmail').style.display = 'block'; // and show warning
    }
});

registerPasswordInput.addEventListener('focus', function () { // if password input is on focus
    let textToShow = document.getElementById('registerTextPassword'); // get password label 
    textToShow.style.visibility = 'visible'; // make small password label visible
    this.setAttribute('placeholder', ''); // remove placeholder
});
registerPasswordInput.addEventListener('blur', function () { // if user go out password input
    let textToShow = document.getElementById('registerTextPassword'); // get password label
    textToShow.style.visibility = 'hidden'; // hide it
    this.setAttribute('placeholder', 'Password'); // set placeholder
});

registerPasswordInput.addEventListener('input', function () { // if user input a password
    let password = this.value; // get password value 
    if (checkIsEmpty(password) && checkPassword(password)) { // if password is not valid
        $('#registerSubmit').css({ // get submit button
            'background-color': '#31d5d4',
            'color': '#ffffff'
        });
        $('#registerPasswordLabel').addClass('register__passwordLabel--small'); // add small password label
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

registrationForm.addEventListener('submit', function (event) { // is user submit form 
    event.preventDefault(); // remove standart submit event
    let emailValue = registerEmailInput.value; // get e-mail value
    let passwordValue = registerPasswordInput.value; // get password value
    let error = true; // set error true
    if (!checkIsEmpty(emailValue) || !checkEmail(emailValue)) { // if error in e-mail
        document.getElementById('registerWarningEmail').style.display = 'block'; //show registerWarningEmail
        $('.register__wrapUnderInput--email').css({ // make visible e-mail warning
            'visibility': 'visible'
        });
        error = false;
    }
    if (!checkIsEmpty(passwordValue) || !checkPassword(passwordValue)) { // if error in password
        document.getElementById('registerWarningPassword').style.display = 'block'; // show registerWarningPassword
        error = false; 
    }

    if (error) {  // if not error
        sendAjaxWithRegisterData(); // send data function
    }

});


function sendAjaxWithRegisterData() {
    let formData = new FormData(registrationForm); // creating form data object
    let action = registrationForm.getAttribute('action'); // getting an action attribute from html 
    let xhr = new XMLHttpRequest(); // creating new http request without reloading a page

    try { // construction try to catch errors, if they will appear

        xhr.onreadystatechange = function () { // Event handler when readyState is changing
            if (xhr.readyState === 4) { // if complited
                if (xhr.status == 404) { // if not fount
                    putTextInAlertAndShowIt('Упс, что-то пошло не так('); // show error message
                    throw new Error('404 server not found'); // throw error
                }
                let arrayJSON = JSON.parse(xhr.responseText); // parse response in JSON

                if (xhr.status == 200) { // if sratus 200 - all is ok  
                    let linkToRedirect = arrayJSON.redirect; // get link to redirect
                    if (linkToRedirect) { // if link
                        window.location.href = linkToRedirect; // get to the new page
                    } else { // if any link in response
                        putTextInAlertAndShowIt('Упс, что-то пошло не так('); // show error message
                        throw new Error('cant find link'); // throw new error
                    }
                } else { // if status isn`t 200 or 404
                    let arrayOfErrors = arrayJSON.errors; // get all error
                    let strWithErrors = ''; // create empty string

                    for (let error in arrayOfErrors) { // for all errror
                        strWithErrors += error + '\n'; // put them into string
                    }

                    putTextInAlertAndShowIt(strWithErrors); // show errors
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