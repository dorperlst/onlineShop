const contact_form = document.getElementById("contact_form");

contact_form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formdata = new FormData(contact_form);
    const url=`/users/${shopName}/contact`
    fetch(url,//
        { method: 'POST', body: formdata})
        .then((res) => { 
            if(res.status == 200)
            {
                contact_form.reset();
                return res.json() 
            }
            
        return null 
        }
    ).then((jsonData) => {   
        
        document.getElementById("usermsg").innerHTML = jsonData.msg
    });
})  


 