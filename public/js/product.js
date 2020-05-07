var productDiv = document.getElementById("productDiv");    

var ordersDiv = document.getElementById("ordersDiv");    

var shopName = 'yyyy'

var product = {}
getOrders()
function getProduct(id){
   
    fetch('/product/' + shopName +'/'+id)
       .then((res) => { 
       if(res.status == 200)
           return res.json() 
       return null
       })
       .then((jsonData) => {   
            product = jsonData.product
            productDiv.innerHTML = ''
            productDiv.innerHTML += '<div> <label>Product Name : ' + product.name + '</label> </br>'
            productDiv.innerHTML += ' <label>Description : ' + product.description + '</label></br>'
            productDiv.innerHTML += '<label>Price : ' + product.price + '</label></br>'
            productDiv.innerHTML += '<label>tree : ' + product.tree+ '</label></br>'
            productDiv.innerHTML += '<label>category : ' + product.category+ '</label></br>'

            productDiv.innerHTML += '<a onclick = orderProduct() >Add </a></br></br></br></br>'
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
                   ordersDiv.innerHTML += '<label>Product Name : '+ jsonData[ordind].products[prodind].product.name+'</label> </br>'
                   ordersDiv.innerHTML += '<label>price : '+ jsonData[ordind].products[prodind].product.price+'</label> </div> </br>'
                   ordersDiv.innerHTML += '<label>Amount : '+ jsonData[ordind].products[prodind].count+'</label> </div> </br>'

               }  
           }
      });
}



function addCount(delta){
    var counter = document.getElementById('count')
    var count = parseInt(counter.innerHTML)
    if(count + delta > 0)
        counter.innerHTML = count  + delta
      
}

function orderProduct(){
    productOrdersDiv.innerHTML = '<div> <label>Name : '+ product.name+'</label> </br>'
    productOrdersDiv.innerHTML += '<label>Price : '+ product.price+'</label> </br>'
 
    productOrdersDiv.innerHTML += '<input type="button" onclick = "addCount(1)" value="+"></br> ' 
    productOrdersDiv.innerHTML += '<label id="count">1</label> </div> </br>'

    productOrdersDiv.innerHTML += '<input type="button" onclick = "addCount(-1)" value="-"></br> ' 
    productOrdersDiv.innerHTML += '<input type="button" onclick = "addToOrder()" value="Add To Order"></br> ' 


}

function addToOrder(){
   var counter = document.getElementById('count')
   var formdata = new FormData();
   formdata.append("product", product._id)
   formdata.append("count", parseInt(counter.innerHTML))
   formdata.append("shop", shopName)


   fetch('/orders/',
       { method: 'post', body :formdata})
   .then(function(res) {   
       getOrders()
       return res; 
   })


}



