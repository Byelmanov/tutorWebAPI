'use strict';

document.getElementById('editEmailCross').addEventListener('click', hideEditEmailSection); // if user cick on cross near e-mail edit call hideEditEmailSection
document.getElementById('editEmailButton').addEventListener('click', showEditEmailSection); // if user cick on cross near e-mail edit call showEditEmailSection

document.getElementById('editPasswordCross').addEventListener('click', hideEditPasswordSection); // if user cick on button near password edit call hideEditPasswordSection
document.getElementById('editPasswordButton').addEventListener('click', showEditPasswordSection); // if user cick on button near password edit call showEditPasswordSection

// This function hide block editEmailSection
function hideEditEmailSection() { 
    document.getElementById('editEmailSection').style.display = 'none'; // hide block 
    document.removeEventListener('keydown', checkEscAndHideWindow); // remove ESC listener
}

// This functoin show block EditEmailSection
function showEditEmailSection() {
    document.getElementById('editEmailSection').style.display = 'flex'; // show block
    document.addEventListener('keydown', checkEscAndHideWindow); // add ESC listener
}

// This function hide block EditPasswordSection
function hideEditPasswordSection() {
    document.getElementById('editPasswordSection').style.display = 'none'; // hide block 
    document.removeEventListener('keydown', checkEscAndHideWindow); // remove ESC listener
}

// This function show block EditPasswordSection
function showEditPasswordSection() {
    document.getElementById('editPasswordSection').style.display = 'flex'; // show block
    document.addEventListener('keydown', checkEscAndHideWindow); // add ESC listener
}

// press ESC event hadnler
function checkEscAndHideWindow(e) {
    e = e || window.event; // get key
    if (e.keyCode === 27) { // if key is ESC
        hideEditEmailSection(); // call to hideEditEmailSection
        hideEditPasswordSection(); // call to hideEditPasswordSection
    }
}

let formEditEmail = document.forms['editEmail']; // get form 
formEditEmail.addEventListener('submit', function (e) { // if user submit form 
    e.preventDefault(); // remove standart submit event
    let email = document.getElementById('editEmailInput').value; // get value of e-mail from input
    if (checkEmail(email)) { // call function to validate the form
        sendAjaxEditEmail(); // if form is valid call sendAjaxEditEmail
    }
});

// Sending form to server
function sendAjaxEditEmail() { 
    let formData = new FormData(form); // creating form data object
    let action = form.getAttribute('action'); // getting an action attribute from html 
    let xhr = new XMLHttpRequest(); // creating new http request without reloading a page

    try { // construction try to catch errors, if they will appear

        xhr.onreadystatechange = function () { // Event handler when readyState is changing
            if (xhr.readyState === 4) { // if complited
                hideEditEmailSection(); // hide EditEmailSection
                if (xhr.status == 200) { // status 200 - all is alright, request done without errors
                    putTextInSuccessAlertAndShowIt('Данные успешно обновлены'); // show OK message
                } else { // if status not 200 
                    try { // construction try to catch errors, if they will appear
                        let arrayJSON = JSON.parse(xhr.responseText); // get from server answer and put them in array
                        let errors = arrayJSON.errors; // get errors from server answer
                        if (errors) { 
                            let strWithError = ''; // empty string
                            for (let error in errors) { // check all errors
                                strWithError += error + '\n'; // put them to string with errors
                            }
                            putTextInAlertAndShowIt(strWithError); // show errors from string
                        } else { // if server don`t show errors, but request status isn`t 200
                            putTextInAlertAndShowIt('Упс, что-то пошло не так('); // show error message
                        }
                    } catch (e) { // if something went wrond
                        putTextInAlertAndShowIt('Упс, что-то пошло не так('); // show error message
                    }

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


let formEditPassword = document.forms['editPassword']; // get form 
formEditPassword.addEventListener('submit', function (e) { // if user submit form 
    e.preventDefault();  // remove standart submit event
    if (checkAllInputs()) { // check all inputs  
        sendAjaxEditPassword(); // if inputs are valid call sendAjaxEditPassword
    }
});

// Sending form to server

function sendAjaxEditPassword() {
    let formData = new FormData(form); // creating form data object
    let action = form.getAttribute('action'); // getting an action attribute from html 
    let xhr = new XMLHttpRequest(); // creating new http request without reloading a page

    try { // construction try to catch errors, if they will appear

        xhr.onreadystatechange = function () { // Event handler when readyState is changing
            if (xhr.readyState === 4) { // if complited
                showEditPasswordSection(); // hide EditEmailSection
                if (xhr.status == 200) { // status 200 - all is alright, request done without errors
                    putTextInSuccessAlertAndShowIt('Данные успешно обновлены'); // show OK message
                } else { // if status not 200 
                    try { // construction try to catch errors, if they will appear
                        let arrayJSON = JSON.parse(xhr.responseText); // get from server answer and put them in array
                        let errors = arrayJSON.errors; // get errors from server answer
                        if (errors) { 
                            let strWithError = ''; // empty string
                            for (let error in errors) { // check all errors
                                strWithError += error + '\n'; // put them to string with errors
                            }
                            putTextInAlertAndShowIt(strWithError); // show errors from string
                        } else { // if server don`t show errors, but request status isn`t 200
                            putTextInAlertAndShowIt('Упс, что-то пошло не так('); // show error message
                        }
                    } catch (e) { // if something went wrond
                        putTextInAlertAndShowIt('Упс, что-то пошло не так('); // show error message
                    }

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

// This function check if string is long enaught
function checkPasswordLength(str) { 
    if (str.length < 8 || str == "" || str == null || str == undefined) { // if lenght is < 8 symbols and password field isn`t empty
        return false; // return error
    } else {
        return true;
    }
}

document.getElementById('editEmailInput').addEventListener('input', function () { // if user input data into editEmailInput
    let value = this.value; // get e-mail from input
    let button = document.querySelector('.editEmail__submit'); // get submit button
    if (checkEmail(value)) { // check if e-mail is valid
        button.classList.add('editEmail__submit--active'); // highlight the button 
    } else {
        button.classList.remove('editEmail__submit--active'); // remove highlight from the button 
    }
});

document.getElementById('passwordInput').addEventListener('input', function () { // if user input data into passwordInput
    let passwordValue = this.value; // get password from input
    let capture = document.getElementById('passwordLength'); // get block with error
    if (checkPassword(passwordValue)) { // if password correct 
        capture.style.visibility = "hidden"; // hide error
    } else { // if password is to short
        capture.style.visibility = 'visible'; // show error
        document.querySelector('.editPassword__submit').classList.remove('editPassword__submit--active'); // remove highlight from button
    }

    if (checkAllInputs()) { // if all data from form is correct
        allDataIsValid(); // call to allDataIsValid
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
        document.querySelector('.editPassword__submit').classList.remove('editPassword__submit--active');
    }

    if (checkAllInputs()) {
        allDataIsValid();
    }
});

// this function check if passwords are same
function checkAllInputs() {
    let password = document.getElementById('passwordInput').value; // get pass value
    let passwordRepeat = document.getElementById('passwordRepeatInput').value; // get second pass value
    if (checkPassword(password) && password === passwordRepeat) { // if they are same
        return true;
    } else {
        return false;
    }
}

function allDataIsValid() {
    document.getElementById('passwordLength').style.visibility = "hidden"; // hide password lenght error
    document.getElementById('passwordsAreNotTheSame').style.visibility = "hidden"; // hide error if passwords aren`t same
    document.querySelector('.editPassword__submit').classList.add('editPassword__submit--active'); // highlight the submit button
}
