
const form = document.getElementById("contact");
var productsDiv = document.getElementById("productsDiv");    
var productsWrapper = document.getElementById("productsWrapper");    
var productFiles = document.getElementById("productFiles");    
var categoriesDiv = document.getElementById("categoriesDiv");    
var imagesDiv = document.getElementById("imagesDiv")
const popup = document.getElementById("popup");    
var formcategories = form.elements['categories'];    
var ulAttributes = document.getElementById("ulAttributes");    
var ulImgAttributes = document.getElementById("imgAttributes");    
var ultags = document.getElementById("tags"); 
var ulimages = document.getElementById("images"); 
var uldetails = document.getElementById("details"); 
var formAction='' 
var mainImg = undefined

function closePopUp(){
    resetForm()
    popup.style.display="none"
    productsWrapper.style.display="block"
}

function resetForm(){
    mainImg=undefined
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

function getProducts(category){
    resetForm()
    var url ='/'+shopName+'/products'
    if(category)
        url +='?category=' + category
    fetch(url)
        .then((res) => { 
            if(res.status == 200)
                return res.json() 
            return null
        })
        .then((jsonData) => {   
            productsDiv.innerHTML = ''
           
            for(var ind in jsonData.products.products)
            {
                var product = jsonData.products.products[ind]
                var innerHTML ='<div class ="box zone "> '
                if ( product.images[0]) 
                    innerHTML+='<img  class="" src="../../uploads/'+ product.images[0]+'"></img> '
                else  
                    innerHTML+='<img  class="" src="../../uploads/default.jpeg"></img>'
                
                innerHTML+='<h4>'+product.name+'</h4>'
                innerHTML+='<h4>'+product.description+'</h4>'
                innerHTML+='<h4>'+product.price +'</h4>'
                innerHTML += '<a onclick=editProduct("'+ product._id +'")>Edit </a>'
                innerHTML += '<a onclick="deleteProduct("' + product._id + '")">Delete</a>'+' </div> '
                productsDiv.innerHTML += innerHTML
                         
            }
        });
}

function addProduct(){
    formProductDisplay("products")
    form.elements['id'].value = ''
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


function editProduct(id){
    formProductDisplay("products")
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
        mainImg = product.mainimage
        formcategories.selectedIndex =  [...formcategories.options].findIndex(option => option.text ===  product.category)  
        uldetails.innerHTML = '';
        ulAttributes.innerHTML = '';
        ulImgAttributes.innerHTML = '';
        ultags.innerHTML = '';

        for(var ind in product.attributes)
        {
            var attribute =product.attributes[ind];
            addAttributes(false, attribute.name, attribute.values)
        }

        for(var ind in product.imgattributes)
        {
            var imgAttribute = product.imgattributes[ind];
            addAttributes(true, imgAttribute.name, imgAttribute.values)
        }
     
        for(var ind in product.details)
            addDetails(product.details[ind])
 
        for(var ind in product.tags)
           addTags(product.tags[ind]);

        for(var ind in product.images)
        {
            ulimages.appendChild(createListItem(product.images[ind], product.images[ind]));
            if(product.images[ind]===mainImg)
               ulimages.lastElementChild.className="mainImg";
         
        }
        
    });
}

function formProductDisplay(action){
    formAction = action
    resetForm()
    var productDisplay = action=="products"? "block" :"none"
    document.getElementsByClassName("product")[0].style.display = productDisplay
    popup.style.display = "block"
    productsWrapper.style.display = "none"
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

function addCategory(id){
    formProductDisplay("cats")
    form.elements['id'].value =''
    formcategories.innerHTML = '<option value=0>none</option>'+ formcategories.innerHTML

    var productElements=document.getElementsByClassName("product")
    for(i=0;i< productElements.length;i++)
        productElements[i].style.display="none"

}

function editCategory(id){
    formProductDisplay("cats")
        
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
        var catname = !category.parent? "none" : category.parent
        formcategories.selectedIndex =  [...formcategories.options].findIndex(option => option.text ===  catname)  
         
    });
}

function createImgAttListItem(parent, name,  img){
    const imgVal = img ? img : ''
    const nameVal = name ? name :''
   
    parent.parentElement.getElementsByTagName("ul")[0].appendChild(createImgListItem(nameVal, imgVal));
}

function createAttListItem(parent, name){
    const nameVal = name ? name :''
    var ul  =parent.parentElement.getElementsByTagName("ul")[0]
    ul.appendChild( createAtrributeListItem(nameVal));
    ul.getElementsByTagName("input")[0].focus
 
 }

