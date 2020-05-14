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
                    try {
                        let arrayJSON = JSON.parse(xhr.responseText);
                        let redirect = arrayJSON.redirect;
                        if (redirect != undefined) {
                            window.location.href = redirect;
                        }
                    } catch (e) {
                        console.log(e);
                    } finally {
                        putTextInSuccessAlertAndShowIt('Данные успешно обновлены');
                    }

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
    <img class="groupEdit__table-item-delete" src="/img/bin.svg" alt="delete">`;

    let tableBlock = document.querySelector('.groupEdit__table');
    tableBlock.append(item);

    // scroll to the bottom of table
    tableBlock.scrollTop = tableBlock.scrollHeight;

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

try {
    document.getElementById('editEmailCross').addEventListener('click', hideEditEmailSection);
    document.getElementById('editEmailButton').addEventListener('click', showEditEmailSection);

    document.getElementById('editPasswordCross').addEventListener('click', hideEditPasswordSection);
    document.getElementById('editPasswordButton').addEventListener('click', showEditPasswordSection);
} catch (e) {
    console.log(e);
}

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

try {
    let formEditEmail = document.forms['editEmail'];
    formEditEmail.addEventListener('submit', function (e) {
        e.preventDefault();
        let email = document.getElementById('editEmailInput').value;
        if (checkEmail(email)) {
            sendAjaxEditEmail();
        }
    });
} catch (e) {
    console.log(e);
}

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
                    document.getElementById('groupDataEmail').innerText = formData.get('email');
                } else {
                    try {
                        let arrayJSON = JSON.parse(xhr.responseText);
                        let errors = arrayJSON.errors;
                        if (errors) {
                            let strWithError = '';
                            for (let error in errors) {
                                strWithError += errors[error][0] + '\n';
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

try {
    let formEditPassword = document.forms['editPassword'];
    formEditPassword.addEventListener('submit', function (e) {
        e.preventDefault();
        if (checkAllInputs()) {
            sendAjaxEditPassword();
        }
    });
} catch (e) {
    console.log(e);
}

function sendAjaxEditPassword() {
    let formData = new FormData(formEditPassword);
    let action = formEditPassword.getAttribute('action');
    let xhr = new XMLHttpRequest();

    try {

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                hideEditPasswordSection();
                window.scroll(0, 0);
                // clear password inputs
                document.getElementById('passwordInput').value = '';
                document.getElementById('passwordRepeatInput').value = '';
                if (xhr.status == 200) {
                    putTextInSuccessAlertAndShowIt('Данные успешно обновлены');
                } else {
                    try {
                        let arrayJSON = JSON.parse(xhr.responseText);
                        let errors = arrayJSON.errors;

                        let strWithError = '';
                        for (let error in errors) {
                            strWithError += errors[error][0] + '\n';
                        }
                        putTextInAlertAndShowIt(strWithError);

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

try {
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
} catch (e) {
    console.log(e);
}

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


document.getElementById('reloadButton').addEventListener('click', () => { location.reload(); });

// NAVIGATION
let previousTarget = $('.nav-link:first');
$('.nav-link').on('click', function (e) {
    e.preventDefault();

    let $target = $(e.target);

    $(previousTarget.attr('href')).hide();
    $target.addClass('active');
    previousTarget.removeClass('active');

    let idOfBlockToShow = $target.attr('href');
    $(idOfBlockToShow).css('display', 'flex');
    previousTarget = $target;
});

// edit group subjects

let subjectsPerGroupForm = document.forms['subjectsPerGroupForm'];
let allSubjectsForm = document.forms['allSubjectsForm'];

function setHandlerForTutorSelects() {
    let arrayOfTutorsSelects = document.querySelectorAll('.select');
    for (let i = 0; i < arrayOfTutorsSelects.length; i++) {
        arrayOfTutorsSelects[i].addEventListener('change', sendAjaxTutorSelect);
    }
}

window.addEventListener('load', setHandlerForTutorSelects);

function sendAjaxTutorSelect(e) {
    let select = e.target;
    let tutorId = select.value;
    let subjectId = select.parentNode.getAttribute('data-id');

    let formData = new FormData();
    formData.append('tutor', tutorId);
    formData.append('subject', subjectId);
    formData.append('_token', document.getElementById('subjectsPerGroupToken').value);
    formData.append('_method', 'PUT');

    let action = subjectsPerGroupForm.getAttribute('action');

    let xhr = new XMLHttpRequest();

    try {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status == 200) {
                    putTextInSuccessAlertAndShowIt('Данные успешно обновлены');
                } else {
                    try {
                        let arrayJSON = JSON.parse(xhr.responseText);
                        let errors = arrayJSON.errors;

                        let strWithError = '';
                        for (let error in errors) {
                            strWithError += errors[error][0] + '\n';
                        }
                        putTextInAlertAndShowIt(strWithError);

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

// delete subject

function setHandlerForAllDeleteSubjectButtons() {
    let array = document.querySelectorAll('.groupSubjects__table-item-delete');
    array.forEach((elem) => {
        elem.addEventListener('click', handleDeleteSubjectButton);
    });
}

window.addEventListener('load', setHandlerForAllDeleteSubjectButtons);


function handleDeleteSubjectButton(e) {
    let subjectItem = e.target.parentNode;
    let arrayOfChildren = subjectItem.children;
    let itemData = {
        'subjectId': subjectItem.getAttribute('data-id'),
        'type': arrayOfChildren[0],
        'name': arrayOfChildren[1].innerText
    };

    let formData = new FormData();
    formData.append('subject', itemData.subjectId);
    formData.append('_token', document.getElementById('subjectsPerGroupToken').value);
    formData.append('_method', 'DELETE');

    let action = subjectsPerGroupForm.getAttribute('data-actionToDelete');

    let xhr = new XMLHttpRequest();

    try {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status == 200) {
                    deleteSubject(itemData);
                    subjectItem.remove();
                    putTextInSuccessAlertAndShowIt('Данные успешно обновлены');
                } else {
                    try {
                        let arrayJSON = JSON.parse(xhr.responseText);
                        let errors = arrayJSON.errors;

                        let strWithError = '';
                        for (let error in errors) {
                            strWithError += errors[error][0] + '\n';
                        }
                        putTextInAlertAndShowIt(strWithError);

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

function deleteSubject(dataObj) {
    let item = document.createElement('div');
    item.className = 'groupSubjects__table-item';
    item.setAttribute('data-id', dataObj.subjectId);
    item.append(dataObj.type);
    item.innerHTML += `
    <p class="name name--allSubjects">${dataObj.name}</p>
    <img src="/img/plusSign.svg" alt="add" class="groupSubjects__table-item-add">
    `;

    document.querySelector('#allSubjectsTable').append(item);
    setHandlerForAllAddSubjectButtons();
}

// add subject 

function setHandlerForAllAddSubjectButtons() {
    let array = document.querySelectorAll('.groupSubjects__table-item-add');
    array.forEach((elem) => {
        elem.addEventListener('click', handleAddSubjectButton);
    });
}

window.addEventListener('load', setHandlerForAllAddSubjectButtons);

function handleAddSubjectButton(e) {
    let subjectItem = e.target.parentNode;
    let arrayOfChildren = subjectItem.children;
    let itemData = {
        'subjectId': subjectItem.getAttribute('data-id'),
        'type': arrayOfChildren[0],
        'name': arrayOfChildren[1].innerText
    };

    let formData = new FormData();
    formData.append('subject', itemData.subjectId);
    formData.append('_token', document.getElementById('allSubjectsToken').value);
    let action = allSubjectsForm.getAttribute('action');

    let xhr = new XMLHttpRequest();
    try {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status == 200) {
                    let arrayJSON = JSON.parse(xhr.responseText);
                    itemData.arrayOfTutors = arrayJSON;
                    addSubject(itemData);
                    subjectItem.remove();
                } else {

                    try {
                        let arrayJSON = JSON.parse(xhr.responseText);
                        let errors = arrayJSON.errors;

                        let strWithError = '';
                        for (let error in errors) {
                            strWithError += errors[error][0] + '\n';
                        }
                        putTextInAlertAndShowIt(strWithError);

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

function addSubject(dataObj) {
    console.log(dataObj);
    let arrayOfTutors = dataObj.arrayOfTutors;

    let item = document.createElement('div');
    item.className = 'groupSubjects__table-item';
    item.setAttribute('data-id', dataObj.subjectId);
    item.append(dataObj.type);

    item.innerHTML += `
    <p class="name">${dataObj.name}</p>
    `;

    let select = document.createElement('select');
    select.name = 'subject';
    select.className = 'select';
    let option = document.createElement('option');
    option.value = 0;
    option.innerText = "";
    option.setAttribute('selected', 'true');
    option.setAttribute('disabled', 'true');
    select.append(option);

    for (let i in arrayOfTutors) {
        let option = document.createElement('option');
        option.value = arrayOfTutors[i].id;
        option.innerText = `${arrayOfTutors[i].lastname} ${arrayOfTutors[i].firstname} ${arrayOfTutors[i].fathername} ${arrayOfTutors[i].email}`;
        select.append(option);
    }

    item.append(select);

    item.innerHTML += `
    <img src="/img/bin.svg" alt="add" class="groupSubjects__table-item-delete">
    `;

    document.querySelector('#subjectPerGroupTable').append(item);
    setHandlerForAllDeleteSubjectButtons();
    setHandlerForTutorSelects();
}


// ACCOUNTS

document.forms['accounts'].addEventListener('submit', function (e) {
    e.preventDefault();

    let error = false;

    let arrayOfSelect = document.querySelectorAll('.accounts__select');
    arrayOfSelect.forEach((elem) => {
        if (elem.value == 0) {
            error = true;
        }
    });

    if (error) {
        putTextInAlertAndShowIt('Заполните данные');
    } else {
        let formData = new FormData(this);
        let action = this.getAttribute('action');
        let xhr = new XMLHttpRequest();

        try {
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status == 200) {
                        putTextInSuccessAlertAndShowIt('Данные успешно обновлены');
                    } else {
                        try {
                            let arrayJSON = JSON.parse(xhr.responseText);
                            let errors = arrayJSON.errors;

                            let strWithError = '';
                            for (let error in errors) {
                                strWithError += errors[error][0] + '\n';
                            }
                            putTextInAlertAndShowIt(strWithError);

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


});

