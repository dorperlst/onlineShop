  
        
       
       
function init(username){
    if(username == undefined ||  username == "")
        return

    var userDiv = document.getElementById("userDiv")
    userDiv.innerHTML  = '<p>Hello' + username +'</p>'

    if(username == "Guest")
        userDiv.innerHTML  += ' <a href="/login">Login</a> '
    else  
    {
        userDiv.innerHTML  += '<a onclick="logout()">Logout</a>'
        userDiv.innerHTML  += '<a onclick="logoutAll()">Logout All</a>'
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