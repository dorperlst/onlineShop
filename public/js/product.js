const form = document.getElementById( "form" );

fetch('/products')
    .then((res) => { 
      if(res.status == 200)
        return res.json() 
      return null
    })
    .then((jsonData) => {

        for(var data in jsonData.product){
            {
                var myDiv = document.getElementById("productsDiv");    
           
                myDiv.innerHTML += '<div> <label>Product Name : '+jsonData.product[data].name+'</label> </br>'
                myDiv.innerHTML += ' <label>Description   : '+jsonData.product[data].description+'</label></br>'
                myDiv.innerHTML += '<label>Price : '+jsonData.product[data].price+'</label></br>'
                myDiv.innerHTML += '<a onclick=loadProduct("'+jsonData.product[data]._id+'") >Edit</a></br>'+' </div></br></br>'
            }
        }  
         
    });



function loadProduct(id){
    fetch('/products/'+id+'/')
    .then((res) => { 
      if(res.status == 200)
        return res.json() 
      return null
    })
    .then((jsonData) => {

        for(var data in jsonData.product){
            {
                var myDiv = document.getElementById("productsDiv");    
                form.elements['name'].value=jsonData.product.name
                form.elements['price'].value=jsonData.product.price
                form.elements['description'].value=jsonData.product.description

                // myDiv.innerHTML += '<div> <label>Product Name : '++'</label> </br>'
                // myDiv.innerHTML += ' <label>Description   : '+jsonData.product[data].description+'</label></br>'
                // myDiv.innerHTML += '<label>Price : '+jsonData.product[data].price+'</label></br>'
                // myDiv.innerHTML += '<a onclick=loadProduct("'+jsonData.product[data]._id+'") >Edit</a></br>'+' </div></br></br>'
            }
        }  
         
    });

   



}


form.addEventListener('submit', (e) => {
    e.preventDefault()
    var formdata = new FormData(form);
 
    fetch('/products',
        { method: 'PATCH', body: formdata})
    .then(function(res) { return res; })




    // method: 'PATCH'

})