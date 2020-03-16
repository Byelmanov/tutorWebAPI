'use strict';

let arrayOfRadioButtons = document.querySelectorAll('.chooseSubject__input');

for (let i = 0; i < arrayOfRadioButtons.length; i++) {
    arrayOfRadioButtons[i].addEventListener('change', sendAjaxChooseSubjectForm);
}

function sendAjaxChooseSubjectForm() {
    let form = document.forms['chooseSubject'];
    let action = form.getAttribute('action');
    let formData = new FormData(form);
    let xhr = new XMLHttpRequest();

    try {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status == 200) {
                    let arrayJSON = JSON.parse(xhr.responseText);
                    let linkToRedirect = arrayJSON.redirect;
                    if (linkToRedirect) {
                        window.location.href = linkToRedirect;
                    } else {
                        throw new Error('cant find link');
                    }
                } else {
                    document.getElementById('chooseAlert').style.display = 'block';
                }
            }
        }

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.open('POST', action);
        xhr.send(formData);

    } catch (e) {
        console.log(e);
        document.getElementById('chooseAlert').style.display = 'block';
    }
}


document.getElementById('chooseAlertCross').addEventListener('click', function () {
    document.getElementById('chooseAlert').style.display = 'none';
});