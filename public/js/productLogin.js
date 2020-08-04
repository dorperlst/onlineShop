
const form = document.getElementById("loginForm");
 
form.addEventListener('submit', (e) => {
    e.preventDefault()
    var formdata = new FormData(form);
    if(window.location.href.indexOf("login")>0)
       formdata.append("currentUrl", "/admin")
   else
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


// form.addEventListener('submit', (e) => {
//     e.preventDefault()
//     var formdata = new FormData(form);
//     formdata.append('currentUrl', window.location.href)

//     fetch('/users/login',//
//         { method: 'POST', body: formdata})
//         .then((res) => { 
//             if (res.redirected)  
//                 window.location.href = res.url;
//             else
//                 document.getElementById("login_msg").innerHTML= 'Unable to login'
//         }
//     )
// })