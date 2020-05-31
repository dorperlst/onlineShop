
// document.body.style.height = screen.height+'px'
const form = document.getElementById("contact");
var productDiv = document.getElementById("productsDiv");    
var productFiles = document.getElementById("productFiles");    
var formcategories = document.getElementById("formcategories");    
var categoriesDiv = document.getElementById("categoriesDiv");    
var ulattributes = document.getElementById("attributes");    
var ultags = document.getElementById("tags"); 
var ulimages = document.getElementById("images"); 
var uldetails = document.getElementById("details"); 
 
 

function getProducts(){
    form.reset();
    uldetails.innerHTML = '';
    ulattributes.innerHTML = '';

    ulimages.innerHTML = '';

    ultags.innerHTML = '';
    fileDiv.innerHTML = '';



    var shopName=document.getElementById("shopname").value;

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
                var innerHTML ='<div class ="box zone "> '
                if ( product.images[0]) 
                    innerHTML+='<img  class="" src="../../uploads/'+ product.images[0]+'"></img> '
                else  
                    innerHTML+='<img  class="" src="../../uploads/default.jpeg"></img>'
                
                innerHTML+='  <p> '+product.name+'</p>'
                innerHTML+='  <p> '+product.description+'</p>'
                innerHTML+='  <p> '+product.price +'</p>'
                innerHTML += '<a onclick = deleteProduct("' + product._id + '") >Delete</a>'
                innerHTML += '<a onclick = editProduct("' + product._id + '") >Edit</a>'+' </div> '
                productDiv.innerHTML += innerHTML
                         
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
            categoriesDiv.innerHTML = '-----------------categories----------------'
            formcategories.options.length=0
            formcategories.clear

            if(!jsonData.cats)
                return
            var opt = document.createElement('option');
            opt.value = 0;
            opt.innerHTML = '--none--'
            formcategories.appendChild(opt);

            for(var data in jsonData.cats)
            {
                categoriesDiv.innerHTML += '<div> <label>Category Name : '+jsonData.cats[data].name+'</label> '
                categoriesDiv.innerHTML += ' <label>Description   : '+jsonData.cats[data].description+'</label>'
                categoriesDiv.innerHTML += '<label>level : '+jsonData.cats[data].level+'</label>'
                categoriesDiv.innerHTML += '<label>parent : '+jsonData.cats[data].parent+'</label>'

                // categoriesDiv.innerHTML += '<a onclick = deleteProduct("'+jsonData.cat[data]._id.id+'") >Delete</a>'
                // categoriesDiv.innerHTML += '<a onclick = editProduct("'+jsonData.cats[data]._id+'") >Edit</a>'+' </div>'


                var opt = document.createElement('option');
                opt.value = jsonData.cats[data]._id;
                opt.innerHTML = jsonData.cats[data].name
                formcategories.appendChild(opt);


            }  
        });
}
 

function addProduct(id){
    form.reset();
}

function editProduct(id){
    var popup = document.getElementById("popup");    
    
    productDiv.style.display="none"

    popup.style.display="block"
    
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
        formcategories.value =  product.category
        uldetails.innerHTML = '';
        ulattributes.innerHTML = '';

        ultags.innerHTML = '';

        for(var ind in product.attributes)
            addAttributes(product.attributes[ind].name,product.attributes[ind].value);
     
        for(var ind in product.details)
            addDetails(product.details[ind].name, product.details[ind].value);
        for(var ind in product.tags)
            ultags.appendChild( createListItem(product.tags[ind].name));
        
        for(var ind in product.images)
            ulimages.appendChild( createListItem(product.images[ind]));
        
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
    
    ulattributes.appendChild( createListItem(name,value));
}
function addDetails(name = '', value = ''){
    uldetails.appendChild( createListItem(name,value));
}
function addTags(name = ''){
    ultags.appendChild( createListItem(name));
}

