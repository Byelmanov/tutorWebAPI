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
                window.scroll(0, 0);
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
    <img class="groupEdit__table-item-delete" src="img/bin.svg" alt="delete">`;

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

document.getElementById('editEmailCross').addEventListener('click', hideEditEmailSection);
document.getElementById('editEmailButton').addEventListener('click', showEditEmailSection);

document.getElementById('editPasswordCross').addEventListener('click', hideEditPasswordSection);
document.getElementById('editPasswordButton').addEventListener('click', showEditPasswordSection);

function hideEditEmailSection() {
    document.getElementById('editEmailSection').style.display = 'none';
    document.removeEventListener('keydown', checkEscAndHideWindow);
}
function showEditEmailSection() {
    document.getElementById('editEmailSection').style.display = 'flex';
    document.addEventListener('keydown', checkEscAndHideWindow);
}
function hideEditPasswordSection() {
    document.getElementById('editPasswordSection').style.display = 'none';
    document.removeEventListener('keydown', checkEscAndHideWindow);
}
function showEditPasswordSection() {
    document.getElementById('editPasswordSection').style.display = 'flex';
    document.addEventListener('keydown', checkEscAndHideWindow);
}

function checkEscAndHideWindow(e) {
    e = e || window.event;
    if (e.keyCode === 27) {
        hideEditEmailSection();
        hideEditPasswordSection();
    }
}

let formEditEmail = document.forms['editEmail'];
formEditEmail.addEventListener('submit', function (e) {
    e.preventDefault();
    let email = document.getElementById('editEmailInput').value;
    if (checkEmail(email)) {
        sendAjaxEditEmail();
    }
});

function sendAjaxEditEmail() {
    let formData = new FormData(formEditEmail);
    let action = formEditEmail.getAttribute('action');
    let xhr = new XMLHttpRequest();

    try {

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                hideEditEmailSection();
                window.scroll(0, 0);
                if (xhr.status == 200) {
                    putTextInSuccessAlertAndShowIt('Данные успешно обновлены');
                } else {
                    try {
                        let arrayJSON = JSON.parse(xhr.responseText);
                        let errors = arrayJSON.errors;
                        if (errors) {
                            let strWithError = '';
                            for (let error in errors) {
                                strWithError += error + '\n';
                            }
                            putTextInAlertAndShowIt(strWithError);
                        } else {
                            putTextInAlertAndShowIt('Упс, что-то пошло не так(');
                        }
                    } catch (e) {
                        putTextInAlertAndShowIt('Упс, что-то пошло не так(');
                    }

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

let formEditPassword = document.forms['editPassword'];
formEditPassword.addEventListener('submit', function (e) {
    e.preventDefault();
    if (checkAllInputs()) {
        sendAjaxEditPassword();
    }
});

function sendAjaxEditPassword() {
    let formData = new FormData(formEditPassword);
    let action = formEditPassword.getAttribute('action');
    let xhr = new XMLHttpRequest();

    try {

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                hideEditPasswordSection();
                window.scroll(0, 0);
                if (xhr.status == 200) {
                    putTextInSuccessAlertAndShowIt('Данные успешно обновлены');
                } else {
                    try {
                        let arrayJSON = JSON.parse(xhr.responseText);
                        let errors = arrayJSON.errors;
                        if (errors) {
                            let strWithError = '';
                            for (let error in errors) {
                                strWithError += error + '\n';
                            }
                            putTextInAlertAndShowIt(strWithError);
                        } else {
                            putTextInAlertAndShowIt('Упс, что-то пошло не так(');
                        }
                    } catch (e) {
                        putTextInAlertAndShowIt('Упс, что-то пошло не так(');
                    }

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

function checkEmail(str) {
    str = str.toString();
    var regExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (regExp.test(str)) {
        return true;
    } else {
        return false;
    }
}
function checkPassword(str) {
    if (str.length < 8 || str == "" || str == null || str == undefined) {
        return false;
    } else {
        return true;
    }
}


document.getElementById('editEmailInput').addEventListener('input', function () {
    let value = this.value;
    let button = document.querySelector('.groupData__editEmail-submit');
    if (checkEmail(value)) {
        button.classList.add('groupData__editEmail-submit--active');
    } else {
        button.classList.remove('groupData__editEmail-submit--active');
    }
});

document.getElementById('passwordInput').addEventListener('input', function () {
    let passwordValue = this.value;
    let capture = document.getElementById('passwordLength');
    if (checkPassword(passwordValue)) {
        capture.style.visibility = "hidden";
    } else {
        capture.style.visibility = 'visible';
        document.querySelector('.groupData__editPassword-submit').classList.remove('groupData__editPassword-submit--active');
    }

    if (checkAllInputs()) {
        allDataIsValid();
    }
});

document.getElementById('passwordRepeatInput').addEventListener('input', function () {
    let passwordRepeat = this.value;
    let password = document.getElementById('passwordInput').value;
    let capture = document.getElementById('passwordsAreNotTheSame');

    if (passwordRepeat === password) {
        capture.style.visibility = "hidden";
    } else {
        capture.style.visibility = 'visible';
        document.querySelector('.groupData__editPassword-submit').classList.remove('groupData__editPassword-submit--active');
    }

    if (checkAllInputs()) {
        allDataIsValid();
    }
});


function checkAllInputs() {
    let password = document.getElementById('passwordInput').value;
    let passwordRepeat = document.getElementById('passwordRepeatInput').value;
    if (checkPassword(password) && password === passwordRepeat) {
        return true;
    } else {
        return false;
    }
}

function allDataIsValid() {
    document.getElementById('passwordLength').style.visibility = "hidden";
    document.getElementById('passwordsAreNotTheSame').style.visibility = "hidden";
    document.querySelector('.groupData__editPassword-submit').classList.add('groupData__editPassword-submit--active');
}
