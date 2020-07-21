'use strict';

import { sendAJAX, defaultAjaxErrorHandler } from './xhr.js';


function setHandlerForAbsentInputs() {
    let arrayOfAbsentInputs = document.querySelectorAll('.absent');

    for (let i = 0; i < arrayOfAbsentInputs.length; i++) {
        arrayOfAbsentInputs[i].addEventListener('input', dineSymbols);
    }
}
window.addEventListener('load', setHandlerForAbsentInputs);


function dineSymbols(e) {
    let input = e.target;
    let value = input.value;

    if (value !== 'н' || value.length === 2) {
        value = value.slice(0, length - 1);
        input.value = value;
    }
}


let form = document.forms['journal'];
form.addEventListener('submit', function (e) {
    e.preventDefault();
    let formData = new FormData(this);
    let action = this.getAttribute('action');

    // sendAjax(formData, action);
    sendAJAX('POST', action, formData)
        .then(data => {
            putTextInSuccessAlertAndShowIt('Данные успешно обновлены');
        })
        .catch(data => {
            defaultAjaxErrorHandler(data);
        });
});

// function sendAjax(formData, action) {
//     let xhr = new XMLHttpRequest();
//     try {
//         xhr.onreadystatechange = function () {
//             if (xhr.readyState === 4) {
//                 if (xhr.status == 200) {
//                     putTextInSuccessAlertAndShowIt('Данные успешно обновлены');
//                 } else {
//                     try {
//                         let arrayJSON = JSON.parse(xhr.responseText);
//                         let errors = arrayJSON.errors;

//                         let strWithError = '';
//                         for (let error in errors) {
//                             strWithError += errors[error][0] + '\n';
//                         }
//                         putTextInAlertAndShowIt(strWithError);

//                     } catch (e) {
//                         putTextInAlertAndShowIt('Упс, что-то пошло не так(');
//                         throw new Error(xhr.status + " : " + xhr.statusText);
//                     }
//                 }
//             }
//         }

//         xhr.open('POST', action);
//         xhr.setRequestHeader('Accept', 'application/json');
//         xhr.send(formData);

//     } catch (e) {
//         console.log(e);
//     }
// }


try {
    document.getElementById('addColumn').addEventListener('click', addColumn);
} catch (e) {
    console.log(e);
}

let counterForNewColumns = 1;

function addColumn() {
    let arrayOfLines = document.querySelectorAll('.journal__table-line');

    let itemWithDate = document.createElement("div");
    itemWithDate.className = 'journal__table-item journal__table-item--date header';
    let currDate = new Date();
    let currDay = String(currDate.getDate());
    let currMonth = String(currDate.getMonth() + 1);
    currMonth = currMonth.length == 1 ? "0" + currMonth : currMonth;

    itemWithDate.innerHTML = `
    ${currDay + "." + currMonth}
    <div class="delete">
        <img src="/img/bin.svg" alt="del">
    </div>`;

    let addColumn = document.getElementById('addColumn');

    arrayOfLines[0].insertBefore(itemWithDate, addColumn);

    for (let i = 1; i < arrayOfLines.length; i++) {
        let studentId = arrayOfLines[i].children[0].getAttribute('data-id');
        let itemWithN = document.createElement('div');
        itemWithN.className = 'journal__table-item';
        itemWithN.innerHTML = `<input class="absent" type="text" name="new_journal[${counterForNewColumns}][${studentId}]" value=""/>`;
        arrayOfLines[i].append(itemWithN);
    }
    setHandlerForAbsentInputs();
    setHandlerForDeleteButtons();
    counterForNewColumns++;
}

document.getElementById('reloadButton').addEventListener('click', () => { location.reload(); });


function setHandlerForDeleteButtons() {
    try {
        let array = document.querySelectorAll('.delete img');
        for (let i = 0; i < array.length; i++) {
            array[i].addEventListener('click', deleteColumn);
        }
    } catch (e) {
        console.log(e);
    }
}

window.addEventListener('load', setHandlerForDeleteButtons);

function deleteColumn(e) {
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
        form.append(hiddenInput);
    }
}