function addAttributes(isImg, name='', values){
    var liAtrributes = document.createElement("li");
    liAtrributes.className="flex-item"
    

    var innerHTML  = '<div class="flex-container nested"><input type="text" value = "'+name +'" placeholder="name" required><a onclick="removeli(parentNode)"> <img src="../../images/delete.png"></img></a> '
    if(isImg == true)
        innerHTML +=  '<a href="#" onclick="createImgAttListItem(parentNode)"><img src="../../images/add.png"></img></a></div>'
    else
        innerHTML +=  '<a href="#" onclick="createAttListItem(parentNode)"><img src="../../images/add.png"></img></a></div>'

    liAtrributes.innerHTML  =innerHTML
    var nestedUl = document.createElement("ul");
    nestedUl.className="flex-item nested"
    if(isImg == true )
    {
        attInnerHTML =''
        if(!values || values.length ==0)
        {
            // attInnerHTML +=  '<div class="flex-container nested"> '
             nestedUl.appendChild( createImgListItem("", ""));

        }
        else
        {
            for(var ind in values)
                nestedUl.appendChild( createImgListItem(values[ind].value, values[ind].img));
        }
     }
    else
    {
         if(!values || values.length ==0)
        {
            // attInnerHTML +=  '<div class="flex-container nested"> '

             nestedUl.appendChild(createAtrributeListItem(""));
        }
        else
        {
            for(var ind in values)
                nestedUl.appendChild(createAtrributeListItem(values[ind]));
        }
    }
    liAtrributes.appendChild(nestedUl) 
    if(isImg == true)
        ulImgAttributes.appendChild (liAtrributes);
    else
        ulAttributes.appendChild (liAtrributes);
        
    liAtrributes.getElementsByTagName("input")[0].focus

}

function addDetails(name = ''){
    uldetails.appendChild( createListItem(name));
}

function addTags(name = ''){
    ultags.appendChild( createListItem(name));
}

var currentAttributeDiv = undefined
var isAttImg= false


function selectAttImg(element){
    currentAttributeDiv = element.parentElement
    imagesDiv.style.display = "grid"
    isAttImg= true
}

function selectImage(parent, img){
    if(isAttImg == true)
    {
        var input = currentAttributeDiv.getElementsByTagName("input")[1]
        if(input.value.trim()!='')
            ulimages.appendChild( createListItem( input.value.trim(),input.value.trim() ));
        var curimg=currentAttributeDiv.getElementsByTagName("img")[0]
        curimg.src = '../../uploads/'+ img
        curimg.style="display:block"
        if(mainImg==img)
           mainImg=undefined
        input.value = img
        removeli(parent)
        currentAttributeDiv = undefined
        isAttImg= false
        imagesDiv.style.display = "none"
    }
    else
    {
        mainImg = img;
        var selected = document.getElementsByClassName("mainImg");
        if(selected.length>0)
             selected[0].className = "";
        parent.className="mainImg";
    }
}

function closeImages(){ 
     isAttImg= false
    imagesDiv.style.display="none"
    form.style.display="block"
}

function showImages(){ 
     isAttImg= false
    imagesDiv.style.display="grid"
    form.style.display="none"
}
function attrListItem(val){

    var innerHTML ="<li class= flex-item nested><div >  <input type='text' value = '"+name+"' placeholder='value' required> "
    
    innerHTML += ' <a href="#" onclick="removeli(parentNode)"><img src="../../images/delete.png"</a></div></li>'
    innerHTML  += ' </div></li>'
    return innerHTML 
}
function createAtrributeListItem(name){
    var li = document.createElement("li");
    var innerHTML =  '<div class="flex-container nested"><input type="text" value = "'+name +'"  placeholder="value" required >'
    
    innerHTML += '<a onclick="removeli(parentNode)"> <img src="../../images/delete.png"></img></a> '
    innerHTML +='</div>'
    li.innerHTML= innerHTML
    return li
}

function createImgListItem(name, img){
    var li = document.createElement("li");

    var innerHTML =  '<div class="flex-container nested"><input type="text" value = "'+name +'"  placeholder="value" required >'
    innerHTML +=  '<input  disabled="disabled" type="text" value = "'+img +'"  placeholder="value" required >'
    innerHTML +=  "<div class=big-wrap><div class=big onmouseover=hover(this,'"+img +"')><img class=to-big"
    if(!img || img=='')
        innerHTML +=  ' style="display:none"'  
    
    innerHTML +=  ' src = "../../uploads/'+img +'" > </div></div>'
    innerHTML +=  '<a href="#" onclick="selectAttImg(this)"><img src="../../images/select.png"></img></a>'
    innerHTML += '<a onclick="removeli(parentNode)"> <img src="../../images/delete.png"></img></a> '
    innerHTML +='</div>'
    li.innerHTML = innerHTML
    return li
}
function hover(div, img)
{
    div.style="  background: url(../../uploads/"+img+") left no-repeat;"
}


