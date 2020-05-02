'use strict';

function setHandlerForAbsentInputs() {
    let arrayOfAbsentInputs = document.querySelectorAll('.absent');

    for (let i = 0; i < arrayOfAbsentInputs.length; i++) {
        arrayOfAbsentInputs[i].addEventListener('input', dineSymbols);
    }
};

setHandlerForAbsentInputs();



function dineSymbols(e) {
    let input = e.target;
    let value = input.value;
    let valueInt = parseInt(value);

    if (!isNaN(valueInt)) {
        if (valueInt < 0 || valueInt > 100 || value.length === 4) {
            value = value.slice(0, length - 1);
            input.value = value;
        }
    } else {
        if (value !== 'н' || value.length === 2) {
            value = value.slice(0, length - 1);
            input.value = value;
        }
    }

}


let form = document.forms['journal'];
form.addEventListener('submit', function (e) {
    e.preventDefault();
    sendAjaxWithJournalData();
});

function sendAjaxWithJournalData() {
    let formData = new FormData(form);
    let action = form.getAttribute('action');
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
    document.getElementById('addColumn').addEventListener('click', addColumn);
} catch (e) {
    console.log(e);
}

function addColumn() {
    let arrayOfLines = document.querySelectorAll('.journal__table-line');

    let itemWithDate = document.createElement("div");
    itemWithDate.className = 'journal__table-item journal__table-item--date';
    let currDate = new Date();
    let currDay = String(currDate.getDate());
    let currMonth = String(currDate.getMonth() + 1);
    currMonth = currMonth.length == 1 ? "0" + currMonth : currMonth;
    itemWithDate.innerText = currDay + "." + currMonth;

    let deleteNode = document.createElement('img');
    deleteNode.src = '/img/bin.svg';
    deleteNode.alt = 'del';
    deleteNode.className = 'delete';
    deleteNode.onclick = deleteColumn;

    itemWithDate.append(deleteNode);

    addColumn = document.getElementById('addColumn');

    arrayOfLines[0].insertBefore(itemWithDate, addColumn);

    for (let i = 1; i < arrayOfLines.length; i++) {
        let studentId = arrayOfLines[i].children[0].getAttribute('data-id');
        let itemWithN = document.createElement('div');
        itemWithN.className = 'journal__table-item';
        itemWithN.innerHTML = `<input class="absent" type="text" name="new[${studentId}]" value=""/>`;
        arrayOfLines[i].append(itemWithN);
    }
    setHandlerForAbsentInputs();
}

document.getElementById('reloadButton').addEventListener('click', () => { location.reload(); });

try {
    document.querySelector('.journal__table-item--date .delete').addEventListener('click', deleteColumn);
} catch (e) {
    console.log(e);
}

function deleteColumn(e) {
    let itemToDelete = e.target.parentNode;

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
        let childrenToDelete = element.children[postionOfDeleteItem];
        childrenToDelete.remove();
    });
}
