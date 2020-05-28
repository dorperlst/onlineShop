
function getSubCategories(shopname, categoryname){
    var ulcategories = document.getElementById("ulcategories");    

    fetch('/'+shopname+'/cats?parent='+categoryname)
    .then((res) => { 
    if(res.status == 200)
        return res.json() 
    return null
    })
    .then((jsonData) => {   
        ulcategories.innerHTML = '';
        for(var data in jsonData.cats)
        {
            ulcategories.innerHTML += "<li onclick=getSubCategories('"+ shopname +"','"+jsonData.cats[data].name+"')>"+jsonData.cats[data].name+"</li>"
             
         }  
    });
   
}