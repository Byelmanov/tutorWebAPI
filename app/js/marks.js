'use strict';

function setHandlerForMarksInputs() {
    let arrayOfMarksInputs = document.querySelectorAll('.absent');

    for (let i = 0; i < arrayOfMarksInputs.length; i++) {
        arrayOfMarksInputs[i].addEventListener('input', dineSymbolsMarks);
    }
}
window.addEventListener('load', setHandlerForMarksInputs);


function dineSymbolsMarks(e) {
    let input = e.target;
    let value = input.value;
    let valueInt = parseInt(value);

    if (!isNaN(valueInt)) {
        if (valueInt < 0 || valueInt > 100 || value.length === 4) {
            value = value.slice(0, length - 1);
            input.value = value;
        }
    } else {
        value = value.slice(0, length - 1);
        input.value = value;
    }
}

let marksForm = document.forms['marks'];
marksForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let error = false;

    let arrayOfHeaderInputs = document.querySelectorAll('.header');
    arrayOfHeaderInputs.forEach((input) => {
        if (input.value == "") {
            error = true;
        }
    });

    if (error) {
        putTextInAlertAndShowIt('Заполните все заголовки таблицы');
    } else {
        let formData = new FormData(this);
        let action = this.getAttribute('action');
        sendAjax(formData, action);
    }
});

function sendAjax(formData, action) {
    let xhr = new XMLHttpRequest();
    try {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status == 200) {
                    putTextInSuccessAlertAndShowIt('Данные успешно обновлены');
                } else {
                    try {
                        let arrayJSON = JSON.parse(xhr.responseText);
                        let strToShow = '';
                        for (let i in arrayJSON.errors) {
                            strToShow += i + '\n';
                        }
                        putTextInAlertAndShowIt(strToShow);

                    } catch (e) {
                        putTextInAlertAndShowIt('Упс, что-то пошло не так(');
                        throw new Error(xhr.status + " : " + xhr.statusText);
                    }
                }
            }
        }

        xhr.open('POST', action);
        xhr.setRequestHeader('Accept', 'application/json')
        xhr.send(formData);

    } catch (e) {
        console.log(e);
    }
}

try {
    document.getElementById('marksAddColumn').addEventListener('click', marksAddColumn);
} catch (e) {
    console.log(e);
}

let counterForNewMarksColumns = 1;

function marksAddColumn() {
    let arrayOfLines = document.querySelectorAll('.journal__table-line');

    let headerItem = document.createElement("div");
    headerItem.className = 'journal__table-item journal__table-item--date';

    headerItem.innerHTML = `
    <input type="text" name="new_header[${counterForNewMarksColumns}]" class="header" value="лаб">
    <div class="delete">
        <img src="/img/bin.svg" alt="del">
    </div>`;

    let addColumn = document.getElementById('marksAddColumn');

    arrayOfLines[0].insertBefore(headerItem, addColumn);

    for (let i = 1; i < arrayOfLines.length; i++) {
        let studentId = arrayOfLines[i].children[0].getAttribute('data-id');
        let itemWithMark = document.createElement('div');
        itemWithMark.className = 'journal__table-item';
        itemWithMark.innerHTML = `<input class="absent" type="text" name="new_mark[${counterForNewMarksColumns}][${studentId}]" value=""/>`;
        arrayOfLines[i].append(itemWithMark);
    }
    setHandlerForMarksInputs();
    setHandlerForMarksDeleteButtons();
    counterForNewMarksColumns++;
}


function setHandlerForMarksDeleteButtons() {
    try {
        let array = document.querySelectorAll('.delete img');
        for (let i = 0; i < array.length; i++) {
            array[i].addEventListener('click', marksDeleteColumn);
        }
    } catch (e) {
        console.log(e);
    }
}
window.addEventListener('load', setHandlerForMarksDeleteButtons);


function marksDeleteColumn(e) {
    let itemToDelete = e.target.parentNode.parentNode;
    let columnId = itemToDelete.getAttribute('data-columnId');

    let arrayOfLines = document.querySelectorAll('.journal__table-line');
    let arrayOfChildren = arrayOfLines[0].children;
    let postionOfDeleteItem;

    for (let i = 0; i < arrayOfChildren.length; i++) {
        if (arrayOfChildren[i] === itemToDelete) {
            postionOfDeleteItem = i;
            i = arrayOfChildren.length;
        }
    }

    arrayOfLines.forEach(element => {
        element.children[postionOfDeleteItem].remove();
    });

    if (columnId !== null) {
        let hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'delete[]';
        hiddenInput.value = columnId;
        marksForm.append(hiddenInput);
    }
}

document.getElementById('reloadButton').addEventListener('click', () => { location.reload(); });