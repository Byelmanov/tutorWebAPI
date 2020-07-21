'use strict';

import { sendAJAX, defaultAjaxErrorHandler } from './xhr.js';

let form = document.forms['sendVerificationEmailAgain'];

form.addEventListener('submit', function (e) {
    e.preventDefault();
    // sendAjax();
    let formData = new FormData(this);
    let action = this.getAttribute('action');

    try {
        sendAJAX('POST', action, formData)
            .then(data => {
                let linkToRedirect = data.redirect;
                if (linkToRedirect != undefined) {
                    window.location.href = linkToRedirect;
                } else {
                    let message = data.message;
                    if (message != undefined) {
                        putTextInSuccessAlertAndShowIt(message);
                    } else {
                        putTextInAlertAndShowIt('Упс, что-то пошло не так(');
                        throw new Error('cant find message');
                    }
                }
            })
            .catch(data => {
                defaultAjaxErrorHandler(data);
            });
    } catch (e) {
        console.error(e);
    }
});

// function sendAjax() {
//     let formData = new FormData(form);
//     let action = form.getAttribute('action');
//     let xhr = new XMLHttpRequest();

//     try {
//         xhr.onreadystatechange = function () {
//             if (xhr.readyState === 4) {
//                 if (xhr.status == 200) {
//                     let arrayJSON = JSON.parse(xhr.responseText);
//                     let linkToRedirect = arrayJSON.redirect;
//                     if (linkToRedirect) {
//                         window.location.href = linkToRedirect;
//                     } else {
//                         let message = arrayJSON.message;
//                         if (message) {
//                             putTextInSuccessAlertAndShowIt(message);
//                         } else {
//                             throw new Error('cant find message');
//                         }
//                     }
//                 } else {
//                     putTextInAlertAndShowIt('Упс, что-то пошло не так(');
//                 }
//             }
//         }


//         xhr.open("POST", action);
//         xhr.setRequestHeader("Accept", "application/json");
//         xhr.send(formData);

//     } catch (e) {
//         console.log(e);
//     }
// }


