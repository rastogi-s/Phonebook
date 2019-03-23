import './../scss/main.scss';

(function () {
    let inputFirstName;
    let inputLastName;
    let inputEmail;
    let inputPhone;

    let editFirstName;
    let editLastName;
    let editEmail;
    let editPhone;
    let hiddenElementForId;
    let searchBar;
    let searchButton;

    let createButton;
    let updateButton;
    let contactListTab;
    let listDiv;
    let listItemTemplate;
    let myModal;
    let phoneBookService = require('./service/phonebook.service.client');

    let recordList;

    main();

    function main() {

        inputFirstName = document.getElementById('iFirstName');
        inputLastName = document.getElementById('iLastName');
        inputEmail = document.getElementById('iEmail');
        inputPhone = document.getElementById('iPhone');

        editFirstName = document.getElementById('editFirstName');
        editLastName = document.getElementById('editLastName');
        editEmail = document.getElementById('editEmail');
        editPhone = document.getElementById('editPhone');
        hiddenElementForId = document.getElementById('hiddenElementForId');

        createButton = document.getElementById('addContact');
        updateButton = document.getElementById('updateContact');
        listDiv = document.getElementById('recordList');
        myModal = document.getElementById('exampleModalCenter');
        searchBar = document.getElementById('searchBar');
        contactListTab = document.getElementById('contactListTab');
        searchButton = document.getElementById('searchButton');

        listItemTemplate = document.getElementsByClassName('recordItem')[0];

        createButton.onclick = createRecord;
        updateButton.onclick = updateRecord;
        searchButton.onclick = search;
        searchBar.onkeyup = search;

        findAllContacts();

    }


    function createRecord(event) {
        console.log('create record');
        if (checkValidity(event.target.parentNode)) {
            let record = {
                "firstname": inputFirstName.value,
                "lastname": inputLastName.value,
                "phone": inputPhone.value,
                "email": inputEmail.value
            };
            phoneBookService.createContact(record, findAllContacts);
            clearAllFields(event.target.parentNode);
            contactListTab.click();
            document.getElementById('alertEdit').setAttribute('style', 'display:none');
        } else {
            console.log('error');

        }

    }

    function checkValidity(eventGeneratorParent) {


        let inputTypes = ['text', 'email', 'tel'];
        let inputs = eventGeneratorParent.getElementsByTagName('input');

        let res = true;
        eventGeneratorParent.getElementsByClassName('alert')[0].innerHTML = '';
        for (let index = 0; index < inputs.length; ++index) {
            if (inputTypes.includes(inputs[index].type) && !inputs[index].checkValidity()) {
                //inputs[index].value = inputs[index].validationMessage;
                eventGeneratorParent.getElementsByClassName('alert')[0].setAttribute('style', 'display:block');
                if (eventGeneratorParent.getElementsByClassName('alert')[0].innerHTML !== '')
                    eventGeneratorParent.getElementsByClassName('alert')[0].innerHTML =
                        eventGeneratorParent.getElementsByClassName('alert')[0].innerHTML
                        + '<br>' + '<strong>' + inputs[index].getAttribute("name") + '</strong>: ' + inputs[index].validationMessage;
                else
                    eventGeneratorParent.getElementsByClassName('alert')[0].innerHTML =
                        '<strong>' + inputs[index].getAttribute("name") + '</strong>: ' + inputs[index].validationMessage;
                res = false;
            }

        }

        return res;
    }

    function findAllContacts() {
        console.log('find all contacts');
        searchBar.value = "";
        phoneBookService.findAllContacts(preRenderContacts);
    }

    function search(event) {
        console.log("search");
        // console.log(recordList);
        let filterList;
        if (recordList && recordList.length > 0) {
            let eventTarget = event.target;
            let text = eventTarget.value.toLowerCase();
            console.log(text);
            let regex = new RegExp("^" + text, "g");
            if (text.match(/^[0-9]{0,10}$/)) {
                console.log("in phone filter");
                filterList = recordList.filter(record => record.phone.toString().toLowerCase().match(regex));
            } else if (text.match(/^[a-zA-Z]*@[a-zA-Z]*$/)) {
                console.log("in email filter");
                filterList = recordList.filter(record => record.email.toLowerCase().match(regex));
            } else {
                console.log("in firstname filter");
                filterList = recordList.filter(record => record.firstname.toLowerCase().match(regex)
                    || record.lastname.toLowerCase().match(regex) || record.email.toLowerCase().match(regex));
            }
        }
        if (filterList)
            renderContacts(filterList);


    }

    function preRenderContacts(records) {
        recordList = records;
        renderContacts(records);

    }

    function renderContacts(records) {
        console.log('render all contacts');
        if (listDiv.hasChildNodes()) {

            while (listDiv.firstChild) {
                listDiv.removeChild(listDiv.firstChild);
            }
        }
        if (records && records.length > 0) {
            records.sort(function (a, b) {
                let nameA = a.lastname.toLowerCase(), nameB = b.lastname.toLowerCase();
                if (nameA < nameB) //sort string ascending
                    return -1;
                if (nameA > nameB)
                    return 1;
                return 0 //default return value (no sorting)
            });


            for (let rec in records) {
                let record = listItemTemplate.cloneNode(true);
                record.querySelector('.firstName').innerHTML = records[rec].firstname;
                record.querySelector('.lastName').innerHTML = records[rec].lastname;
                record.querySelector('.email').innerHTML = records[rec].email;
                record.querySelector('.phone').innerHTML = records[rec].phone;
                record.setAttribute('id', records[rec]._id);
                record.setAttribute('data-target', '#'+'detailsDiv'+records[rec]._id);
                record.querySelector('.detailsDiv').setAttribute('id', 'detailsDiv'+records[rec]._id);
                record.querySelector('.editBtn').onclick = editRecord;
                record.querySelector('.deleteBtn').onclick = deleteRecord;
                // record.addEventListener('click', function (event) {
                //     record.classList.toggle('button-active')
                // })
                listDiv.appendChild(record);
            }
        }
    }


    function editRecord(e) {
        console.log('in edit');
        let id = e.target.parentNode.parentNode.parentNode.id;
        phoneBookService.findContactById(id, updateEditFields);

    }

    function updateEditFields(record) {
        document.getElementById('alertEdit').setAttribute('style', 'display:none');
        if (record && record.length > 0) {

            editFirstName.value = record[0].firstname;
            editLastName.value = record[0].lastname;
            editEmail.value = record[0].email;
            editPhone.value = record[0].phone;
            hiddenElementForId.value = record[0]._id;
        }
    }

    function updateRecord(event) {
        console.log('update record');
        if (checkValidity(event.target.parentNode.parentNode)) {
            let record = {
                "firstname": editFirstName.value,
                "lastname": editLastName.value,
                "phone": editPhone.value,
                "email": editEmail.value
            };
            phoneBookService.updateContact(hiddenElementForId.value, record, findAllContacts);
            document.getElementById('closeModal').click();
        } else {
            console.log('error');
        }
    }


    function deleteRecord(e) {
        let id = e.target.parentNode.parentNode.parentNode.id;
        phoneBookService.deleteContact(id, findAllContacts);
    }

    function clearAllFields(container) {
        console.log(container);
        let inputTypes = ['text', 'email', 'tel'];
        let inputs = container.getElementsByTagName('input');
        for (let index = 0; index < inputs.length; ++index) {
            if (inputTypes.includes(inputs[index].type))
                inputs[index].value = '';
        }
    }


})();
