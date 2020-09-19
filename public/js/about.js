var ind=0
var interval= null
var abouts = document.getElementsByClassName("about")

if(abouts.length>0)
{
    abouts[ind].classList.add("about_cur");

    interval = setInterval(function(){ 
        changeImg(1)
    }, 7000);
}
    
 
function next(delta){
    if(interval)
       clearInterval(interval);
    changeImg(delta)
}

function changeImg(step){

    abouts[ind].className ="about"
    ind = (ind + step) % abouts.length
    abouts[ind].classList.add("about_cur"); 
}