var productDiv = document.getElementById("productDiv");    

var ordersDiv = document.getElementById("ordersDiv");    

const mainImg= document.getElementById("mainImg")
const attributeValue= document.getElementById("attValue")



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
               ordersDiv.innerHTML += '<div> <label>----order-----</label> </br></br></br>'

               for(var prodind in jsonData[ordind].products )
               {
                   ordersDiv.innerHTML += '<label>Product Name : '+ jsonData[ordind].products[prodind].product.name+'</label> </br>'
                   ordersDiv.innerHTML += '<label>price : '+ jsonData[ordind].products[prodind].product.price+'</label> </div> </br>'
                   ordersDiv.innerHTML += '<label>Amount : '+ jsonData[ordind].products[prodind].count+'</label> </div> </br></br></br></br>'

               }  
           }

           ordersDiv.innerHTML += '</br></br></br></br></br>'

      });
}



function addCount(delta){
    var counter = document.getElementById('count')
    var count = parseInt(counter.innerHTML)
    if(count + delta > 0)
        counter.innerHTML = count  + delta
      
}
function changeImg(img, value ){
    if(value)
       attributeValue.innerHTML = value;
    mainImg.src = "../../uploads/"+img;    }


function orderProduct(name, id, price ){
    productOrdersDiv.innerHTML = '<div> <label>Name : '+ name+'</label> </br>'
    productOrdersDiv.innerHTML += '<label>Price : '+ price+'</label> </br>'
 
    productOrdersDiv.innerHTML += '<input type="button" onclick = "addCount(1)" value="+"></br> ' 
    productOrdersDiv.innerHTML += '<label id="count">1</label> </div> </br>'

    productOrdersDiv.innerHTML += '<input type="button" onclick = "addCount(-1)" value="-"></br> ' 
    productOrdersDiv.innerHTML += '<input type="button" onclick = addToOrder("'+id+'") value="Add To Order"></br> ' 


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
       getOrders()
       return res; 
   })


}

 