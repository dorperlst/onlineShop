
// document.body.style.height = screen.height+'px'
const form = document.getElementById("contact");
var productDiv = document.getElementById("productsDiv");    
var productFiles = document.getElementById("productFiles");    
var formcategories = document.getElementById("formcategories");    
var categoriesDiv = document.getElementById("categoriesDiv");    
var ulAttributes = document.getElementById("attributes");    
var ulImgAttributes = document.getElementById("imgAttributes");    

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
    ulAttributes.innerHTML = '';
    ulImgAttributes.innerHTML = '';

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
                
                innerHTML+='<p>'+product.name+'</p>'
                innerHTML+='<p>'+product.description+'</p>'
                innerHTML+='<p>'+product.price +'</p>'
                innerHTML += '<a onclick=editProduct("'+ product._id +'")>Edit </a>'
                innerHTML += '<a onclick="deleteProduct("' + product._id + '")">Delete</a>'+' </div> '
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
    productDiv.style.display = "none"
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
        formcategories.selectedIndex =  [...formcategories.options].findIndex(option => option.text ===  product.category)  

        uldetails.innerHTML = '';
        ulAttributes.innerHTML = '';
        ulImgAttributes.innerHTML = '';

        ultags.innerHTML = '';

        for(var ind in product.attributes)
        {
            var attribute =product.attributes[ind];
            addAttributes(attribute.name, attribute.values)
        }

        for(var ind in product.imgattributes)
        {
            var imgAttribute = product.imgattributes[ind];
            addImgAttributes(imgAttribute.name, imgAttribute.values)
        }
     
        for(var ind in product.details)
        uldetails.appendChild( createListItem(product.details[ind]));

        for(var ind in product.tags)
            ultags.appendChild( createListItem(product.tags[ind]));
        imagesDiv.innerHTML=''

        for(var ind in product.images)
        { 
            ulimages.appendChild( createListItem(product.images[ind], product.images[ind]));
            // imagesDiv.innerHTML+='<div class="box zone" ><img onclick=selectImage(parentNode,"'+ product.images[ind]+'") src="../../uploads/'+ product.images[ind]+'"></img> '
            // imagesDiv.innerHTML+='<a onclick=deleteImage("'+ product.images[ind]+'")>Delete...</a>  </div>'
                
         
        }
        
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
function createImgAttListItem(parent, name,  img){
    const imgVal = img ? img :''
    const nameVal = name ? name :''
    parent.parentElement.appendChild( createListItem(nameVal, imgVal));
}
function createAttListItem(parent, name){
    const nameVal = name ? name :''
    parent.parentElement.appendChild( createListItem(nameVal));
}
function addAttributes(name='', values){
    var li = document.createElement("li");
    var innerHTML  = '<div><a href="#" onclick="removeli(parentNode)">remove</a> <input type="text" value = "'+name +'" placeholder="name" required> '
    var attInnerHTML =  '<ul><li><a href="#" onclick="createAttListItem(parentNode)">Add Value..</a></li>'
    if(values)
    {
        for(var ind in values){
        
            attInnerHTML +=  '<li><div><input type="text" value = "'+values[ind] +'"  placeholder="value" required >'
            attInnerHTML += '<a href="#" onclick="removeli(parentNode)">remove</a></div></li>'
        }
    }
    innerHTML  += attInnerHTML+ '</ul></div>'
    li.innerHTML= innerHTML
    ulAttributes.appendChild(li);
}


function addImgAttributes(name='', values){
    var li = document.createElement("li");
    
    var innerHTML  = '<div><a href="#" onclick="removeli(parentNode)">remove</a> <input type="text" value = "'+name +'" placeholder="name" required> '
    
    var attInnerHTML =  '<ul><li><a href="#" onclick="createImgAttListItem(parentNode)">Add Value..</a></li>'


    if(values)
    {
        for(var ind in values){
        
            attInnerHTML +=  '<li><div><input type="text" value = "'+values[ind].value +'"  placeholder="value" required >'
            attInnerHTML +=  '<input type="text" value = "'+values[ind].img +'"  placeholder="value" required >'
            attInnerHTML += '<a href="#" onclick="removeli(parentNode)">remove</a></div></li>'
        }
    }
    
    innerHTML  += attInnerHTML+ '</ul></div>'
    li.innerHTML= innerHTML
    ulImgAttributes.appendChild(li);
}



function addDetails(name = ''){
    uldetails.appendChild( createListItem(name));
}
function addTags(name = ''){
    ultags.appendChild( createListItem(name));
}

var currentAttributeDiv = undefined

function selectAttImg(element){
    currentAttributeDiv = element.parentElement
    var imagesDiv = document.getElementById("imagesDiv")
 
    imagesDiv.style.display = "grid"
}