function createListItem(name, value){
    var li = document.createElement("li");
    var innerHTML  = '<div> <input type="text" value = "'+name+'" placeholder="name" required> '
    if(value != undefined)
        innerHTML  +=  '<input type="text" value = "'+value+'"  placeholder="value" required >'

    innerHTML += '<a href="#" onclick="removeli(parentNode)">remove</a>'
    innerHTML  += ' </div>'
    li.innerHTML= innerHTML
    return li
 
}
function removeli(parentNode){
     
    parentNode.parentNode.parentNode.removeChild(parentNode.parentNode)
    window.setTimeout(function () { 
        document.getElementById('productname').focus(); 
    }, 0);
  
}
function addCat(id){
    var formdata = new FormData();
    formdata.append('name',form.elements['productname'].value)
    if(formcategories.value != 0)
        formdata.append('parent', formcategories.value)
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
    formdata.append('category', formcategories.value)
    formdata.append('price', form.elements['price'].value)
    formdata.append('description', form.elements['description'].value)
    formdata.append('id', form.elements['id'].value)
    
    var attributes_array =[]

    for (var i = 0; i < ulattributes.children.length; i++ ) {
        var attribute = {}

        var att = attributes.children[ i ].getElementsByTagName("input");
        attribute.name = att[0].value
        attribute.value = att[1].value
        attributes_array.push(attribute)
        
    }
    var details_array =[]

    for (var i = 0; i < uldetails.children.length; i++ ) {
        var details= {}

        var detailinput = uldetails.children[ i ].getElementsByTagName("input");
        details.name = detailinput[0].value
        details.value = detailinput[1].value
        details_array.push(details)
        
    }
    var tags_array =[]

    for (var i = 0; i < ultags.children.length; i++ ) {
        var tags = {}
        tags.name = ultags.children[ i ].getElementsByTagName("input")[0].value
        tags_array.push(tags)
        
    }

    formdata.append( 'attributes', JSON.stringify( attributes_array ) )
    formdata.append( 'tags', JSON.stringify( tags_array ) )
    formdata.append( 'details', JSON.stringify( details_array ) )

    var method = "post"
    if(form.elements['id'].value!='')
        method = "PATCH"


        
    var images_array =[]
    for (i=0 ; i < ulimages.children.length; i++)
    {
        const imgName=ulimages.children[ i ].getElementsByTagName("input")[0].value
        var img = {imgName}
      
        images_array.push(img)
    }
    //images_array.push(ulimages.children[ i ].getElementsByTagName("input")[0].value)
    // if (images_array.length > 0)
    //     formdata.append( 'images',  images_array  )
    //     if (images_array.length > 0)
        formdata.append( 'imagesjson', JSON.stringify(images_array ) )

    for (i=0 ; i < productFiles.files.length; i++)
        formdata.append('myFiles', productFiles.files[i], productFiles.files[i].name);

    fetch('/products',
        { method: method, body: formdata})
    .then(function(res) {   
        getProducts()
        return res; 
    })
})
function readURL(input) {
    if (input.files && input.files[0]) {

        console.log(input.files[0])

        var fileReader = new FileReader();
            fileReader.onload = function(fileLoadedEvent) 
            {
                var imageLoaded = document.createElement("img");
                imageLoaded.src = fileLoadedEvent.target.result;
                document.getElementById("fileDiv").appendChild(imageLoaded);
            };
            fileReader.readAsDataURL(fileToLoad);


    }
}

function loadImageFileAsURL()
{
    for (i =0; i < productFiles.files.length; i++)
    {

        var fileToLoad = productFiles.files[i];

        if (fileToLoad.type.match("image.*"))
        {
            var fileReader = new FileReader();
            fileReader.onload = function(fileLoadedEvent) 
            {
                var imageLoaded = document.createElement("img");
                imageLoaded.src = fileLoadedEvent.target.result;
                document.getElementById("fileDiv").appendChild(imageLoaded);
            };
            fileReader.readAsDataURL(fileToLoad);
        }
    }
     
        
   
}