'use strict';

import { sendAJAX, defaultAjaxErrorHandler } from './xhr.js';

let form = document.forms['adminRolesForm'];

form.addEventListener('submit', (e) => { e.preventDefault(); });

let arrayOfSelect = document.querySelectorAll('.adminRoles__select');
for (let i = 0; i < arrayOfSelect.length; i++) {
    arrayOfSelect[i].addEventListener('change', sendAjaxWithRole);
}

function sendAjaxWithRole(e) {
    let selectElem = e.target;
    let userId = e.target.parentNode.getAttribute('data-id');

    let formData = new FormData();
    formData.append('user', userId);
    formData.append('role', selectElem.value);
    formData.append('_token', document.getElementById('token').value);

    let action = form.getAttribute('action');

    sendAJAX('POST', action, formData)
        .then(data => {
            putTextInSuccessAlertAndShowIt('Данные успешно обновлены');
        })
        .catch(data => {
            defaultAjaxErrorHandler(data);
        });

    // let xhr = new XMLHttpRequest();

    // try {
    //     xhr.onreadystatechange = function () {
    //         if (xhr.readyState === 4) {
    //             if (xhr.status == 200) {
    //                 putTextInSuccessAlertAndShowIt('Данные успешно обновлены');
    //             } else {
    //                 try {
    //                     let arrayJSON = JSON.parse(xhr.responseText);
    //                     let errors = arrayJSON.errors;

    //                     let strWithError = '';
    //                     for (let error in errors) {
    //                         strWithError += errors[error][0] + '\n';
    //                     }

    //                     putTextInAlertAndShowIt(strWithError);
    //                 } catch (e) {
    //                     putTextInAlertAndShowIt('Упс, что-то пошло не так(');
    //                 }
    //             }
    //         }
    //     }

    //     xhr.open('POST', action);
    //     xhr.setRequestHeader('Accept', 'application/json');
    //     xhr.send(formData);


    // } catch (e) {
    //     console.log(e);
    // }
}