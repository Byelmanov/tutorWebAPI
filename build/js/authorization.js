'use strict';

let form = document.forms['authorization']; // search for a form on the page

form.addEventListener('submit', function (e) { // when user click on submit button
    e.preventDefault(); // remove standart listener of submit
    let password = document.getElementById('password').value; // get password text
    let login = document.getElementById('login').value; // get login text

    if (checkAllInputsAreEmpty()) { // if there aren`t any errors
        sendAuthorizationAjax(); // call function to send a form 
    } else if (checkEmail(login) && !checkPasswordLength(password)) { // if login is ok, but passwords length get some error
        putTextInAlertAndShowIt('Короткий пароль!');  // call function to show message with error
    } else if (!checkEmail(login) && checkPasswordLength(password)) {  // if e-mail isn`t correct
        putTextInAlertAndShowIt('Неправильный формат почты!'); // call function to show message with error
    } else { // if login or password is empty
        putTextInAlertAndShowIt('Заполните все поля!');
    }
});

// Function that send a form to server 
function sendAuthorizationAjax() { 
    let formData = new FormData(form); // creating form data object
    let action = form.getAttribute('action'); // getting an action attribute from html 
    let xhr = new XMLHttpRequest(); // creating new http request without reloading a page

    try { // construction try to catch errors, if they will appear

        xhr.onreadystatechange = function () { // Event handler when readyState is changing
            if (xhr.readyState === 4) { // if complited

                if (xhr.status == 404) { // 404 exception - page not found
                    putTextInAlertAndShowIt('Упс, что-то пошло не так(');  // call function to show message with error
                    throw new Error('404 server not found'); // throw an error
                }

                let arrayJSON = JSON.parse(xhr.responseText); // parsing form data to json 

                if (xhr.status == 200) { // status 200 - all is alright, request done without errors
                    let linkToRedirect = arrayJSON.redirect; // redirect to next page after authorization
                    if (linkToRedirect) {  // if it is link to go
                        window.location.href = linkToRedirect; // go to this link
                    } else { // if it isn`t link
                        putTextInAlertAndShowIt('Упс, что-то пошло не так(');  // call function to show message with error
                        throw new Error('cant find link'); // throw an error
                    }

                } else { // if status isn`t 200 - it means some error 
                    let arrayOfErrors = arrayJSON.errors; // get errors from server answer and put them in array
                    if (arrayOfErrors) { // if errors
                        let strWithErrors = ''; // empty string
                        for (let error in arrayOfErrors) { // get all errors from array
                            strWithErrors += error[0] + '\n'; // put errors to empty string 
                        }
                        putTextInAlertAndShowIt(strWithErrors);  // call function to show message with error
                    } else { // if server doesn`t response any error
                        putTextInAlertAndShowIt('Упс, что-то пошло не так(');  // call function to show message with error
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


function checkAllInputsAreEmpty() { // check for empty inputs of the form
    let login = document.getElementById('login').value; // get login from form
    let password = document.getElementById('password').value;  // get password from form
    if (checkStringIsEmpty(login) && checkEmail(login) && checkStringIsEmpty(password) && checkPasswordLength(password)) { // if login is not empty amd login isn valid amd password is not empty or password is long enaught
        return true; // get to request
    } else {
        return false; // search for error
    }
}

// This function check if string is empty
function checkStringIsEmpty(str) {  
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

document.getElementById('login').addEventListener('input', function () { // handler for inputting data in login field
    let submitButton = document.getElementById('submit'); // get submit button
    if (checkAllInputsAreEmpty()) { // if data is field os ok
        submitButton.classList.add('authorization__submit--active'); // highlight the submit button
    } else { 
        submitButton.classList.remove('authorization__submit--active'); // remove highlight from button
    }

});
document.getElementById('password').addEventListener('input', function () { // handler for inputting data in password field
    let password = this.value; // get password value
    let submitButton = document.getElementById('submit'); // get submit button

    if (checkAllInputsAreEmpty()) { // if data is field os ok
        submitButton.classList.add('authorization__submit--active'); // highlight the submit button
    } else {
        submitButton.classList.remove('authorization__submit--active'); // remove highlight from button
    }

});
