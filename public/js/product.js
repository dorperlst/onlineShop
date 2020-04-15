const form = document.getElementById("form");
var productDiv = document.getElementById("productsDiv");    
var productFiles = document.getElementById("productFiles");    





getProducts()

function getProducts(){
    form.reset();
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
                productDiv.innerHTML += '<a onclick = editProduct("'+jsonData.product[data]._id+'") >Edit</a></br>'+' </div></br></br>'
            }  
        });
}

function editProduct(id){
    fetch('/products/'+id+'/')
    .then((res) => { 
      if(res.status == 200)
        return res.json() 
      return null
    })
    .then((jsonData) => {

        for(var data in jsonData.product){
            {
                form.elements['name'].value = jsonData.product.name
                form.elements['price'].value = jsonData.product.price
                form.elements['description'].value = jsonData.product.description
                form.elements['id'].value = jsonData.product._id

            }
        }  
         
    });
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    var formdata = new FormData();
    formdata.append('name',form.elements['name'].value)
    formdata.append('price',form.elements['price'].value)

    formdata.append('description',form.elements['description'].value)
    formdata.append('id',form.elements['id'].value)

    for (i=0 ;i<productFiles.files.length;i++)
        formdata.append('myFiles', productFiles.files[i], productFiles.files[i].name);

        fetch('/products',
        { method: 'post', body: formdata})
    .then(function(res) {   
        getProducts()
        return res; })

})