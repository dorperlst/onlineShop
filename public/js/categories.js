 

//  function subCategories( categoryname, parentName){
//     var parent= parentName === undefined ? "" : parentName
//     var ulcategories = document.getElementById("ulcategories");  
//     var innerHTML=  ''  
//     var url = '/'+shopName+'/cats'
//     if(categoryname && categoryname!='')
//     {
//         url +='?parent='+ categoryname
//       //  innerHTML += '<li><a onclick = backCategory()>..Back</a> <h3>'+categoryname+' </h3></li>'
//         innerHTML += '<li class="even"><div class="back"><input onclick = subCategories("'+parent+'") type="button"  class="back-btn" ><h3>'+categoryname+' </h3> </div> </li>'
//     }
//     else 
//     {
//         url +='?mainCategories=true'
//     }

//     ulcategories.innerHTML = innerHTML
  
//     fetch( url )
//     .then((res) => { 
//     if(res.status == 200)
//         return res.json() 
//     return null
//     })
//     .then((jsonData) => {   
//         var line='odd' 
//         for(var data in jsonData.cats)
//         {
//             var name = jsonData.cats[data].name
//             var parent= jsonData.cats[data].parent === undefined ? "" : jsonData.cats[data].parent
//             var liinnerHTML =`<li class=${line} >  <a onclick="subCategories('${name}','${parent}')" >${name}</a>  </li> `

           
//             ulcategories.innerHTML += liinnerHTML
//             line =line=='odd'? 'even' :'odd'  
//         } 
//         getProducts(categoryname) 
//     });
// }




// function getProducts(categoryname){
//    var secProducts = document.getElementById("secProducts");    

//    var url ='/'+shopName+'/products'
//    if(categoryname)
//        url +='?category=' + categoryname
//    fetch(url)
//        .then((res) => { 
//        if(res.status == 200)
//            return res.json() 
//        return null
//        })
//        .then((jsonData) => {   
//         secProducts.innerHTML = ''
          
//            for(var ind in jsonData.products)
//            {
//                var product = jsonData.products[ind]




//                var innerHTML ='<div class="product-card"> <div class="product-image"> ' 
//                if ( product.images[0]) 
//                    innerHTML+='  <img alt="" border="0"  src="../../uploads/'+ product.images[0]+'"></img>"></img> '
//                else  
//                    innerHTML+='<img  class="" src="../../images/default.jpeg"></img>'
//                innerHTML += ' </div><div class="product-info">'
//                innerHTML+='  <label> '+product.name+'</label>'
//                 innerHTML+='  <label> '+product.price +'</label>'
//                innerHTML += ' <a href=/'+shopName+'/view/' + product._id + ' >details... </a></div></div>'
//                secProducts.innerHTML += innerHTML
                        
//            }
//        });
// }





// // function subCategories(shopName, categoryname){
// //     var ulcategories = document.getElementById("ulcategories");    

// //     fetch('/'+shopName+'/cats?parent='+categoryname)
// //     .then((res) => { 
// //     if(res.status == 200)
// //         return res.json() 
// //     return null
// //     })
// //     .then((jsonData) => {   
// //         ulcategories.innerHTML = '';
// //         for(var data in jsonData.cats)
// //         {

// //             var name = jsonData.cats[data].name
// //             var liinnerHTML =`<li onclick="subCategories('${name}','${name}')" >${name}</li> `
// //             ulcategories.innerHTML += liinnerHTML


// //         }  
// //     });
   
// // }