
const form = document.getElementById("loginForm");
 

form.addEventListener('submit', (e) => {
    e.preventDefault()
    var formdata = new FormData(form);
    formdata.append('currentUrl', window.location.href)

    fetch('/users/login',//
        { method: 'POST', body: formdata})
        .then((res) => { 
            if (res.redirected)  
                window.location.href = res.url;
        }
    )
})