
const categories = document.getElementById("search");    
var shopName=''

function init(shop, username){
    shopName = shop

    if(username == undefined ||  username == "")
        username='Guest'
        
    var liSign = document.getElementById("liSign")
    var liUser = document.getElementById("liUser")
    liUser.innerHTML  = '<a>Hello ' + username +'</a>'

    if(username == "Guest")
    {
        

        liSign.innerHTML  = '<a href="/login">Login</a> '

    }
    else  
    {
        liSign.innerHTML  = '<a onclick="logout()">Logout</a> '
       // liSign.innerHTML  += '<li><a onclick="logoutAll()">Logout All</a></li>'
    }
 
    getCats()

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
function getCats(){
    fetch('/'+shopName+'/cats')
        .then((res) => { 
        if(res.status == 200)
            return res.json() 
        return null
        })
        .then((jsonData) => {   
             
            categories.options.length=0
            categories.clear
            var opt = document.createElement('option');
            opt.value = 0;
            opt.innerHTML = '--all--'
            categories.appendChild(opt);

            for(var data in jsonData.cats)
            {
                var opt = document.createElement('option');
                opt.value = jsonData.cats[data]._id;
                opt.innerHTML = jsonData.cats[data].name
                categories.appendChild(opt);
            }  
        });
}