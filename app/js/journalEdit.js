'use strict';

let form = document.forms['journalEdit'];
form.addEventListener('submit', function (e) {
    e.preventDefault();
    sendAjaxJournalEdit();
});

function sendAjaxJournalEdit() {
    let formData = new FormData(form);
    let action = form.getAttribute('action');
    let xhr = new XMLHttpRequest();

    try {

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status == 200) {
                    putTextInSuccessAlertAndShowIt('Данные успешно обновлены');
                } else {
                    putTextInAlertAndShowIt('Упс, что-то пошло не так(');
                }
            }
        }

        xhr.open('POST', action);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send(formData);

    } catch (e) {
        console.log(e);
    }
}

// add new student
document.getElementById('addStudentButton').addEventListener('click', addStudent);

function addStudent() {
    let lineElem = document.createElement("div");
    lineElem.className = "journalEdit__table-line";

    let tdWithName = document.createElement('div');
    tdWithName.className = 'journalEdit__table-item';
    tdWithName.innerHTML = `<input type="text" name="" class="name" value=""> <div class="journalEdit__table-item-delete">&#8854;</div>`;
    lineElem.append(tdWithName);

    let lengthOfTd = document.querySelector('.journalEdit__table-line').children.length;

    for (let i = 1; i < lengthOfTd; i++) {
        let tdItem = document.createElement('div');
        tdItem.className = "journalEdit__table-item";
        tdItem.innerHTML = `<div class="absent"></div>`;
        lineElem.append(tdItem);
    }

    //append it to table
    document.querySelector('.journalEdit__table').append(lineElem);

    setHandlerForDeleteButtons();
}

// delete student

function setHandlerForDeleteButtons() {
    let arrayOfDeleteButtons = document.querySelectorAll('.journalEdit__table-item-delete');
    for (let i = 0; i < arrayOfDeleteButtons.length; i++) {
        arrayOfDeleteButtons[i].addEventListener('click', deleteStudent);
    }
};

window.addEventListener('load', setHandlerForDeleteButtons);



function deleteStudent(e) {
    let elemToDelete = e.target.parentElement.parentElement;
    elemToDelete.remove();
}