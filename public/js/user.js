  

// const form = document.getElementById("loginForm");

// initUser()

// form.addEventListener('submit', (e) => {
//     e.preventDefault()
//     var formdata = new FormData(form);
//     formdata.append('currentUrl', window.location.href)

//     fetch('/users/login',//
//         { method: 'POST', body: formdata})
//         .then((res) => { 
//             if (res.redirected)  
//                 window.location.href = res.url;
//         }
//     )
// })

// function initUser(){
//     if(username == undefined ||  username == "")
//         return

//     var userlabel = document.getElementById("userlabel")
//     userlabel.innerHTML  = 'Hello '+ username 

//     // if(username == "Guest")
//     // // userlabel.innerHTML  += ' <a href="/login">Login</a> '
//     // else  
//     // {
//     //     // userlabel.innerHTML  += '<a onclick="logout()">Logout</a>'
//     //     // userlabel.innerHTML  += '<a onclick="logoutAll()">Logout All</a>'
//     // }
        
// }
  
document.getElementById("searchButton").addEventListener('click', (e) => {
    e.preventDefault()
    const tag = document.getElementById("tag").value.trim();   

    var href = '/'+shopName+'/view'
    var category =''
    var appendSign='?'
    if(categories.value != 0)
    {
        href+="?category="+  categories.options[categories.selectedIndex].text
        appendSign='&&'
    }

    if( tag!= '')
        href+=appendSign + "tag="+ tag

    window.location.href = href
})

function logout(){
    
    var formdata = new FormData();
    formdata.append('currentUrl', window.location.href)
    fetch('/users/logout',//
        { method: 'POST', body: formdata})
    .then(function(res) {
    //addshop("5e9f216829efa7242bd514c4")
        window.location.href = res.url;
    })
}
function logoutAll(){

var formdata = new FormData();
formdata.append('currentUrl', window.location.href)
fetch('/users/logoutAll',//
    { method: 'POST', body: formdata})
.then(function(res) {
//addshop("5e9f216829efa7242bd514c4")
    window.location.href = res.url;
})
}