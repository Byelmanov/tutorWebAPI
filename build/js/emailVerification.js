'use strict';

let form = document.forms['sendVerificationEmailAgain']; // get form from DOM

form.addEventListener('submit', function (e) { // Event listener to form submit
    e.preventDefault(); // stop standart submit function
    sendAjax(); // call function that send request to server
});


function sendAjax() {
    let formData = new FormData(form); // creating form data object
    let action = form.getAttribute('action'); // getting an action attribute from html 
    let xhr = new XMLHttpRequest(); // creating new http request without reloading a page

    try { // construction try to catch errors, if they will appear
        xhr.onreadystatechange = function () {  // Event handler when readyState is changing
            if (xhr.readyState === 4) { // if complited
                if (xhr.status == 200) { // status 200 - all is alright, request done without errors
                    let arrayJSON = JSON.parse(xhr.responseText); // parsing form data to json 
                    let linkToRedirect = arrayJSON.redirect; // redirect to next page after verification
                    if (linkToRedirect) { // if it is link to go
                        window.location.href = linkToRedirect; // go to this link
                    } else { // if it isn`t link
                        let message = arrayJSON.message; // get message from request
                        if (message) { // if message
                            putTextInSuccessAlertAndShowIt(message); // show message that all is ok
                        } else { 
                            throw new Error('cant find message'); // error, that we can`t get message
                        }
                    }
                } else { // if request aborted
                    putTextInAlertAndShowIt('Упс, что-то пошло не так('); // show text, that request is aborted
                }
            }
        }


        xhr.open("POST", action); // initial new request
        xhr.setRequestHeader("Accept", "application/json"); // set header of request
        xhr.send(formData); // send request

    } catch (e) { // if some errors
        console.log(e); // show them in console
    }
}


