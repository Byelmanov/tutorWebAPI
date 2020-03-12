'use strict';

function setHandlerForAbsentInputs() {
    let arrayOfAbsentInputs = document.querySelectorAll('.absent');

    for (let i = 0; i < arrayOfAbsentInputs.length; i++) {
        arrayOfAbsentInputs[i].addEventListener('input', dineAllSymbolsBesideN);
    }
};

setHandlerForAbsentInputs();



function dineAllSymbolsBesideN(e) {
    let input = e.target;
    let value = input.value;
    if (e.data !== 'н' || value.length == 2) {
        value = value.slice(0, value.length - 1);
        input.value = value;
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

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status == 200) {
                //success
            } else {
                //error
            }
        }
    }

    xhr.open('POST', action);
    xhr.send(formData);
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

    arrayOfLines[0].append(itemWithDate);

    for (let i = 1; i < arrayOfLines.length; i++) {
        let itemWithN = document.createElement('div');
        itemWithN.className = 'journal__table-item';
        itemWithN.innerHTML = '<input class="absent" type="text" name="" value=""/>';
        arrayOfLines[i].append(itemWithN);
    }
    setHandlerForAbsentInputs();
}

try {
    document.getElementById('addStudent').addEventListener('click', function () {
        document.querySelector('.journal__addStudentPopUp').style.display = 'block';
    });
    document.getElementById('crossAddNewStudent').addEventListener('click', function () {
        document.querySelector('.journal__addStudentPopUp').style.display = 'none';
    });
} catch (e) {
    console.log(e);
}

try {
    document.getElementById('submitNewStudentName').addEventListener('click', function () {
        let inputValue = document.getElementById('nameOfNewStudent').value;
        if (inputValue != "" && inputValue != null && inputValue != undefined) {
            document.querySelector('.journal__addStudentPopUp').style.display = 'none';
            document.getElementById('nameOfNewStudent').value = '';
            addStudent(inputValue);
        }
    });
} catch (e) {
    console.log(e);
}

function addStudent(name) {
    let lineElem = document.createElement("div");
    lineElem.className = "journal__table-line";

    let lineWithDate = document.querySelector('.journal__table-line');
    let arrayOfChildrenLength = lineWithDate.children.length;

    let firstTdItem = document.createElement('div');
    firstTdItem.className = "journal__table-item";
    firstTdItem.innerHTML = name;

    lineElem.append(firstTdItem);

    for (let i = 1; i < arrayOfChildrenLength; i++) {
        let item = document.createElement('div');
        item.className = 'journal__table-item';
        item.innerHTML = '<input class="absent" type="text" name="" value=""/>';
        lineElem.append(item);
    }

    document.querySelector('.journal__table').append(lineElem);
}