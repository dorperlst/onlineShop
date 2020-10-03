const form = document.getElementById("form");

form.addEventListener('submit', (e) => {
    e.preventDefault()
    var formdata = new FormData(form);
    
       formdata.append("currentUrl", window.location.href)
    fetch('/login',//
        { method: 'POST', body: formdata})
    .then(function(res) {
        if (res.redirected)  
            window.location.href ="/admin";
        else
            document.getElementById("err").textContent="Unable to login"
    })

})



