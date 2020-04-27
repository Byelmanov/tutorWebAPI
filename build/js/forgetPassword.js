'use strict';

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

// Add listener of inputting data into a forgetPasswordInput input
document.getElementById('forgetPasswordInput').addEventListener('input', function () {
    let value = this.value; // get input value
    let submitButton = document.querySelector('.forgetPassword__submit'); // get submit button from DOM
    if (checkEmail(value)) { // if e-mail is valid
        submitButton.classList.add('forgetPassword__submit--active'); // highlight the submit button
    } else {
        submitButton.classList.remove('forgetPassword__submit--active'); // remove highlight from button
    }
});

let form = document.forms['forgetPassword']; // get form 

form.addEventListener('submit', function (e) { //Add listener of submitting form 
    e.preventDefault(); // remove standart listener of submit
    let email = document.getElementById('forgetPasswordInput').value; // get e-mail value from input
    if (checkEmail(email)) { // if e-mail is correct
        sendAjaxForgetPassword(); // call request function
    } else { // if e-mail is not valid 
        putTextInAlertAndShowIt('Заполните это поле'); // show message
        setTimeout(() => { 
            document.getElementById('alertCross').click();
        }, 2000); // close error message after 2 sec
    }

});

// Function that send a form to server 
function sendAjaxForgetPassword() { 
    let formData = new FormData(form); // creating form data object
    let action = form.getAttribute('action'); // getting an action attribute from html 
    let xhr = new XMLHttpRequest(); // creating new http request without reloading a page

    try { // construction try to catch errors, if they will appear

        xhr.onreadystatechange = function () { // Event handler when readyState is changing
            if (xhr.readyState === 4) { // if complited
                if (xhr.status == 200) { // status 200 - all is alright, request done without errors
                    putTextInSuccessAlertAndShowIt('Успешно отправлено'); // show message that all is ok
                } else { // if request is aborted
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
