'use strict';

let form = document.forms['groupEdit'];
form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (checkAllInputsAreEmpty()) {
        sendAjaxgroupEdit();
    } else {
        putTextInAlertAndShowIt('Пожауйлста, заполните все поля!');
    }

});

function sendAjaxgroupEdit() {
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

function checkAllInputsAreEmpty() {
    let inputs = form.elements;
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].nodeName === 'INPUT' && inputs[i].type === "text") {
            if (inputs[i].value == '' || inputs[i].value == undefined || inputs[i].value == null) {
                return false;
            }
        }
    }
    return true;
}

// add new student

let counterForNewStudentId = 1;

document.getElementById('addStudentButton').addEventListener('click', addStudent);

function addStudent() {
    let item = document.createElement('div')
    item.className = 'groupEdit__table-item';
    item.innerHTML = `
    <input class="name" type="text" name="new[${counterForNewStudentId}][lastname]" placeholder="Фамилия" value=""/>
    <input class="name" type="text" name="new[${counterForNewStudentId}][firstname]" placeholder="Имя" value=""/>
    <input class="name" type="text" name="new[${counterForNewStudentId}][fathername]" placeholder="Отчество" value=""/>
    <div class="groupEdit__table-item-delete">&#8854;</div>`;

    document.querySelector('.groupEdit__table').append(item);

    counterForNewStudentId++;
    setHandlerForDeleteButtons();
}

// delete student

function setHandlerForDeleteButtons() {
    let arrayOfDeleteButtons = document.querySelectorAll('.groupEdit__table-item-delete');
    for (let i = 0; i < arrayOfDeleteButtons.length; i++) {
        arrayOfDeleteButtons[i].addEventListener('click', deleteStudent);
    }
};

window.addEventListener('load', setHandlerForDeleteButtons);


function deleteStudent(e) {
    let targetElem = e.target;
    let parent = targetElem.parentElement;
    let deleteId = parent.getAttribute('data-id');

    if (deleteId !== null) {
        createHiddenInputAndInsertId(deleteId);
    }
    parent.remove();
}


function createHiddenInputAndInsertId(id) {
    let hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', `delete[${id}]`);
    document.forms['groupEdit'].append(hiddenInput);
}