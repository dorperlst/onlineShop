 var productDiv = document.getElementById("productsDiv");    

 var ordersDiv = document.getElementById("ordersDiv");    

 var shopName = 'yyyy'
 
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

getProducts()
getOrders()


function getProducts(){
    
     fetch('/products/' + shopName)
        .then((res) => { 
        if(res.status == 200)
            return res.json() 
        return null
        })
        .then((jsonData) => {   
            productDiv.innerHTML = ''
           
            for(var data in jsonData.products)
            {
                productDiv.innerHTML += '<div> <label>Product Name : ' + jsonData.products[data].name + '</label> </br>'
                productDiv.innerHTML += ' <label>Description : ' + jsonData.products[data].description + '</label></br>'
                productDiv.innerHTML += '<label>Price : ' + jsonData.products[data].price + '</label></br>'
                productDiv.innerHTML += '<label>tree : ' + jsonData.products[data].tree+ '</label></br>'
                productDiv.innerHTML += '<label>category : ' + jsonData.products[data].category+ '</label></br>'

                productDiv.innerHTML += '<a onclick = addToOrder("' + jsonData.products[data]._id + '",+' + jsonData.products[data].price + ') >Add To Order</a></br></br></br></br>'
             }  
        });
}

function getOrders(){
    fetch('/orders')
       .then((res) => { 
       if(res.status == 200)
           return res.json() 
       return null
       })
       .then((jsonData) => {   
        ordersDiv.innerHTML = ''
           for(var ordind in jsonData)
           {
                ordersDiv.innerHTML += '<div> <label>----order-----</label> </br>'

                for(var prodind in jsonData[ordind].products )
                {
                    ordersDiv.innerHTML += '<div> <label>Product Name : '+ jsonData[ordind].products[prodind].product.name+'</label> </br>'
                    ordersDiv.innerHTML += '<div> <label>Product description : '+ jsonData[ordind].products[prodind].product.description+'</label> </br>'
                    ordersDiv.innerHTML += '<div> <label>Product Name : '+ jsonData[ordind].products[ordind].product.price+'</label> </br>'
    
                }  
        }
       });
}


function getOrders(){
    fetch('/orders')
       .then((res) => { 
       if(res.status == 200)
           return res.json() 
       return null
       })
       .then((jsonData) => {   
        ordersDiv.innerHTML = ''
           for(var ordind in jsonData)
           {
                ordersDiv.innerHTML += '<div> <label>----order-----</label> </br>'

                for(var prodind in jsonData[ordind].products )
                {
                    ordersDiv.innerHTML += '<div> <label>Product Name : '+ jsonData[ordind].products[prodind].product.name+'</label> </br>'
                    ordersDiv.innerHTML += '<div> <label>Product description : '+ jsonData[ordind].products[prodind].product.description+'</label> </br>'
                    ordersDiv.innerHTML += '<div> <label>Product price : '+ jsonData[ordind].products[ordind].product.price+'</label> </br>'
    
                }  
        }
       });
}

function addToOrder(id, price){
   
    var formdata = new FormData();
    formdata.append("product", id)
    formdata.append("count", 4)
    formdata.append("shop", shopName)

    formdata.append("orderPrice",price)

    fetch('/orders/',
        { method: 'post', body :formdata})
    .then(function(res) {   
        getOrders()
        return res; 
    })

 
}
 


 