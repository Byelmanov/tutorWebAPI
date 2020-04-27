'use strict';

// this function put input event for every cell in journal
function setHandlerForAbsentInputs() {  
    let arrayOfAbsentInputs = document.querySelectorAll('.absent'); // get all cells from journal 

    for (let i = 0; i < arrayOfAbsentInputs.length; i++) { // for all cells from journal
        arrayOfAbsentInputs[i].addEventListener('input', dineAllSymbolsBesideN); // add input handler for every cell 
    }
}

setHandlerForAbsentInputs(); // call to setHandlerForAbsentInputs

// Cell input handler
function dineAllSymbolsBesideN(e) { 
    let input = e.target; // get this cell
    let value = input.value; // get value from this cell 
    if (e.data !== 'н' || value.length == 2) { // if user inputed not 'н' or value from cell is to long
        value = value.slice(0, value.length - 1); // get first symbol of value
        input.value = value; // put this symbol into cell
    }
}

let form = document.forms['journal']; // get journal
form.addEventListener('submit', function (e) { // if user submit the form
    e.preventDefault(); // remove standart submit event
    sendAjaxWithJournalData(); // call sendAjaxWithJournalData
});

// This function send journal to server
function sendAjaxWithJournalData() {
    let formData = new FormData(form); // creating form data object
    let action = form.getAttribute('action'); // getting an action attribute from html 
    let xhr = new XMLHttpRequest(); // creating new http request without reloading a page

    try { // construction try to catch errors, if they will appear
        xhr.onreadystatechange = function () { // Event handler when readyState is changing
            if (xhr.readyState === 4) { // if complited
                if (xhr.status == 200) { // status 200 - all is alright, request done without errors
                    putTextInSuccessAlertAndShowIt('Данные успешно обновлены');  // show message that all is ok
                } else { // if status is not 200
                    let arrayJSON = JSON.parse(xhr.responseText); // parse to json server response
                    if (arrayJSON.errors) { // if errors
                        let strToShow = ''; // create empty string
                        for (let i in arrayJSON.errors) { // for all errors 
                            strToShow += i + '\n'; // put them into string
                        }
                        putTextInAlertAndShowIt(strToShow); // show errors

                    } else {
                        putTextInAlertAndShowIt('Произошла ошибка'); // if something went wrong
                        throw new Error(xhr.status + " : " + xhr.statusText); // throw new error
                    }
                }
            }
        }

        xhr.open('POST', action); // initial new request
        xhr.setRequestHeader('Accept', 'application/json'); // set header of request
        xhr.send(formData); // send request

    } catch (e) { // if some errors
        console.log(e); // show them in console
    }


}

try { // construction try to catch errors, if they will appear
    document.getElementById('addColumn').addEventListener('click', addColumn); // if user click on add column button
} catch (e) { // catch error
    console.log(e);  // show it
}

// This functoin insert column into table 
function addColumn() {
    let arrayOfLines = document.querySelectorAll('.journal__table-line'); // get all table rows

    let itemWithDate = document.createElement("div"); // creating new div
    itemWithDate.className = 'journal__table-item journal__table-item--date'; // give him class like table-header with data
    let currDate = new Date(); // new Data object
    let currDay = String(currDate.getDate()); // get curent day
    let currMonth = String(currDate.getMonth() + 1); // get curent month
    currMonth = currMonth.length == 1 ? "0" + currMonth : currMonth; // translate date to numbers
    itemWithDate.innerText = currDay + "." + currMonth; // put curent date in numbers format into new div
 
    let deleteNode = document.createElement('img'); // create new img element
    deleteNode.src = 'img/bin.svg'; // put source attribute
    deleteNode.alt = 'del'; // put alternate text into this element
    deleteNode.className = 'delete'; // put class 
    deleteNode.onclick = deleteColumn; // add click hadnler and call function deleteColumn

    itemWithDate.append(deleteNode); // add img element to new div

    addColumn = document.getElementById('addColumn'); // get addColumn element from DOM

    arrayOfLines[0].insertBefore(itemWithDate, addColumn); // insert new div before addColum button

    for (let i = 1; i < arrayOfLines.length; i++) { // for all table rows
        let studentId = arrayOfLines[i].children[0].getAttribute('data-id'); // get student id
        let itemWithN = document.createElement('div'); // create new div
        itemWithN.className = 'journal__table-item'; // making new div like new cell
        itemWithN.innerHTML = `<input class="absent" type="text" name="new[${studentId}]" value=""/>`; // make it for each student in a row
        arrayOfLines[i].append(itemWithN); // append new table cell 
    }
    setHandlerForAbsentInputs(); // call function to set new value
}

document.getElementById('reloadButton').addEventListener('click', () => { location.reload(); }); // reload location if user click on reloadButton

try {  // construction try to catch errors, if they will appear
    document.querySelector('.journal__table-item--date .delete').addEventListener('click', deleteColumn); // add event handler to delete column img 
} catch (e) { // catch error
    console.log(e); // show its
}

// This functoin delete a column 
function deleteColumn(e) { 
    let itemToDelete = e.target.parentNode; // get column, that we will remove from table 

    let arrayOfLines = document.querySelectorAll('.journal__table-line'); // get all rows
    let arrayOfChildren = arrayOfLines[0].children; // get all rows with sdutents
    let postionOfDeleteItem; // create element for position of deleted item

    for (let i = 0; i < arrayOfChildren.length; i++) { // for each row
        if (arrayOfChildren[i] === itemToDelete) {  // put cell into array
            postionOfDeleteItem = i; // put this cell like item to delete
            i = arrayOfChildren.length; // get number of deleted column
        }
    }

    arrayOfLines.forEach(element => { 
        let childrenToDelete = element.children[postionOfDeleteItem]; // get cell to delete
        childrenToDelete.remove(); // delete it
    });
}
