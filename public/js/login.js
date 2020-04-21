const form = document.getElementById("form");
//addshop("5e9f216829efa7242bd514c4")
form.addEventListener('submit', (e) => {
    e.preventDefault()
    var formdata = new FormData(form);
 
    fetch('/users/login',//
        { method: 'POST', body: formdata})
    .then(function(res) {
        if (res.redirected)  
            window.location.href = res.url;
        else
            document.getElementById("err").textContent="Unable to login"
    })

})


function addshop(id){
    var formdata = new FormData();
   formdata.append('name',form.elements['name'].value)
   formdata.append('admin',id)
   var method = "post"
   for (i=0 ; i < productFiles.files.length; i++)
   formdata.append('myFiles', productFiles.files[i], productFiles.files[i].name);


   if( productFiles.files.length > 0)
       formdata.append('avatar', productFiles.files[0], productFiles.files[0].name);

   fetch('/shops',
       { method: method, body: formdata})
   .then(function(res) {   
        return res; 
   })
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
//             location.href = 'logout.php';
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

// activityWatcher();