const form = document.getElementById("form");
var productDiv = document.getElementById("productsDiv");    
var productFiles = document.getElementById("productFiles");    
var categories = document.getElementById("categories");    
var categoriesDiv = document.getElementById("categoriesDiv");    
var attributes = document.getElementById("attributes");    
 
var shopName='yyyy'
getProducts()
getCats()

function getProducts(){
    form.reset();
    fetch('/products/'+shopName)
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

                productDiv.innerHTML += '<a onclick = deleteProduct("' + jsonData.products[data]._id + '") >Delete</a></br>'
                productDiv.innerHTML += '<a onclick = editProduct("' + jsonData.products[data]._id + '") >Edit</a></br>'+' </div></br></br>'
            }  
        });
}
 
function getCats(){
    fetch(shopName+'/cats')
        .then((res) => { 
        if(res.status == 200)
            return res.json() 
        return null
        })
        .then((jsonData) => {   
            categoriesDiv.innerHTML = '</br></br></br>-----------------categories----------------'
            categories.options.length=0
            categories.clear

            if(!jsonData.cats)
                return
            var opt = document.createElement('option');
            opt.value = 0;
            opt.innerHTML = '--none--'
            categories.appendChild(opt);

            for(var data in jsonData.cats)
            {
                categoriesDiv.innerHTML += '<div> <label>Category Name : '+jsonData.cats[data].name+'</label> </br>'
                categoriesDiv.innerHTML += ' <label>Description   : '+jsonData.cats[data].description+'</label></br>'
                categoriesDiv.innerHTML += '<label>level : '+jsonData.cats[data].level+'</label></br></br></br></br></br>'
                categoriesDiv.innerHTML += '<label>parent : '+jsonData.cats[data].parent+'</label></br></br></br></br></br>'

                // categoriesDiv.innerHTML += '<a onclick = deleteProduct("'+jsonData.cat[data]._id.id+'") >Delete</a></br>'
                // categoriesDiv.innerHTML += '<a onclick = editProduct("'+jsonData.cat[data]._id.id+'") >Edit</a></br>'+' </div></br></br></br></br></br></br>'


                var opt = document.createElement('option');
                opt.value = jsonData.cats[data]._id;
                opt.innerHTML = jsonData.cats[data].name
                categories.appendChild(opt);


            }  
        });
}
 

function addProduct(id){
    form.reset();
}

function editProduct(id){
    form.reset();
    fetch('/product/'+id+'/')
    .then((res) => { 
        if(res.status == 200)
            return res.json() 
        return null
    })
    .then((jsonData) => {
        form.elements['name'].value = jsonData.product.name
        form.elements['price'].value = jsonData.product.price
        form.elements['description'].value = jsonData.product.description
        form.elements['id'].value = jsonData.product._id
        categories.value =  jsonData.product.category
    });
}

function deleteProduct(id){
    var formdata = new FormData();
    fetch('/products/'+id,
        { method: 'delete',body :{}})
    .then(function(res) {   
        getProducts()
        return res; 
    })

 
}

function addAttributes(){
    var li = document.createElement("li");
    li.innerHTML  = '<div> <input type="text" value = "" name="attributename" placeholder="name" required> '
    li.innerHTML  +=  '<input type="text" value = "" name="attributevalue" placeholder="value" required > </br></div>'
    attributes.appendChild(li);
 
}

function addCat(id){
    var formdata = new FormData();
    formdata.append('name',form.elements['name'].value)
    if(categories.value != 0)
        formdata.append('parent', categories.value)
    formdata.append('description', form.elements['description'].value)
    formdata.append('id','')
    var method = "post"
 
    if( productFiles.files.length > 0)
        formdata.append('avatar', productFiles.files[0], productFiles.files[0].name);

    fetch('/cats',
        { method: method, body: formdata})
    .then(function(res) {   
        getCats()
        return res; 
    })
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    var formdata = new FormData();
    formdata.append('name', form.elements['name'].value)
    formdata.append('category', categories.value)
    formdata.append('price', form.elements['price'].value)
    formdata.append('description', form.elements['description'].value)
    formdata.append('id', form.elements['id'].value)
    
    var attributes_array =[]

    for (var i = 0; i < attributes.children.length; i++ ) {
        var attribute = {}

        var att = attributes.children[ i ].getElementsByTagName("input");
        attribute.name = att[0].value
        attribute.description = att[1].value
        attributes_array.push(attribute)
        
    }

    formdata.append( 'attributes', JSON.stringify( attributes_array ) )

    var method = "post"
    if(form.elements['id'].value!='')
        method = "PATCH"
    for (i=0 ; i < productFiles.files.length; i++)
        formdata.append('myFiles', productFiles.files[i], productFiles.files[i].name);

    fetch('/products',
        { method: method, body: formdata})
    .then(function(res) {   
        getProducts()
        return res; 
    })
})