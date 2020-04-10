const form = document.getElementById( "loginForm" );

form.addEventListener('submit', (e) => {
    e.preventDefault()
    var formdata = new FormData(form);
 
    fetch('/users/login', { method: 'POST',  headers: {  },body: formdata})
    .then(function(res) { return res; })

})