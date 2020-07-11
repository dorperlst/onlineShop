const contact_form = document.getElementById("contact_form");
 

contact_form.addEventListener('submit', (e) => {
    e.preventDefault()
    var formdata = new FormData(contact_form);
    formdata.append("shop", shopName)
    
var url="/users/"+shopName+"/contact"
    fetch(url,//
        { method: 'POST', body: formdata})
        .then((res) => { 
            if(res.status == 200)
            return res.json() 
        return null 
        }
    ).then((jsonData) => {   
        document.getElementById("msg").innerHTML = jsonData.msg
    });
})  
