var productDiv = document.getElementById("productDiv");    

var ordersDiv = document.getElementById("ordersDiv");    

const mainImg= document.getElementById("mainImg")
const attributeValue= document.getElementById("attValue")

 


function addCount(delta){
    var counter = document.getElementById('count')
    var count = parseInt(counter.innerHTML)
    if(count + delta > 0)
        counter.innerHTML = count  + delta
      
}
function changeImg(img, value ){
    if(value)
       attributeValue.innerHTML = value;
    mainImg.src = "../../uploads/"+img;  
}


 
function addToOrder(id){
   var counter = document.getElementById('count')
   var formdata = new FormData();
   formdata.append("product", id)
   formdata.append("count", parseInt(counter.innerHTML))
   formdata.append("shop", shopName)


   fetch('/orders/',
       { method: 'post', body :formdata})
   .then(function(res) {  
       
    if(res.status == 200)
        return res.json() 
    return null
   }).then((jsonData) => {   
    var cart_details = document.getElementById("cart_details"); 
    cart_details.innerHTML= jsonData.totalItems + " items <br>  <span class=border_cart></span> Total: <span class=price>"+jsonData.total+"$</span> </div>"
   });



}

 