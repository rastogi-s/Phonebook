let url = 'https://yellowpagesapp.herokuapp.com/api/contact';
let urlFindById = '/id/';
let urlFindByFirstName = '/firstname/';
let urlFindByLastName = '/lastname/';
let urlFindByEmail = "/email/";
let urlFindByPhone = "/phone/";

module.exports = {
    createContact: createContact,
    findAllContacts: findAllContacts,
    findContactById: findContactById,
    deleteContact: deleteContact,
    updateContact: updateContact,
    deleteAllContacts: deleteAllContacts,
    findContactsByFirstName: findContactsByFirstName,
    findContactsByLastName: findContactsByLastName,
    findContactsByEmail: findContactsByEmail,
    findContactByPhone: findContactByPhone
};

function createContact(contact, callback) {
    console.log(contact);
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(contact),
        headers: {
            'content-type': 'application/json'
        }

    }).then(function (response) {
        return response.json();
    }).then(callback);

}

function findAllContacts(callback) {
    return fetch(url, {
        method: 'GET'
    }).then(function (response) {
        return response.json();
    }).then(callback);

}

function findContactById(contactId, callback) {
    return fetch(url + self.urlFindById + contactId).then(function (response) {
        return response.json();
    }).then(callback);
}

function findContactsByFirstName(firstName, callback) {
    return fetch(url + self.urlFindByFirstName + firstName).then(function (response) {
        return response.json();
    }).then(callback);
}

function findContactsByLastName(lastName, callback) {
    return fetch(url + self.urlFindByLastName + lastName).then(function (response) {
        return response.json();
    }).then(callback);
}

function findContactsByEmail(email, callback) {
    return fetch(url + self.urlFindByEmail + email).then(function (response) {
        return response.json();
    }).then(callback);
}

function findContactByPhone(phone, callback) {
    return fetch(url + self.urlFindByPhone + phone).then(function (response) {
        return response.json();
    }).then(callback);
}

function updateContact(contactId, contact, callback) {
    return fetch(url + '/' + contactId, {
        method: 'PUT',
        body: JSON.stringify(contact),
        headers: {
            'content-type': 'application/json'
        }
    }).then(function (response) {
        return response.json();
    }).then(callback);
}

function deleteContact(contactId, callback) {
    return fetch(url + '/' + contactId, {
        method: 'DELETE',
    }).then(callback);
}

function deleteAllContacts(callback) {
    return fetch(url, {
        method: 'DELETE',
    }).then(callback);
}


// function findLoggedUser(callback){
//     return fetch(self.urlLoggedUser,{
//         credentials:'same-origin'
//     }).then(function (response) {
//         if(response.headers.get("content-type")!=null)
//             return response.json();
//         else return null;
//     }).then(callback);
// }

