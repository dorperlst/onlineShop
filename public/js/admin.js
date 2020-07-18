
const form = document.getElementById("contact");
var productsDiv = document.getElementById("productsDiv");   
var contactsDiv = document.getElementById("contacts");    

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
    
}

 

function addProduct(){
    formProductDisplay("products","Add Product")
    form.elements['id'].value = ''
}

function deleteProduct(id){

    var r = confirm("Are you sure you want to delete this product!");
    if (r == true) {
        var formdata = new FormData();


        formdata.append("currentUrl", window.location.href)
//todo change redirect 
        fetch('/products/'+id,
            { method: 'delete', body: formdata})
            then(function(res) {
                if (res.redirected)  
                {
                    window.location.href = res.url;
                }
              
                else
                    document.getElementById("err").textContent="Action Fail"
            })
    } 

    
}


function editProduct(id){
    formProductDisplay("products", "Edit Product")

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
        form.elements['available'].value = product.isavailable==true?1:0
        form.elements['promotion'].value = product.promotion==true?1:0
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

           if(product.images.length>0 && mainImg == undefined)
                mainImg=product.images[0]
        for(var ind in product.images)
        {
            ulimages.appendChild(createListItem(product.images[ind], product.images[ind]));
            if(product.images[ind]===mainImg)
               ulimages.lastElementChild.className="flex-item nested mainImg";
         
        }
        
    });
}

function formProductDisplay(action, title){
    document.getElementById("action").innerHTML=title;

    formAction = action

    resetForm()
    var productDisplay = action=="products"? "block" :"none"
    document.getElementsByClassName("product")[0].style.display = productDisplay
    popup.style.display = "block"
    productsWrapper.style.display = "none"
}

function deleteCategory(id){

    var conf = confirm("Are you sure you want to delete this category!");
    if (conf == true) {
        var formdata = new FormData();
        formdata.append("currentUrl", window.location.href)

        fetch('/cats/'+id,
            { method: 'delete', body: formdata})
            then(function(res) {
                if (res.redirected)  
                    window.location.href = res.url;
                else
                    document.getElementById("err").textContent="Action Fail"
            })
    } 
}

function addCategory(id){
    formProductDisplay("cats","Add Category")
    form.elements['id'].value =''
    formcategories.innerHTML = '<option value=0>none</option>'+ formcategories.innerHTML

    var productElements=document.getElementsByClassName("product")
    for(i=0;i< productElements.length;i++)
        productElements[i].style.display="none"

}

function editCategory(id){
    formProductDisplay("cats","Edit Category")
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


function replay(parent, contact_id){
    
    var reply= parent.parentElement.parentElement.querySelectorAll(".reply")[0].value;
    var formdata = new FormData();
    formdata.append("reply", reply);
    formdata.append("id", contact_id);
 
    fetch(  '/users/'+shopName+'/contact ',
    
    { method: "PATCH", body: formdata})
    // .then(function(res) {   
    
    // return  ; 
    // })
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

function showContacts(name, img){
    contactsDiv.style.display="flex"

    productsDiv.style.display="none"
}

function closeContacts(name, img){
    contactsDiv.style.display="none"

    productsDiv.style.display="grid"
}


function createListItem(name, img){
    var li = document.createElement("li");
    var innerHTML  = ''
    if(img != undefined)
        innerHTML += "<div class=images><img onclick=selectImage(this,'"+img+"') src='../../uploads/"+img+"'></img></div> "
    if(name != undefined && name != "" && img != undefined)
        innerHTML +="<div >  <input type='text' disable='disable' value = '"+name+"' placeholder='name' required> "

    else
        innerHTML +="<div >  <input type='text' value = '"+name+"' placeholder='name' required> "
    if(img != undefined)
        innerHTML += "<a href='#' onclick=removeimgli(parentNode,'"+name.trim()+"')><img src='../../images/delete.png'></img></a></div></li>"
    else
        innerHTML += ' <a href="#" onclick="removeli(parentNode)"><img src="../../images/delete.png"></img></a></div></li>'

    innerHTML  += ' </div>'
    li.innerHTML= innerHTML
    li.className="flex-item nested"
    return li
}


function removeimgli(parentNode, name){
    removeli(parentNode);
    if (mainImg==name)
         mainImg=undefined;
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
    if(formcategories[formcategories.selectedIndex].value!="")
        formdata.append('category', formcategories[formcategories.selectedIndex].value)

    if(formAction === 'products'){
 
        formdata.append('price', form.elements['price'].value)
        formdata.append( 'attributes', toAttJsonArray(ulAttributes, false) )
        formdata.append( 'imgattributes', toAttJsonArray(ulImgAttributes, true) )
        
        formdata.append( 'isavailable', form.elements['available'].value )
        formdata.append( 'promotion', form.elements['promotion'].value )

        formdata.append( 'details', toJsonArray (uldetails) )
        var ulImages = toJsonArray( ulimages ) 
        formdata.append( 'images', ulImages)
        if(mainImg != undefined)
            formdata.append('mainimage', mainImg )

        formdata.append( 'tags', toJsonArray( ultags ) )
        for (i=0 ; i < productFiles.files.length; i++)
            formdata.append('myFiles', productFiles.files[i], productFiles.files[i].name);

    }
    else
    {
        if(productFiles.files.length>0)
            formdata.append('avatar', productFiles.files[0], productFiles.files[0].name);

    }
    formdata.append("currentUrl", window.location.href)

    fetch('/' + formAction,
        { method: method, body: formdata})


        .then(function(res) {
            if (res.redirected)  
            {
                window.location.href = res.url;
            }
          
            else
                document.getElementById("err").textContent="Action Fail"
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
        
