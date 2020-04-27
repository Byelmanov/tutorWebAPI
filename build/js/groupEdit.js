'use strict';

let form = document.forms['groupEdit']; // get form from DOM
form.addEventListener('submit', function (e) { // when user click on submit button
    e.preventDefault(); // remove standart listener of submit
    if (checkAllInputsAreEmpty()) { // if there are some data in forms input
        sendAjaxgroupEdit(); // send them
    } else { // if inputs are empty
        putTextInAlertAndShowIt('Пожауйлста, заполните все поля!'); // show error message
    }

});

// Function that send a form to server 
function sendAjaxgroupEdit() { 
    let formData = new FormData(form); // creating form data object
    let action = form.getAttribute('action'); // getting an action attribute from html 
    let xhr = new XMLHttpRequest(); // creating new http request without reloading a page

    try { // construction try to catch errors, if they will appear

        xhr.onreadystatechange = function () { // Event handler when readyState is changing
            if (xhr.readyState === 4) { // if complited
                window.scroll(0, 0); // scroll to top 
                if (xhr.status == 200) { // status 200 - all is alright, request done without errors
                    putTextInSuccessAlertAndShowIt('Данные успешно обновлены'); // show message that all is ok
                } else { // if some errors
                    putTextInAlertAndShowIt('Упс, что-то пошло не так('); // show error message
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

// This funtion check if inputs are empty 
function checkAllInputsAreEmpty() { 
    let inputs = form.elements; // get form elements from DOM
    for (let i = 0; i < inputs.length; i++) { // check all of them 
        if (inputs[i].nodeName === 'INPUT' && inputs[i].type === "text") { // If it is input and has html attribute type="text"
            if (inputs[i].value == '' || inputs[i].value == undefined || inputs[i].value == null) { // if this input is empty
                return false;
            }
        }
    }
    return true;
}

// add new student

let counterForNewStudentId = 1; // count of stedents

document.getElementById('addStudentButton').addEventListener('click', addStudent); // when user clicked on button addStudentButton, 
// call function addStudent

// This function add new student to the table
function addStudent() {
    let item = document.createElement('div'); // creating new table_item
    item.className = 'groupEdit__table-item'; // adding to it class for table_item
    item.innerHTML = `
    <input class="name" type="text" name="new[${counterForNewStudentId}][lastname]" placeholder="Фамилия" value=""/>
    <input class="name" type="text" name="new[${counterForNewStudentId}][firstname]" placeholder="Имя" value=""/>
    <input class="name" type="text" name="new[${counterForNewStudentId}][fathername]" placeholder="Отчество" value=""/>
    <img class="groupEdit__table-item-delete" src="img/bin.svg" alt="delete">`; // adding to item inputs with information about new student
    // and put him an id, adding img (minus) to delete this person from table if click on this img

    let tableBlock = document.querySelector('.groupEdit__table'); // get table 
    tableBlock.append(item); // put new table_item into table

    // scroll to the bottom of table
    tableBlock.scrollTop = tableBlock.scrollHeight;

    counterForNewStudentId++; // incrementing student counter
    setHandlerForDeleteButtons(); // call function that add event listener to delete img
}

// delete student

function setHandlerForDeleteButtons() { 
    let arrayOfDeleteButtons = document.querySelectorAll('.groupEdit__table-item-delete'); // get img "minus"
    for (let i = 0; i < arrayOfDeleteButtons.length; i++) { // for each img
        arrayOfDeleteButtons[i].addEventListener('click', deleteStudent); // adding click handler to delete student
    }
};

window.addEventListener('load', setHandlerForDeleteButtons); // if window is loaded call setHandlerForDeleteButtons

function deleteStudent(e) { // this function delete a student from table
    let targetElem = e.target; // get img
    let parent = targetElem.parentElement; // get table item
    let deleteId = parent.getAttribute('data-id'); // get item id from data-attr

    if (deleteId !== null) { 
        createHiddenInputAndInsertId(deleteId); // Swap item to hidden input
    }

    parent.remove(); // remove item from DOM
}

// this function created hidden input instead of removing item
function createHiddenInputAndInsertId(id) {
    let hiddenInput = document.createElement('input'); // creating an input
    hiddenInput.setAttribute('type', 'hidden'); // making this input hidden
    hiddenInput.setAttribute('name', `delete[${id}]`); // adding removing-item id to this input
    document.forms['groupEdit'].append(hiddenInput); //append hidden input instead of removing item
}

document.getElementById('editEmailCross').addEventListener('click', hideEditEmailSection); // call hideEditEmailSection when user clicked on editEmailCross
document.getElementById('editEmailButton').addEventListener('click', showEditEmailSection); // call showEditEmailSection when user clicked on editEmailButton

document.getElementById('editPasswordCross').addEventListener('click', hideEditPasswordSection); // call hideEditPasswordSection when user clicked on editPasswordCross
document.getElementById('editPasswordButton').addEventListener('click', showEditPasswordSection); // call showEditPasswordSection when user clicked on editPasswordButton

function hideEditEmailSection() {
    document.getElementById('editEmailSection').style.display = 'none'; // hide editEmailSection
    document.removeEventListener('keydown', checkEscAndHideWindow); // remove ESC listener
}
function showEditEmailSection() {
    document.getElementById('editEmailSection').style.display = 'flex'; // show editEmailSection
    document.addEventListener('keydown', checkEscAndHideWindow); // add ESC listener
}
function hideEditPasswordSection() {
    document.getElementById('editPasswordSection').style.display = 'none'; // hide editPasswordSection
    document.removeEventListener('keydown', checkEscAndHideWindow);  // remove ESC listener
}
function showEditPasswordSection() {
    document.getElementById('editPasswordSection').style.display = 'flex'; // show editPasswordSection
    document.addEventListener('keydown', checkEscAndHideWindow);  // add ESC listener
}

// ESC listener
function checkEscAndHideWindow(e) {
    e = e || window.event; 
    if (e.keyCode === 27) { // if key is ESC
        hideEditEmailSection(); // Hide EmailSection
        hideEditPasswordSection(); // Hide PasswordSection
    }
}

let formEditEmail = document.forms['editEmail']; // get editEmail form
formEditEmail.addEventListener('submit', function (e) { // if user submit form
    e.preventDefault(); // remove standatr listener
    let email = document.getElementById('editEmailInput').value; // get email from input
    if (checkEmail(email)) { // if e-mail is valid
        sendAjaxEditEmail(); // send form 
    }
});

// Function that send a form to server 
function sendAjaxEditEmail() { 
    let formData = new FormData(form); // creating form data object
    let action = form.getAttribute('action'); // getting an action attribute from html 
    let xhr = new XMLHttpRequest(); // creating new http request without reloading a page

    try { // construction try to catch errors, if they will appear

        xhr.onreadystatechange = function () { // Event handler when readyState is changing
            if (xhr.readyState === 4) { // if complited
                hideEditEmailSection(); 
                window.scroll(0, 0); // scroll to top
                if (xhr.status == 200) { // status 200 - all is alright, request done without errors
                    putTextInSuccessAlertAndShowIt('Данные успешно обновлены'); // show message
                } else { // if error
                    try { // construction try to catch errors, if they will appear
                        let arrayJSON = JSON.parse(xhr.responseText); // get from server answer and put them in array
                        let errors = arrayJSON.errors; // get errors from server answer
                        if (errors) { 
                            let strWithError = ''; // empty string
                            for (let error in errors) { // check all errors
                                strWithError += error + '\n'; // put them to string with errors
                            }
                            putTextInAlertAndShowIt(strWithError); // show errors from string
                        } else { // if server don`t show errors, but request status isn`t 200
                            putTextInAlertAndShowIt('Упс, что-то пошло не так('); // show error message
                        }
                    } catch (e) { // if some errors
                        console.log(e); // show them in console
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

let formEditPassword = document.forms['editPassword']; // get password form
formEditPassword.addEventListener('submit', function (e) { // if user submit form
    e.preventDefault(); // remove standatr listener
    if (checkAllInputs()) { // if inputs aren`t empty
        sendAjaxEditPassword(); // send form 
    }
});

// Function that send a form to server 
function sendAjaxEditPassword() { 
    let formData = new FormData(form); // creating form data object
    let action = form.getAttribute('action'); // getting an action attribute from html 
    let xhr = new XMLHttpRequest(); // creating new http request without reloading a page

    try { // construction try to catch errors, if they will appear

        xhr.onreadystatechange = function () { // Event handler when readyState is changing
            if (xhr.readyState === 4) { // if complited
                hideEditPasswordSection();  // hide PasswordSection
                window.scroll(0, 0); // scroll to top
                if (xhr.status == 200) { // status 200 - all is alright, request done without errors
                    putTextInSuccessAlertAndShowIt('Данные успешно обновлены'); // show message
                } else { // if error
                    try { // construction try to catch errors, if they will appear
                        let arrayJSON = JSON.parse(xhr.responseText); // get from server answer and put them in array
                        let errors = arrayJSON.errors; // get errors from server answer
                        if (errors) { 
                            let strWithError = ''; // empty string
                            for (let error in errors) { // check all errors
                                strWithError += error + '\n'; // put them to string with errors
                            }
                            putTextInAlertAndShowIt(strWithError); // show errors from string
                        } else { // if server don`t show errors, but request status isn`t 200
                            putTextInAlertAndShowIt('Упс, что-то пошло не так('); // show error message
                        }
                    } catch (e) { // if some errors
                        console.log(e); // show them in console
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
// This function check if e-mail is valid
function checkEmail(str) {
    str = str.toString(); // translate str to string
    var regExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/; // Regular expression for e-mail 

    if (regExp.test(str)) { // if e-mail is valid
        return true;
    } else { // else
        return false; // return error
    }
}

// This function check if string is long enaught
function checkPasswordLength(str) { 
    if (str.length < 8 || str == "" || str == null || str == undefined) { // if lenght is < 8 symbols and password field isn`t empty
        return false; // return error
    } else {
        return true;
    }
}

document.getElementById('editEmailInput').addEventListener('input', function () { // when user input data into editEmailInput
    let value = this.value; // get e-mail
    let button = document.querySelector('.groupData__editEmail-submit'); //  get submit button
    if (checkEmail(value)) { // if e-mail is valid
        button.classList.add('groupData__editEmail-submit--active');  // highlight the submit button
    } else {
        button.classList.remove('groupData__editEmail-submit--active'); // remove highlight from button
    }
});

document.getElementById('passwordInput').addEventListener('input', function () { // when user input data into passwordInput
    let passwordValue = this.value; // get password
    let capture = document.getElementById('passwordLength'); // error message about pass lenght
    if (checkPassword(passwordValue)) { // check password
        capture.style.visibility = "hidden"; // hide message
    } else {
        capture.style.visibility = 'visible';  // show message
        document.querySelector('.groupData__editPassword-submit').classList.remove('groupData__editPassword-submit--active'); // remove highlight from button
    }

    if (checkAllInputs()) { // call function to check inputs
        allDataIsValid(); // highliting submit button if data is ok
    }
});

document.getElementById('passwordRepeatInput').addEventListener('input', function () {
    let passwordRepeat = this.value; // second pass value
    let password = document.getElementById('passwordInput').value; // first pass value
    let capture = document.getElementById('passwordsAreNotTheSame'); // error message

    if (passwordRepeat === password) { // if passwords are same
        capture.style.visibility = "hidden"; // hide error message 
    } else {
        capture.style.visibility = 'visible'; // show error message
        document.querySelector('.groupData__editPassword-submit').classList.remove('groupData__editPassword-submit--active'); // remove highlight from button
    }

    if (checkAllInputs()) { // if passwords are same
        allDataIsValid(); // call function allDataIsValid
    }
});

// this function check if passwords are same
function checkAllInputs() {
    let password = document.getElementById('passwordInput').value; // get pass value
    let passwordRepeat = document.getElementById('passwordRepeatInput').value; // get second pass value
    if (checkPassword(password) && password === passwordRepeat) { // if they are same
        return true;
    } else {
        return false;
    }
}


function allDataIsValid() {
    document.getElementById('passwordLength').style.visibility = "hidden"; // hide password lenght error
    document.getElementById('passwordsAreNotTheSame').style.visibility = "hidden"; // hide error if passwords aren`t same
    document.querySelector('.groupData__editPassword-submit').classList.add('groupData__editPassword-submit--active'); // highlight the submit button
}


document.getElementById('reloadButton').addEventListener('click', () => { location.reload(); }); // reload page