function createListItem(name, img){
    var li = document.createElement("li");
    var innerHTML  = ''
    if(img != undefined)
    {
        innerHTML += "<img onclick=selectImage(this,'"+ img+"') src='../../uploads/"+img+"'></img> "
    }
    innerHTML +="<div >  <input type='text' value = '"+name+"' placeholder='name' required> "
    
    innerHTML += ' <a href="#" onclick="removeli(parentNode)"><img src="../../images/delete.png"</a></div></li>'
    innerHTML  += ' </div>'
    li.innerHTML= innerHTML
    li.className="flex-item nested"
    return li
}

function removeli(parentNode){
    var parent = parentNode.parentNode.parentNode
    parent.removeChild(parentNode.parentNode)
    if(parent) 
        window.setTimeout(function () { parent.focus();  }, 0);
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
    if(formcategories[formcategories.selectedIndex].value!=0)
        formdata.append('category', formcategories[formcategories.selectedIndex].value)

    if(formAction === 'products'){

        if(!mainImg && ulimages.length>0)
            mainImg = ulimages[0]
        formdata.append('mainimage', mainImg)
        formdata.append('price', form.elements['price'].value)
        formdata.append( 'attributes', toAttJsonArray(ulAttributes, false) )
        formdata.append( 'imgattributes', toAttJsonArray(ulImgAttributes, true) )

        
        formdata.append( 'details', toJsonArray (uldetails) )
        formdata.append( 'images', toJsonArray( ulimages ) )
        formdata.append( 'tags', toJsonArray( ultags ) )
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
        closePopUp()
        if(formAction === 'products')
            getProducts()
        else
        {
              subCategories()
        }
       
        return res; 
    })
})


function toAttJsonArray(ul, isImg) {

    var array =[]
    for (var i = 0; i < ul.children.length; i++ ) {
        var attribute = {}
        var inputs = ul.children[i].getElementsByTagName("input")
        attribute.name = inputs[0].value;

        var values_array =[]
        if(isImg === true)
        {
            for (var j = 1; j < inputs.length; j+=2 ) {
               var obj ={ value: inputs[j].value ,img :inputs[j+1].value}
               values_array.push(obj);
            }
        }
        else
        {
            for (var j = 1; j < inputs.length; j++ )  
                values_array.push(inputs[j].value);
        }
        attribute.values = values_array
        array.push(attribute)
        
    }
    return JSON.stringify(array)

}

function toJsonArray(ul) {

    var array =[]
    for (var i = 0; i < ul.children.length; i++ ) {
        var input = ul.children[ i ].getElementsByTagName("input");
        array.push( input[0].value)
    }
    return JSON.stringify(array)
}

 
 
function subCategories( categoryname, parentName,id){

    var parent= parentName === undefined ? "" : parentName
    var ulcategories = document.getElementById("ulcategories");  
    var innerHTML=  ''  
    var url = '/'+shopName+'/cats'
    if(categoryname && categoryname!='')
    {
        url +='?parent='+ categoryname
      //  innerHTML += '<li><a onclick = backCategory()>..Back</a> <h3>'+categoryname+' </h3></li>'
        innerHTML += '<li class="even"><div class="back"><input onclick = subCategories("'+parent+'") type="button"  class="back-btn" ><h3>'+categoryname+' </h3> <a onclick= editCategory("'+ id +'")>Edit</a>  <a onclick= deleteCategory("'+id +'")>Delete</a></div> </li>'
    }
  
    else 
    {
         url +='?mainCategories=true'
    }

    ulcategories.innerHTML = innerHTML
  
    fetch( url )
    .then((res) => { 
    if(res.status == 200)
        return res.json() 
    return null
    })
    .then((jsonData) => {   


      

        var line='odd' 
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
            var parent= jsonData.cats[data].parent === undefined ? "" : jsonData.cats[data].parent

            var liinnerHTML =`<li class=${line} >  <a onclick="subCategories('${name}','${parent}','${jsonData.cats[data]._id}')" >${name}</a>  </li> `

           
            ulcategories.innerHTML += liinnerHTML
            line =line=='odd'? 'even' :'odd'  
        } 
        getProducts(categoryname) 
    });
}














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
            };
            fileReader.readAsDataURL(fileToLoad);
    }
}

function loadImageFileAsURL()
{
    const fileDiv = document.getElementById("fileDiv")

    fileDiv.innerHTML=''
    for (i =0; i < productFiles.files.length; i++)
    {     
        var fileToLoad = productFiles.files[i];
        if (fileToLoad.type.match("image.*"))
        {
            var fileReader = new FileReader();
            fileReader.onload = function(fileLoadedEvent) 
            {
                fileLoadedEvent.target
                var imageLoaded = document.createElement("img");
                imageLoaded.src = fileLoadedEvent.target.result;
                document.getElementById("fileDiv").appendChild(imageLoaded);
            };
            fileReader.readAsDataURL(fileToLoad);
        }
    }
   
}
        
