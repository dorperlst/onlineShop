const form = document.getElementById( "form" );

form.addEventListener('submit', (e) => {
    e.preventDefault()
    var formdata = new FormData(form);
 
    fetch('/products',///login
        { method: 'POST', body: formdata})
    .then(function(res) { return res; })

})