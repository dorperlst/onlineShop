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

                productDiv.innerHTML += '<a href = product/' + jsonData.products[data]._id + '  >Details...</a></br></br></br></br>'
             }  
        });
}

 

 


 