function selectImage(parent, img){

    var input = currentAttributeDiv.getElementsByTagName("input")[1]
    

    if(input.value.trim()!='')
    {
        ulimages.appendChild( createListItem(input.value.trim()));

    }
    currentAttributeDiv.getElementsByTagName("img")[0].src = '../../uploads/'+ img
    input.value = img
    imagesDiv.style.display = "none"
    // var parent = parentNode.parentNode.parentNode
    // parent.removeChild(parent)
     removeli(parent)
    }



function createListItem(name, img){
    var li = document.createElement("li");
    var innerHTML  = "<div>  <input type='text' value = '"+name+"' placeholder="+name+" required> "
    if(img != undefined)
    {
         innerHTML += "<img onclick=selectImage(parentNode,'"+ img+"') src='../../uploads/"+img+"'></img> "
        innerHTML += " <input type='text' value = '"+img+"' placeholder="+name+" required>  <a onClick = selectAttImg(this) >Select Image...</a>"

    }
    innerHTML += '<a href="#" onclick="removeli(parentNode)">remove</a>'
    innerHTML  += ' </div>'
    li.innerHTML= innerHTML
    return li
 
}
function removeli(parentNode){
     
    var parent = parentNode.parentNode.parentNode
    parent.removeChild(parentNode.parentNode)
    if(parent){
        window.setTimeout(function () { 
      
            parent.focus(); 
    }, 0);
    }
    
  
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
    
   
    if(formAction === 'products'){
 
        formdata.append('price', form.elements['price'].value)
        var attributes_array =[]

        for (var i = 0; i < ulAttributes.children.length; i++ ) {
            var attribute = {}
            var inputs = attributes.children[ i ].getElementsByTagName("input")
            var name = inputs[0].value;
             
            var values_array =[]
            for (var j = 1; j < inputs.length; j++ ) {
                 values_array.push(inputs[j].value);
            }
            attribute.name = name
            attribute.values = values_array
            attributes_array.push(attribute)
            
        }

        var imgAttributesArray =[]
        for (i=0 ; i < ulImgAttributes.children.length; i++)
        {

            var attribute = {}
            var inputs = ulImgAttributes.children[ i ].getElementsByTagName("input")
            var name = inputs[0].value;
             
            var values =[]
            for (var j = 1; j < inputs.length; j+=2 ) {
                 var obj ={ value: inputs[j].value ,img :inputs[j+1].value}
                values.push(obj);
            }
            attribute.name = name
            attribute.values = values
            imgAttributesArray.push(attribute)


 
        }
        formdata.append( 'imgattributes', JSON.stringify(imgAttributesArray ) )

        
        var details_array =[]
    
        for (var i = 0; i < uldetails.children.length; i++ ) {
            var details= {}
    
            var detailinput = uldetails.children[ i ].getElementsByTagName("input");
           
            details_array.push( detailinput[0].value)
            
        }

        var images_array =[]
        for (i=0 ; i < ulimages.children.length; i++)
        {
            var name = ulimages.children[ i ].getElementsByTagName("input")[0].value
            images_array.push(name)
        }
        formdata.append( 'images', JSON.stringify(images_array ) )

        var tags_array =[]
    
        for (var i = 0; i < ultags.children.length; i++ ) {
            var name = ultags.children[ i ].getElementsByTagName("input")[0].value
            tags_array.push(name)
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

 
        var fileReader = new FileReader();
            fileReader.onload = function(fileLoadedEvent) 
            {
                var imageLoaded = document.createElement("img");
                imageLoaded.src = fileLoadedEvent.target.result;
                const fileDiv = document.getElementById("fileDiv")
                fileDiv.innerHTML=''
                fileDiv.appendChild(imageLoaded);

            // imagesDiv.innerHTML+='<div class="box zone" ><img onclick=selectImage("'+ product.images[ind]+'") src="../../uploads/'+ product.images[ind]+'"></img> '
            // imagesDiv.innerHTML+='<a onclick=deleteImage("'+ product.images[ind]+'")>Delete...</a>  </div>'
                
         
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
    const fileDiv = document.getElementById("fileDiv")

    fileDiv.innerHTML=''
    for (i =0; i < productFiles.files.length; i++)
    {     
        
        var fileToLoad = productFiles.files[i];
        
        // ulimages.appendChild( createListItem(fileToLoad.name));
        // imagesDiv.innerHTML=''
        if (fileToLoad.type.match("image.*"))
        {
            var fileReader = new FileReader();
            fileReader.onload = function(fileLoadedEvent) 
            {
                fileLoadedEvent.target
                var imageLoaded = document.createElement("img");
                imageLoaded.src = fileLoadedEvent.target.result;
                document.getElementById("fileDiv").appendChild(imageLoaded);
                
              
                // imagesDiv.innerHTML+='<div class="box zone" ><img onclick=selectImage("'+ fileToLoad.name+'") src="'+imageLoaded.src+'"></img> '
                // imagesDiv.innerHTML+=' <a onclick=removeli(parentNode))>Delete...</a>  </div>'
       

            };
            fileReader.readAsDataURL(fileToLoad);
        }
    }
   
}
        
