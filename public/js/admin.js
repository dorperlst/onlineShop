const form = document.getElementById("form");
var productDiv = document.getElementById("productsDiv");    
var productFiles = document.getElementById("productFiles");    
var categories = document.getElementById("categories");    
var categoriesDiv = document.getElementById("categoriesDiv");    
var liattributes = document.getElementById("attributes");    
var litags = document.getElementById("tags"); 
var lidetails = document.getElementById("details"); 

 
var shopName='yyyy'
getProducts()
getCats()

function getProducts(){
    form.reset();
    lidetails.innerHTML = '';
    liattributes.innerHTML = '';

    litags.innerHTML = '';
    fetch('/'+shopName+'/products')
        .then((res) => { 
        if(res.status == 200)
            return res.json() 
        return null
        })
        .then((jsonData) => {   
            productDiv.innerHTML = ''
           
            for(var ind in jsonData.products)
            {
                var product = jsonData.products[ind]
                productDiv.innerHTML += '<div> <label>Product Name : ' + product.name + '</label> </br>'
                productDiv.innerHTML += ' <label>Description : ' + product.description + '</label></br>'
                productDiv.innerHTML += '<label>Price : ' + product.price + '</label></br>'
                productDiv.innerHTML += '<label>tree : ' + product.tree+ '</label></br>'
                productDiv.innerHTML += '<label>category : ' + product.category+ '</label></br>'

                productDiv.innerHTML += '<a onclick = deleteProduct("' + product._id + '") >Delete</a></br>'
                productDiv.innerHTML += '<a onclick = editProduct("' + product._id + '") >Edit</a></br>'+' </div></br></br>'

              

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
                // categoriesDiv.innerHTML += '<a onclick = editProduct("'+jsonData.cats[data]._id+'") >Edit</a></br>'+' </div></br></br></br></br></br></br>'


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
        const product = jsonData.product
        form.elements['productname'].value = product.name
        form.elements['price'].value = product.price
        form.elements['description'].value = product.description
        form.elements['id'].value = product._id
        categories.value =  product.category
        lidetails.innerHTML = '';
        liattributes.innerHTML = '';

        litags.innerHTML = '';

        for(var ind in product.attributes)
            addAttributes(product.attributes[ind].name,product.attributes[ind].value);
     
        for(var ind in product.details)
            addDetails(product.details[ind].name, product.details[ind].value);
        for(var ind in product.tags)
            litags.appendChild( createListItem(product.tags[ind].name));
        
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

function addAttributes(name='', value=''){
    
    liattributes.appendChild( createListItem(name,value));
}
function addDetails(name = '', value = ''){
    lidetails.appendChild( createListItem(name,value));
}
function addTags(name = ''){
    litags.appendChild( createListItem(name));
}

function createListItem(name, value){
    var li = document.createElement("li");
    li.innerHTML  = '<div> <input type="text" value = "'+name+'" placeholder="name" required> '
    if(value != undefined)
        li.innerHTML  +=  '<input type="text" value = "'+value+'"  placeholder="value" required >'
        

    li.innerHTML += '<a href="#" onclick="removeli(parentNode)">remove</a>'

    li.innerHTML  += ' </br></div>'
    return li
 
}
function removeli(parentNode){
     
    parentNode.parentNode.removeChild(parentNode)
    window.setTimeout(function () { 
        document.getElementById('productname').focus(); 
    }, 0);
  
}
function addCat(id){
    var formdata = new FormData();
    formdata.append('name',form.elements['productname'].value)
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
    formdata.append('name', form.elements['productname'].value)
    formdata.append('category', categories.value)
    formdata.append('price', form.elements['price'].value)
    formdata.append('description', form.elements['description'].value)
    formdata.append('id', form.elements['id'].value)
    
    var attributes_array =[]

    for (var i = 0; i < liattributes.children.length; i++ ) {
        var attribute = {}

        var att = attributes.children[ i ].getElementsByTagName("input");
        attribute.name = att[0].value
        attribute.value = att[1].value
        attributes_array.push(attribute)
        
    }
    var details_array =[]

    for (var i = 0; i < lidetails.children.length; i++ ) {
        var details= {}

        var detailinput = lidetails.children[ i ].getElementsByTagName("input");
        details.name = detailinput[0].value
        details.value = detailinput[1].value
        details_array.push(details)
        
    }
    var tags_array =[]

    for (var i = 0; i < litags.children.length; i++ ) {
        var tags = {}
        tags.name = litags.children[ i ].getElementsByTagName("input")[0].value
        tags_array.push(tags)
        
    }

    formdata.append( 'attributes', JSON.stringify( attributes_array ) )
    formdata.append( 'tags', JSON.stringify( tags_array ) )
    formdata.append( 'details', JSON.stringify( details_array ) )

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