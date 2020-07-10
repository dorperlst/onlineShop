  

 
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