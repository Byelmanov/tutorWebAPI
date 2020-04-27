'use strict';

// This function validate password
function checkPassword(str) {
    if (str.length < 8 || str == "" || str == null || str == undefined) { // if password is to short
        return false; // return error
    } else {
        return true;
    }
}

// This function check e-mail
function checkEmail(str) { 
    str = str.toString(); // converting e-mail into string
    var regExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/; // regular expression for string

    if (regExp.test(str)) { // if string is valid
        return true;
    } else {
        return false; // return error
    }
}

document.getElementById('passwordInput').addEventListener('input', function () { // if user input data into pass input
    let passwordValue = this.value; // get pass value
    let capture = document.getElementById('passwordLength'); // get capture width error
    if (checkPassword(passwordValue)) { // if password is ok
        capture.style.visibility = "hidden"; // hide capture
    } else { // if pass is to short
        capture.style.visibility = 'visible'; // show error
        document.querySelector('.setNewPassword__submit').classList.remove('setNewPassword__submit--active'); // remove submit button
    }

    if (checkAllInputs()) { // check all inputs
        allDataIsValid();  // call function 
    }

});

document.getElementById('passwordRepeatInput').addEventListener('input', function () { // if user input data into second pass input
    let passwordRepeat = this.value; // getting data
    let password = document.getElementById('passwordInput').value; // getting first pass data
    let capture = document.getElementById('passwordsAreNotTheSame'); // getting capture with error

    if (passwordRepeat === password) { // if passwords are same
        capture.style.visibility = "hidden"; // hide error capture 
    } else { // if passwords isn`t same
        capture.style.visibility = 'visible'; // show error capture
        document.querySelector('.setNewPassword__submit').classList.remove('setNewPassword__submit--active'); // remove submit
    }

    if (checkAllInputs()) {
        allDataIsValid();
    }
});

// if all data is valid
function allDataIsValid() {
    document.getElementById('passwordLength').style.visibility = "hidden"; // hide password warning
    document.getElementById('passwordsAreNotTheSame').style.visibility = "hidden"; // hide error passwordsAreNotTheSame
    document.querySelector('.setNewPassword__submit').classList.add('setNewPassword__submit--active'); // make submit active

}

function checkAllInputs() { // this function check i
    let email = document.getElementById('emailInput').value; // get e-mail value
    let password = document.getElementById('passwordInput').value; // get password value 
    let passwordRepeat = document.getElementById('passwordRepeatInput').value; // get second password value
    if (checkEmail(email) && checkPassword(password) && password === passwordRepeat) { // if e-mail is valid, password is valid and second password is same as password
        return true; 
    } else {
        return false; // return false
    }
}

let form = document.forms['setNewPassword']; // get form 
form.addEventListener('submit', function (e) { // user submit it
    e.preventDefault(); // remove standart submit event
    if (checkAllInputs()) { // check inputs
        sendAjaxSetNewPassword(); // send form
    }
});

// This function send form to server
function sendAjaxSetNewPassword() {
    let formData = new FormData(form); // creating form data object
    let action = form.getAttribute('action'); // getting an action attribute from html 
    let xhr = new XMLHttpRequest(); // creating new http request without reloading a page

    try { // construction try to catch errors, if they will appear

        xhr.onreadystatechange = function () { // Event handler when readyState is changing
            if (xhr.readyState === 4) { // if complited
                if (xhr.status == 422) { // if status 422
                    putTextInAlertAndShowIt('Упс, что-то пошло не так('); // show error message
                    throw new Error(xhr.status + ": " + xhr.statusText); // throw an error 
                } else if (xhr.status == 200) { // if status 200 = all is ok
                    let linkToRedirect = JSON.parse(xhr.responseText).redirect; // get link from server response
                    if (linkToRedirect) { // if link 
                        window.location.href = linkToRedirect; // go to new page
                    } else { // if server doesn`t give link
                        putTextInAlertAndShowIt('Упс, что-то пошло не так('); // show error message
                        throw new Error('cant find link'); //  throw an error 
                    }
                } else { // is fomething went wrong
                    putTextInAlertAndShowIt('Упс, что-то пошло не так('); // show error message
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
