/* global bootstrap: false */
(() => {
    'use strict'
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new bootstrap.Tooltip(tooltipTriggerEl)
    })
  })();

let count=1;
const btnElm=$('#btn-click');
btnElm.on('click',(eventData)=>{
    count=count+1;
    if (0==count%2){
        btnElm.empty();
        btnElm.append(`
        <div class="btn btn-primary ld-ext-right">
                
        <div class="ld ld-ring ld-spin" style="margin-right: 7px !important"></div> Save
        </div>
    `);
    }else{
        console.log(count%2);
        btnElm.empty();
        btnElm.append(`
        <div class="btn btn-primary ld-ext-right">
                Save
        </div>
    `);
    }

})
export function showToast (toastType, header, message) {
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

export function showProgress(xhr){
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