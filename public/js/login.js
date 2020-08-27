const form = document.getElementById("form");

form.addEventListener('submit', (e) => {
    e.preventDefault()
    var formdata = new FormData(form);
    
       formdata.append("currentUrl", window.location.href)
    fetch('/users/login',//
        { method: 'POST', body: formdata})
    .then(function(res) {
        if (res.redirected)  
            window.location.href ="/admin";
        else
            document.getElementById("err").textContent="Unable to login"
    })

})



function addshop(id){
    var formdata = new FormData();
   formdata.append('name',form.elements['name'].value)
   formdata.append('admin',id)
   var method = "post"
   for (i=0 ; i < productFiles.files.length; i++)
   formdata.append('myFiles', productFiles.files[i], productFiles.files[i].name);


   if( productFiles.files.length > 0)
       formdata.append('avatar', productFiles.files[0], productFiles.files[0].name);

   fetch('/shops',
       { method: method, body: formdata})
   .then(function(res) {   
        return res; 
   })
}

