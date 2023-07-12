import {showProgress} from "./main.js";

const tbodyElm = $("#tbl-customers tbody");
const modalElm = $("#new-customer-modal");
const txtId = $("#txt-id");
const txtName = $("#txt-name");
const txtContact = $("#txt-contact");
const txtAddress = $("#txt-address");
const btnSave = $("#btn-save");

function validateData() {
    const address = txtAddress.val().trim();
    const contact = txtContact.val().trim();
    const name = txtName.val().trim();
    let valid = true;
    resetForm();

    if (!address) {
        valid = invalidate(txtAddress, "Address can't be empty");
    } else if (!/.{3,}/.test(address)) {
        valid = invalidate(txtAddress, 'Invalid address');
    }

    if (!contact) {
        valid = invalidate(txtContact, "Contact number can't be empty");
    } else if (!/^\d{3}-\d{7}$/.test(contact)) {
        valid = invalidate(txtContact, 'Invalid contact number');
    }

    if (!name) {
        valid = invalidate(txtName, "Name can't be empty");
    } else if (!/^[A-Za-z ]+$/.test(name)) {
        valid = invalidate(txtName, "Invalid name");
    }

    return valid;
}

function invalidate(txt, msg) {
    setTimeout(() => txt.addClass('is-invalid animate__shakeX'), 0);
    txt.trigger('select');
    txt.next().text(msg);
    return false;
}
