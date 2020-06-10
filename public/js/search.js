
const categories = document.getElementById("categories");   

 
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

