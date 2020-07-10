const contact_form = document.getElementById("contact_form");
 

contact_form.addEventListener('submit', (e) => {
    e.preventDefault()
    var formdata = new FormData(contact_form);
    formdata.append('currentUrl', window.location.href)
    

    fetch('/users/contact',//
        { method: 'POST', body: formdata})
        .then((res) => { 
            if(res.status == 200)
            return res.json() 
        return null 
        }
    ).then((jsonData) => {   
        document.getElementById("msg").innerHTML=jsonData.msg
    });
})  
