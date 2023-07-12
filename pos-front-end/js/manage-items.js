// import {Big} from 'big.js';
import {Big} from '../node_modules/big.js/big.mjs';

const tbodyElm = $("#tbl-items tbody");
const modalElm = $("#new-item-modal");
const txtCode = $("#txt-code");
const txtDescription = $("#txt-description");
const txtQuantity = $("#txt-quantity");
const txtPrice = $("#txt-price");
const btnSave = $("#btn-save");
const btnNewItem=$("#btn-new-item");
const modalHeaderElm=$("#modal-header");

tbodyElm.empty();

function formatItemCode(code) {
    return `I${code.toString().padStart(3, '0')}`;
}

[txtDescription, txtQuantity, txtPrice].forEach(txtElm =>
    $(txtElm).addClass('animate__animated'));

btnSave.on('click', () => {
    if (!validateData()) {
        return false;
    }
    const code = txtCode.val().trim();
    const description = txtDescription.val().trim();
    const unitPrice = txtPrice.val().trim();
    const qty = txtQuantity.val().trim() ? txtQuantity.val().trim() : 0;

    let item = {
        description, unitPrice, qty
    };
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('readystatechange', () => {
            if (xhr.readyState === 4) {
                [txtDescription, txtQuantity, txtPrice, btnSave].forEach(elm => elm.removeAttr('disabled'));
                $("#loader").css('visibility', 'hidden');
                $("#loader").css('display', 'none');
                if (xhr.status === 201) {
                    item = JSON.parse(xhr.responseText);
                    getItems();

                    resetForm(true);
                    txtDescription.trigger('focus');
                    showToast('success', 'Saved', 'Item has been saved successfully');
                }else if(xhr.status === 204) {
                    // item = JSON.parse(xhr.responseText);
                    getItems();

                    resetForm(true);
                    btnSave.text("Save");
                    modalHeaderElm.text("Add New Item");
                    txtCode.trigger('focus');
                    showToast('success', 'Updated', 'Item has been Updated successfully');
                    modalElm.modal('hide');
                } else {
                    const errorObj = JSON.parse(xhr.responseText);
                    showToast('error', 'Failed to save', errorObj.message);
                }
            }
        });
    console.log(btnSave.text().trim());
        if(btnSave.text().trim()==="Save"){
            console.log("working for save");
            item={
                code,description, unitPrice, qty
            }

            xhr.open('POST', 'http://localhost:8080/pos/items', true);


            xhr.setRequestHeader('Content-Type', 'application/json');


            xhr.send(JSON.stringify(item));
        }else if(btnSave.text().trim()==="Update"){

            xhr.open('PATCH', `http://localhost:8080/pos/items/${+code.replace('I',"")}`, true);

            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.send(JSON.stringify(item));
        }

        [txtDescription, txtQuantity, txtPrice, btnSave].forEach(elm => elm.attr('disabled', 'true'));
        $("#loader").css('visibility', 'visible');
        $("#loader").css('display', 'inline-block');


});


function validateData() {
    const price = txtPrice.val().trim();
    const description = txtDescription.val().trim();
    let valid = true;
    resetForm();


    if (!price) {
        valid = invalidate(txtPrice, "Price can't be empty");
    }

    if (!description) {
        valid = invalidate(txtDescription, "Description can't be empty");
    } else if (!/^[A-Za-z \d\-]+$/.test(description)) {
        valid = invalidate(txtDescription, "Invalid Description");
    }

    return valid;
}

function invalidate(txt, msg) {
    setTimeout(() => txt.addClass('is-invalid animate__shakeX'), 0);
    txt.trigger('select');
    txt.next().text(msg);
    return false;
}

function resetForm(clearData) {
    [txtCode, txtDescription, txtQuantity, txtPrice].forEach(txt => {
        txt.removeClass("is-invalid animate__shakeX");
        if (clearData) txt.val('');
    });
}

modalElm.on('show.bs.modal', () => {
    if (btnSave.text()==="Save"){
        resetForm(true);
        setTimeout(() => txtCode.trigger('focus'), 500);
    }else if (btnSave.text()==="Update"){
        // txtCode.parent().show();
        setTimeout(() => txtDescription.trigger('focus'), 500);
    }
});

