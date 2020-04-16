const form = document.getElementById("form");

form.addEventListener('submit', (e) => {
    e.preventDefault()
    var formdata = new FormData(form);
 
    fetch('users',///login
        { method: 'POST', body: formdata})
    .then(function(res) {
        if (res.redirected)  
            window.location.href = res.url;

            document.getElementById("err").textContent="Unable to login"
    })

})