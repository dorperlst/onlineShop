
// function getSubCategories(shopname, categoryname){
//     var ulcategories = document.getElementById("ulcategories");    

//     fetch('/'+shopname+'/cats?parent='+categoryname)
//     .then((res) => { 
//     if(res.status == 200)
//         return res.json() 
//     return null
//     })
//     .then((jsonData) => {   
//         ulcategories.innerHTML = '';
//         for(var data in jsonData.cats)
//         {

//             var name = jsonData.cats[data].name
//             var liinnerHTML =`<li onclick="getSubCategories('${name}','${name}')" >${name}</li> `
//             ulcategories.innerHTML += liinnerHTML


//         }  
//     });
   
// }