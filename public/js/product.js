const mainImg= document.getElementById("mainImg")
const attributeValue= document.getElementById("attValue")
 
function changeImg(img, value ){
    if(value)
       attributeValue.innerHTML = value;
    mainImg.src = img;  //"../../uploads/"+
}
 
function addToOrder(id){
    if(username == "Guest")
    {
        document.getElementById("email").focus();
        const msg =  document.getElementById("login_msg");
        msg.style="color:red";
        msg.innerHTML="Please Login...";
    }

    var counter = document.getElementById('count')
    if(counter.value=="")
        return;
    var formdata = new FormData();
    formdata.append("product", id)
    formdata.append("count", parseInt(counter.value))
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
    document.getElementById("msg").innerHTML="Item Added to cart"
    });



}

 