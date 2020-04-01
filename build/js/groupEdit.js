'use strict';

let form = document.forms['groupEdit'];
form.addEventListener('submit', function (e) {
    e.preventDefault();
    sendAjaxgroupEdit();
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

// add new student
document.getElementById('addStudentButton').addEventListener('click', addStudent);

function addStudent() {
    let item = document.createElement('div')
    item.className = 'groupEdit__table-item';
    item.innerHTML = `<input class="name" type="text" name="new[][firstname]" value=""/>
    <input class="name" type="text" name="new[][lastname]" value=""/>
    <input class="name" type="text" name="new[][fathername]" value=""/>
    <div class="groupEdit__table-item-delete">&#8854;</div>`;

    document.querySelector('.groupEdit__table').append(item);

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
    let childInputName = parent.children[0].getAttribute('name');
    let deleteId = getIdFromNameAttr(childInputName);

    let hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', `delete[{${deleteId}}]`);

    document.forms['groupEdit'].append(hiddenInput);

    parent.remove();
}

function getIdFromNameAttr(str) {
    for (let i in str) {
        if (!isNaN(parseInt(str[i]))) {
            return str[i];
        }
    }
}