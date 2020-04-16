 var productDiv = document.getElementById("productsDiv");    
 
var token = ""



getProducts()

function getProducts(){
     fetch('/products')
        .then((res) => { 
        if(res.status == 200)
            return res.json() 
        return null
        })
        .then((jsonData) => {   
            productDiv.innerHTML = ''
           
            for(var data in jsonData.product)
            {
                productDiv.innerHTML += '<div> <label>Product Name : '+jsonData.product[data].name+'</label> </br>'
                productDiv.innerHTML += ' <label>Description   : '+jsonData.product[data].description+'</label></br>'
                productDiv.innerHTML += '<label>Price : '+jsonData.product[data].price+'</label></br>'
                productDiv.innerHTML += '<a onclick = addToOrder("'+jsonData.product[data]._id+'") >Add</a></br>'+' </div></br></br>'

             }  
        });
}



function addToOrder(id){
   
   
    var formdata = new FormData();
    formdata.append("product",id)
    fetch('/orders/',
        { method: 'post', body :formdata})
    .then(function(res) {   
        return res; 
    })

 
}
 


 