function showToast(toastType, header, message) {
    const toast = $("#toast .toast");
    toast.removeClass("text-bg-success text-bg-warning text-bg-danger");
    switch (toastType) {
        case 'success':
            toast.addClass('text-bg-success');
            break;
        case 'warning':
            toast.addClass('text-bg-warning');
            break;
        case 'error':
            toast.addClass('text-bg-danger');
            break;
        default:
    }
    $("#toast .toast-header > strong").text(header);
    $("#toast .toast-body").text(message);
    toast.toast('show');
}

function getItems(){
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange',()=>{
        if (xhr.readyState === 4){
            if (xhr.status == 200){
                tbodyElm.empty();
                const itemList=JSON.parse(xhr.responseText);
                itemList.forEach(item=>{
                    tbodyElm.append(`
                    <tr>
                        <td class="text-center">${formatItemCode(item.code)}</td>
                        <td>${item.description}</td>
                        <td class="d-none d-xl-table-cell">${item.qty}</td>
                        <td class="price text-center">${item.unitPrice}</td>
                        <td>
                            <div class="actions d-flex gap-3 justify-content-center">
                                <svg data-bs-toggle="tooltip" data-bs-title="Edit Item" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                    class="bi bi-pencil-square edit" viewBox="0 0 16 16" trigger="hover">
                                    <path
                                        d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                    <path fill-rule="evenodd"
                                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                </svg>
                                <svg data-bs-toggle="tooltip" data-bs-title="Delete Item" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                    class="bi bi-trash delete" viewBox="0 0 16 16" trigger="hover">
                                    <path
                                        d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                                    <path
                                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                                </svg>
                            </div>
                        </td>
                    </tr>
                `);
                    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
                    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
                })

            }else {
                tbodyElm.empty();
                $("#tbl-items tfoot").show();
                showToast('error', 'Failed', 'Failed to fetch items');
                console.log(JSON.parse(xhr.responseText));
            }
        }
    });
    const searchText = $("#txt-search").val().trim();
    const query = (searchText) ? `?q=${searchText}`: "";

    xhr.open('GET', 'http://localhost:8080/pos/items' + query, true);

    xhr.send();
}
getItems();
$("#txt-search").on('input', ()=> getItems());


function showProgress(xhr){
    const progressBar= $("#progress-bar");
    xhr.addEventListener('loadstart',()=>{
        $("#progress-bar").width('0%');
    });
    xhr.addEventListener('progress',(evetData)=>{
        const downloadedBytes=evetData.loaded;
        const totalBytes=evetData.total;
        const progress=downloadedBytes/totalBytes *100;
        progressBar.width(`${progress}%`);

    });
    xhr.addEventListener('loadend',()=>{
        $("#progress-bar").width('100%');
        setTimeout(()=>$("#progress-bar").width('0%'),500)
    });
}

tbodyElm.on('click','.delete',(eventData)=>{
    const code=+$(eventData.target).parents("tr").children("td:first-child").text().replace('I',"");
    console.log("deleteID "+code);
    const xhr= new XMLHttpRequest();
    const jxhr=$.ajax(`http://localhost:8080/pos/items/${code}`,{
        method: 'DELETE',xhr:()=>xhr
    });
    showProgress(xhr);
    jxhr.done(()=>{
        showToast('success','Deleted','Item Successfully Deleted');
        getItems();
    });
    jxhr.fail(()=>{
        showToast('error','Failed','Failed to Delete Item');
    });

});

tbodyElm.on('click','.edit',(eventData)=>{
    const code=$(eventData.target).parents("tr").children("td:first-child").text();
    const description=$(eventData.target).parents("tr").children("td:nth-child(2)").text();
    const qty=$(eventData.target).parents("tr").children("td:nth-child(3)").text();
    const unitPrice=$(eventData.target).parents("tr").children("td:nth-child(4)").text();
    console.log("Code "+code);
    console.log("Description "+description);
    console.log("Quantity "+qty);
    console.log("Price "+unitPrice);

    modalHeaderElm.text("Update Item")
    btnSave.text("Update");
    txtCode.val(code);
    txtPrice.val(unitPrice);
    txtDescription.val(description);
    txtQuantity.val(qty);
    setTimeout(() => btnNewItem.trigger('click'), 20);
// btnNewItem.trigger('click');


})