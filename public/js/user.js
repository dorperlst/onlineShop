  
        
       
       
function init(username){
    if(username == undefined ||  username == "")
        return

    var liUser = document.getElementById("liUser")
    liUser.innerHTML  = '<p>Hello' + username +'</p>'

    if(username == "Guest")
        liUser.innerHTML  += ' <a href="/login">Login</a> '
    else  
    {
        liUser.innerHTML  += '<a onclick="logout()">Logout</a>'
        liUser.innerHTML  += '<a onclick="logoutAll()">Logout All</a>'
    }
        
}

function logout(){
    
    fetch('users/logout',
        { method: 'POST', body: {}})
    .then(function(res) {
        if (res.redirected)  
            window.location.href = res.url;
        else    
            window.location.href='/login'
    })
}

function logoutAll(){
    fetch('users/logoutAll',
       { method: 'POST', body: {}})
   .then(function(res) {
        if (res.redirected)  
           window.location.href = res.url;
        else    
            window.location.href='/login'

    })
}