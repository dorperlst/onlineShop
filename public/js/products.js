 var productDiv = document.getElementById("productsDiv");    

 var ordersDiv = document.getElementById("ordersDiv");    
 var tree = []
 function backCategory(shopname){
     tree.pop()
     var name ='',id=''
     if(tree.length >0)
     {
         var prevCategory = tree.pop()
         getSubCategories(shopname, prevCategory.name)
 
     }
     else
     getSubCategories(shopname, null)
 
 }
 
 function getSubCategories(shopname, categoryname){
    var ulcategories = document.getElementById("ulcategories");  
    var innerHTML=  ''  
    var url = '/'+shopname+'/cats'
    if(categoryname)
    {
        url +='?parent='+ categoryname
        innerHTML += '<li><a onclick = backCategory("'+shopname+'")>..Back</a> <h3>'+categoryname+' </h3></li>'
    }
    ulcategories.innerHTML = innerHTML
  
    fetch( url )
    .then((res) => { 
    if(res.status == 200)
        return res.json() 
    return null
    })
    .then((jsonData) => {   
        for(var data in jsonData.cats)
        {

            var name = jsonData.cats[data].name
            var liinnerHTML =`<li onclick="getSubCategories('${shopname}','${name}')" >${name}</li> `
            ulcategories.innerHTML += liinnerHTML
        } 
        getProducts(categoryname) 
    });
}


function getProducts(categoryname){
    
    var url ='/'+shopName+'/products'
    if(categoryname)
        url +='?category=' + categoryname
    fetch(url)
        .then((res) => { 
        if(res.status == 200)
            return res.json() 
        return null
        })
        .then((jsonData) => {   
            productDiv.innerHTML = ''
           
            for(var ind in jsonData.products)
            {
                var product = jsonData.products[ind]
                var innerHTML ='<div class ="box zone "> '
                if ( product.images[0]) 
                    innerHTML+='<img  class="" src="../../uploads/'+ product.images[0]+'"></img> '
                else  
                    innerHTML+='<img  class="" src="../../uploads/default.jpeg"></img>'
                
                innerHTML+='  <p> '+product.name+'</p>'
                innerHTML+='  <p> '+product.description+'</p>'
                innerHTML+='  <p> '+product.price +'</p>'
                innerHTML += ' <a href=/'+shopName+'/view/' + product._id + ' >details... </a>'
               
                
                
                productDiv.innerHTML += innerHTML
                         
            }
        });
}
 
// function activityWatcher(){

//     //The number of seconds that have passed
//     //since the user was active.
//     var secondsSinceLastActivity = 0;

//     //Five minutes. 60 x 5 = 300 seconds.
//     var maxInactivity = (60 * 5);

//     //Setup the setInterval method to run
//     //every second. 1000 milliseconds = 1 second.
//     setInterval(function(){
//         secondsSinceLastActivity++;
//         console.log(secondsSinceLastActivity + ' seconds since the user was last active');
//         //if the user has been inactive or idle for longer
//         //then the seconds specified in maxInactivity
//         if(secondsSinceLastActivity > maxInactivity){
//             console.log('User has been inactive for more than ' + maxInactivity + ' seconds');
//             //Redirect them to your logout.php page.
//             location.href = '/logout';
//         }
//     }, 1000);

//     //The function that will be called whenever a user is active
//     function activity(){
//         //reset the secondsSinceLastActivity variable
//         //back to 0
//         secondsSinceLastActivity = 0;
//     }

//     //An array of DOM events that should be interpreted as
//     //user activity.
//     var activityEvents = [
//         'mousedown', 'mousemove', 'keydown',
//         'scroll', 'touchstart'
//     ];

//     //add these events to the document.
//     //register the activity function as the listener parameter.
//     activityEvents.forEach(function(eventName) {
//         document.addEventListener(eventName, activity, true);
//     });


// }

//activityWatcher();

//  getProducts()
 
//  var t="{{sproducts}}"
//  alert(t)


// console.log(rrr)
// function getProducts(shopName){

  

//     // fetch('/'+shopName+'/products' )
//     //     .then((res) => { 
//     //     if(res.status == 200)
//     //         return res.json() 
//     //     return null
//     //     })
//     //     .then((jsonData) => {   
//     //         productDiv.innerHTML = ''
//     //         for(i=0;i< jsonData.products.length;i++)
//     //         {
//     //             var product = jsonData.products[i]
//     //             var innerhtml = ''
    
//     //            //'<div class="container zone red">'
                
//     //            //
//     //             //productDiv.innerHTML += '<label>tree : ' + product.tree+ '</label>'
//     //             // productDiv.innerHTML += '<label>category : ' + product.category+ '</label>'
//     //             var img ='default.jpeg'
//     //             if(product.images.length > 0)
//     //                 img = product.images[0]
    
  
//     //            // innerhtml += '<div class ="item"> <img  class="image" src="../../uploads/'+img+'"></img> </div>' 
//     //             innerhtml += '<div class ="box zone "> <img  class="image" src="../../uploads/'+img+'">'
//     //             innerhtml += '<div class ="product"> <span>' + product.name + '</span> </div>'

//     //             innerhtml += '<div class ="product"> <span>' + product.description + '</span> </div>'
                
//     //             innerhtml += '<div class ="product"><span> ' + product.price + '$</span>  <a href = view/' + product._id + 
//     //                 ' >details...</a></div> </div>'

//     //             // innerhtml+=' '
//     //             // innerhtml += ' </div>'
//     //             productDiv.innerHTML += innerhtml


//     //          }  
//         // });
// }

 

 


 