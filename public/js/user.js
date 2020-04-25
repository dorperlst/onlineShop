function logout(){
    
    fetch('users/logout',
        { method: 'POST', body: {}})
    .then(function(res) {
        if (res.redirected)  
            window.location.href = res.url;
    })
}

function logoutAll(){
   alert('ff')
   fetch('users/logoutAll',
       { method: 'POST', body: {}})
   .then(function(res) {
       if (res.redirected)  
           window.location.href = res.url;

    })
}