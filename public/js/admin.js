
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
const popup = document.getElementById("popup");    
var formAction='' 
function closePopUp(){
 
    resetForm()
    popup.style.display="none"
    productDiv.style.display="grid"

}

function resetForm(){
    form.reset();
    uldetails.innerHTML = '';
    ulattributes.innerHTML = '';
    ulimages.innerHTML = '';
    ultags.innerHTML = '';
    fileDiv.innerHTML = '';
    if(formcategories.length >0 && formcategories[0].value == 0)
        formcategories.remove(0)
    
}

function getProducts(currentCategory){
    resetForm()
    var url ='/'+shopName+'/products'
    if(currentCategory)
        url +='?category=' + currentCategory
    fetch(url)
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
 
 

function addProduct(){
    formAction = "products"
    resetForm()
    var productElements=document.getElementsByClassName("product")
    // for(i=0;i< productElements.length;i++)
    //     productElements[i].style.display="block"
    productDiv.style.display="none"
    popup.style.display="grid"
    form.elements['id'].value =''

}

function editProduct(id){
    formAction = "products"
    productDiv.style.display="none"
    popup.style.display="grid"
    resetForm()

    fetch('/product/'+id+'/')
    .then((res) => { 
        if(res.status == 200)
            return res.json() 
        return null
    })
    .then((jsonData) => {
        const product = jsonData.product
        form.elements['formname'].value = product.name
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

function deleteCategory(id){
    fetch('/cats/'+id,
        { method: "delete"})
    .then((res) => { 
        if(res.status == 200)
            return res.json() 
        return null
    })
    .then((jsonData) => {
        tree = []
        subCategories(shopname.value, null, null)
    });
}

function editCategory(id){
    formAction = "cats"
    productDiv.style.display="none"
    popup.style.display="grid"
    resetForm()
    var productElements=document.getElementsByClassName("product")
    for(i=0;i< productElements.length;i++)
        productElements[i].style.display="none"
        
    formcategories.innerHTML = '<option value=0>none</option>'+ formcategories.innerHTML

    fetch('/'+shopName+'/cats/'+id)
    .then((res) => { 
        if(res.status == 200)
            return res.json() 
        return null
    })
    .then((jsonData) => {
        const category = jsonData.cat
        form.elements['formname'].value = category.name
        form.elements['description'].value = category.description
        form.elements['id'].value = category._id
        var catname = !category.parent?"none": category.parent
        formcategories.selectedIndex =  [...formcategories.options].findIndex(option => option.text ===  catname)  
         
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
        document.getElementById('formname').focus(); 
    }, 0);
  
}
function addCategory(id){
    resetForm()
    formAction = "cats"
    productDiv.style.display="none"
    popup.style.display="grid"
    form.elements['id'].value =''
    formcategories.innerHTML = '<option value=0>none</option>'+ formcategories.innerHTML

    var productElements=document.getElementsByClassName("product")
    for(i=0;i< productElements.length;i++)
        productElements[i].style.display="none"

}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    var method ="post"
    
    var formdata = new FormData();
    if(form.elements['id'].value != '')
    {
        formdata.append('id', form.elements['id'].value)
        method= "PATCH"
    }

    formdata.append('name', form.elements['formname'].value)
    formdata.append('description', form.elements['description'].value)
    formdata.append('category', formcategories[formcategories.selectedIndex].value)
    var images_array =[]
    for (i=0 ; i < ulimages.children.length; i++)
    {
        const imgName=ulimages.children[ i ].getElementsByTagName("input")[0].value
        var img = {imgName}
        images_array.push(img)
    }
    formdata.append( 'imagesjson', JSON.stringify(images_array ) )

    if(formAction === 'products'){
 
        formdata.append('price', form.elements['price'].value)
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

        for (i=0 ; i < productFiles.files.length; i++)
        formdata.append('myFiles', productFiles.files[i], productFiles.files[i].name);

    }
    else
    {
        if(productFiles.files.length>0)
            formdata.append('avatar', productFiles.files[0], productFiles.files[0].name);

    }
    fetch('/' + formAction,
        { method: method, body: formdata})
    .then(function(res) {   
        
        if(formAction === 'products')
            getProducts()
        else
        {
            tree = []
            subCategories(shopname.value, null, null)
        }
        closePopUp()
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
var tree = []
function backCategory(shopname){
    tree.pop()
    var name ='',id=''
    if(tree.length >0)
    {
        var prevCategory = tree.pop()
        subCategories(shopname, prevCategory.name, prevCategory.id)

    }
    else
        subCategories(shopname, null, null)

}

function getSubCategories(shopname, categoryname, id){
    tree.push({id:id,name:categoryname})
    subCategories(shopname, categoryname, id)
}

function subCategories(shopname, categoryname, id){
    var ulcategories = document.getElementById("ulcategories"); 
    var innerHTML=  ''
    var url = '/'+shopname+'/cats'
    if(categoryname)
    {
        url +='?parent='+ categoryname
        innerHTML += '<li><a onclick = backCategory("'+shopname+'")>..Back</a> <h3>'+categoryname+' </h3><a onclick= editCategory("'+ id +'")>Edit</a>  <a onclick= deleteCategory("'+id +'")>Delete</a></li></li>'
    }
    else 
        formcategories.innerHTML=''
    ulcategories.innerHTML = innerHTML
  
    fetch( url )
    .then((res) => { 
        if(res.status == 200)
            return res.json() 
        return null
    })
    .then((jsonData) => {   
        //

        for(var data in jsonData.cats)
        {
            if(!categoryname)
            { 
               var opt = document.createElement('option');
                opt.value = jsonData.cats[data]._id;
                opt.innerHTML = jsonData.cats[data].name
                formcategories.appendChild(opt); 
            }
            

            var name = jsonData.cats[data].name
            var liinnerHTML =`<li onclick="getSubCategories('${shopname}','${name}','${jsonData.cats[data]._id}')" >${name}</li> `
            ulcategories.innerHTML += liinnerHTML

         }  
    });
   
    getProducts(categoryname)
   
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
        
