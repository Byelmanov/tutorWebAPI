'use strict';

document.forms['adminEditSubject'].addEventListener('submit', (e) => { e.preventDefault(); });

// delete tutor
function setHandlerForDeleteButtons() {
    let arrayOfDeleteButtons = document.querySelectorAll('.adminEditSubject__table-item-delete');
    for (let i = 0; i < arrayOfDeleteButtons.length; i++) {
        arrayOfDeleteButtons[i].addEventListener('click', deleteTutor);
    }
};

window.addEventListener('load', setHandlerForDeleteButtons);


function deleteTutor(e) {
    let targetElem = e.target;
    let parent = targetElem.parentElement;
    let tutorId = parent.getAttribute('data-id');

    let tutorData = {
        "id": tutorId,
        "name": parent.querySelector('.name').innerText,
        "email": parent.querySelector('.email').innerText,
    };

    let formData = new FormData();
    formData.append('tutor', tutorId);
    formData.append('_token', document.getElementById('adminEditSubjectToken').value);
    formData.append('_method', 'DELETE');
    let action = document.forms['adminEditSubject'].getAttribute('action');
    let xhr = new XMLHttpRequest();

    try {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status == 200) {
                    putTextInSuccessAlertAndShowIt('Данные успешно обновлены');
                    moveTutotToAllTutorsTable(tutorData);
                    parent.remove();
                } else {
                    try {
                        let arrayJSON = JSON.parse(xhr.responseText);
                        let errors = arrayJSON.errors;

                        let strWithError = '';
                        for (let error in errors) {
                            strWithError += errors[error][0] + '\n';
                        }
                        putTextInAlertAndShowIt(strWithError);
                    } catch (e) {
                        putTextInAlertAndShowIt('Упс, что-то пошло не так(');

                    }
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

function moveTutotToAllTutorsTable(tutorData) {
    let tableToMove = document.querySelector('.adminEditSubject__table--all');
    let newItem = document.createElement('div');
    newItem.className = 'adminEditSubject__table-item';
    newItem.setAttribute('data-id', tutorData.id);
    newItem.innerHTML = `
        <p class="name">${tutorData.name}</p>
        <p class="email">${tutorData.email}</p>
        <img src="/img/plusSign.svg" alt="add" class="adminEditSubject__addTutor"/>`;

    tableToMove.append(newItem);
    setHandlerForAddButtons();
}

function setHandlerForAddButtons() {
    let arrayOfDeleteButtons = document.querySelectorAll('.adminEditSubject__addTutor');
    for (let i = 0; i < arrayOfDeleteButtons.length; i++) {
        arrayOfDeleteButtons[i].addEventListener('click', addTutor);
    }
};

window.addEventListener('load', setHandlerForAddButtons);

function addTutor(e) {
    let targetElem = e.target;
    let parent = targetElem.parentElement;
    let tutorId = parent.getAttribute('data-id');

    let tutorData = {
        "id": tutorId,
        "name": parent.querySelector('.name').innerText,
        "email": parent.querySelector('.email').innerText,
    };

    let formData = new FormData();
    formData.append('tutor', tutorId);
    formData.append('_token', document.getElementById('adminEditSubjectToken').value);
    formData.append('_method', 'PUT');
    let action = document.forms['adminEditSubject'].getAttribute('action');
    let xhr = new XMLHttpRequest();

    try {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status == 200) {
                    putTextInSuccessAlertAndShowIt('Данные успешно обновлены');
                    moveTutotToSubjectTable(tutorData);
                    parent.remove();
                } else {
                    try {
                        let arrayJSON = JSON.parse(xhr.responseText);
                        let errors = arrayJSON.errors;

                        let strWithError = '';
                        for (let error in errors) {
                            strWithError += errors[error][0] + '\n';
                        }
                        putTextInAlertAndShowIt(strWithError);
                    } catch (e) {
                        putTextInAlertAndShowIt('Упс, что-то пошло не так(');

                    }
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

function moveTutotToSubjectTable(tutorData) {
    let tableToMove = document.querySelector('.adminEditSubject__table--forSubject');
    let newItem = document.createElement('div');
    newItem.className = 'adminEditSubject__table-item';
    newItem.setAttribute('data-id', tutorData.id);
    newItem.innerHTML = `
        <p class="name">${tutorData.name}</p>
        <p class="email">${tutorData.email}</p>
        <img src="/img/bin.svg" alt="delete" class="adminEditSubject__table-item-delete">`;

    tableToMove.append(newItem);
    setHandlerForDeleteButtons();
}


// name type form 

document.forms['adminEditSubjectNameType'].addEventListener('submit', function (e) {
    e.preventDefault();

    let formData = new FormData(this);
    let action = this.getAttribute('action');
    let xhr = new XMLHttpRequest();

    try {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status == 200) {
                    putTextInSuccessAlertAndShowIt('Данные успешно обновлены');
                } else {
                    try {
                        let arrayJSON = JSON.parse(xhr.responseText);
                        let errors = arrayJSON.errors;

                        let strWithError = '';
                        for (let error in errors) {
                            strWithError += errors[error][0] + '\n';
                        }
                        putTextInAlertAndShowIt(strWithError);
                    } catch (e) {
                        putTextInAlertAndShowIt('Упс, что-то пошло не так(');

                    }
                }
            }
        }

        xhr.open("POST", action);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send(formData);

    } catch (e) {
        console.log(e);
    }
});
