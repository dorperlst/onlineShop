
const form = document.getElementById("contact");
const form_shop = document.getElementById("form_shop");
var productsDiv = document.getElementById("productsDiv");   
var contactSec = document.getElementById("contacts");    
var ordersSec = document.getElementById("orders");    
var shopSec = document.getElementById("secShop");    
var productsWrapper = document.getElementById("productsWrapper");    
var productFiles = document.getElementById("productFiles");  
var shopFiles = document.getElementById("shopFiles");  
var categoriesDiv = document.getElementById("categoriesDiv");    
var imagesDiv = document.getElementById("imagesDiv")
const popup = document.getElementById("popup");    
var formcategories = form.elements['categories'];    
var ulAttributes = document.getElementById("ulAttributes");    
var ulImgAttributes = document.getElementById("imgAttributes");    
var ultags = document.getElementById("tags"); 
var ulAbout = document.getElementById("ulAbout"); 
var ulimages = document.getElementById("images"); 
var uldetails = document.getElementById("details"); 
var formAction='' 
var mainImg = undefined
var currentAttributeDiv = undefined
var isAttImg= false
const  ulPager= document.getElementById("pager");

function closePopUp(parent){
    resetForm()
    parent.parentElement.style.display="none"
    productsWrapper.style.display="block"
}

function resetForm(){
    mainImg = undefined
    form.reset();
    uldetails.innerHTML = '';
    ulAttributes.innerHTML = '';
    ulImgAttributes.innerHTML = '';
    ulimages.innerHTML = '';
    ultags.innerHTML = '';
    fileDiv.innerHTML = '';
    if(formcategories.length>0 && formcategories[0].value == 0)
        formcategories.remove(0);
}

function addProduct(){
    formProductDisplay("products","Add Product")
    form.elements['id'].value = ''
}

function deleteProduct(id){
    var conf = confirm("Are you sure you want to delete this product!");
    if (conf != true) 
        return
    var formdata = new FormData();
    formdata.append("currentUrl", window.location.href)
 
    fetch('/products/'+id,
    { method: 'delete', body: formdata})
    .then(function(res) {
        if (res.redirected)  
            window.location.href = res.url;
        else
            document.getElementById("err").textContent="Action Fail"
    })

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
            addAttributes( attribute.name, attribute.values)
        }

        for(var ind in product.imgattributes)
        {
            var imgAttribute = product.imgattributes[ind];
            addImgAttributes( imgAttribute.name, imgAttribute.values)
        }
     
        for(var ind in product.details)
            addDetails(product.details[ind])
 
        for(var ind in product.tags)
           addTags(product.tags[ind]);

        if(product.images_url.length>0 && mainImg == undefined)
            mainImg=product.images_url[0]
        
        for(var ind in product.images)
        {
            ulimages.appendChild(createListItem(product.images[ind], product.images_url[ind]));
            if(product.images[ind]===mainImg)
               ulimages.lastElementChild.className="flex-item nested mainImg";
        }
    });
}

function formProductDisplay(action, title){
    document.getElementById("action").innerHTML = title;
    formAction = action
    resetForm()
    var productDisplay = action=="products"? "block" :"none"
    document.getElementsByClassName("product")[0].style.display = productDisplay
    popup.style.display = "block"
    productsWrapper.style.display = "none"
}

function deleteCategory(id){

    var conf = confirm("Are you sure you want to delete this category!");
    if (conf != true) 
        return
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
    const opt = document.createElement('option');
    opt.value = 0
    opt.text = 'none'
    formcategories.insertBefore(opt, formcategories.firstChild);
    
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
    
    var reply = parent.parentElement.parentElement.querySelectorAll(".reply")[0].value;
    var formdata = new FormData();
    formdata.append("reply", reply);
    formdata.append("id", contact_id);
 
    fetch(  '/users/'+shopName+'/contact ',
    
    { method: "PATCH", body: formdata})
   
}

function createImgAttListItem(parent){
    parent.parentElement.getElementsByTagName("ul")[0].appendChild(createImgListItem('', ''));
}

function deleteContact(parent, id){
    var conf = confirm("Are you sure you want to delete this contact!");
    if (conf != true) 
        return
 
    var formdata = new FormData();
    formdata.append( 'id', id)
    fetch('/contact/'+shopName+'/',
    { method: 'delete', body: formdata})
    .then(function(res) {
        if (res.status===200)  
            parent.parentElement.parentElement.remove()
        else
            document.getElementById("err").textContent="Action Fail"
    })
}

function createAttListItem(parent){
    var ul  =parent.parentElement.getElementsByTagName("ul")[0]
    var li = nameListItem('',"value")
    ul.appendChild(li );
    li.getElementsByTagName("input")[0].focus
 }
    
function addDetails(name = ''){
    uldetails.appendChild( nameListItem(name,"name"));
}

function addTags(name = ''){
    ultags.appendChild( nameListItem(name, "name"));
}
function addAbout(title='', value = ''){
    ulAbout.appendChild( ListItemTextarea(title, value));
}
function selectAttImg(element){
    currentAttributeDiv = element.parentElement
    imagesDiv.style.display = "grid"
    popup.style.display = "none"
    isAttImg= true
}

function selectImage(parent, img){

    if(!isAttImg == true)
    {
        mainImg = img;
        var selected = document.getElementsByClassName("mainImg");
        if(selected.length>0)
             selected[0].className = "";
        parent.className="mainImg";
        return;
    }
    var input = currentAttributeDiv.getElementsByTagName("input")[1]
    if(input.value.trim()!='')
        ulimages.appendChild( createListItem( input.value.trim(),input.value.trim() ));
    var curimg= currentAttributeDiv.getElementsByTagName("img")[0]
    currentAttributeDiv.removeEventListener('mouseover', hover);

    currentAttributeDiv.addEventListener("mouseover", event => {
        hover(this, img)
        });

    curimg.src = img // '../../uploads/'+
    curimg.style="display:block"
    if(mainImg==img)
        mainImg=undefined
    input.value = img
    removeli(parent.parentNode)

    currentAttributeDiv = undefined
    isAttImg= false
    imagesDiv.style.display = "none"
    popup.style.display = "block";    
}

function closeImages(){ 
    isAttImg= false
    imagesDiv.style.display="none"
    var cur = imagesDiv.getAttribute('current');
    document.getElementById(cur).style.display = cur == "secShop" ? "flex" :"block"
 
}

function showImages(parent, src){ 
    isAttImg= false
    imagesDiv.style.display="grid"
    imagesDiv.setAttribute('current',src);
    parent.parentElement.parentElement.parentElement.style.display = "none"

}

function createImgListItem(name, img){
    var li = document.createElement("li");
    const template = document.querySelector('#img-li-template').innerHTML
    const display =(!img || img=='')? "none" : "block"
    const html = Mustache.render(template, {
        name: name,
        img: img,
        display: display
    })
    li.innerHTML = html
    return li
}
//../../uploads/"
function hover(div, img)
{
    div.style="  background: url(img) left no-repeat;"
}

function editShop(){
    shopSec.style.display="flex"
    productsWrapper.style.display = "none"
    ulAbout.innerHTML=""
    fetch('/shop')

    .then((res) => { 
        if(res.status == 200)
            return res.json() 
        return null
    })
    .then((jsonData) => {
        form_shop.elements['shopname'].value = jsonData.name
       

        for(var ind in jsonData.abouts)
        {
            
            addAbout(jsonData.abouts[ind].title, jsonData.abouts[ind].value);
        }
           
        form_shop.elements['address'].value = jsonData.address
        form_shop.elements['lat'].value = jsonData.lat
        form_shop.elements['long'].value = jsonData.long
        for(var ind in jsonData.images_url)
            ulimages.appendChild(createListItem(jsonData.images[ind], jsonData.images_url[ind]));
    });
}

function showContacts(name, img){
    contactSec.style.display="flex"
    productsWrapper.style.display = "none"
}

function showOrders(name, img){
    ordersSec.style.display="block"
    productsWrapper.style.display = "none"
}
 
function nameListItem(name, placeholder){
    const li = document.createElement("li");
    const template = document.querySelector('#li-value-template').innerHTML
    const html = Mustache.render(template, { name: name, placeholder: placeholder })
    li.innerHTML= html
    li.className="flex-item nested"
    return li
}

function ListItemTextarea(title, value){
    const li = document.createElement("li");
    const template = document.querySelector('#li-texterea-template').innerHTML
    const html = Mustache.render(template, { title:title, value: value })
    li.innerHTML= html
    li.className="flex-item nested"
    return li
}

function createListItem(name, img){
    const li = document.createElement("li");
    const template = document.querySelector('#images-li-template').innerHTML
    const html = Mustache.render(template, { name: name , img: img})
    li.innerHTML= html
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
            window.location.href = res.url;
        else
            document.getElementById("err").textContent=res ;
    })

})
 
form_shop.addEventListener('submit', (e) => {
    e.preventDefault()
    var method ="post"
    
    var formdata = new FormData();
   
    formdata.append('name', form_shop.elements['shopname'].value)
    formdata.append('address', form_shop.elements['address'].value)
    formdata.append('lat', form_shop.elements['lat'].value)
    formdata.append('long', form_shop.elements['long'].value)
    var about = aboutToJsonArray(ulAbout)
    formdata.append( 'abouts', about)

    var ulImages = toJsonArray( ulimages ) 
    formdata.append( 'images', ulImages)
  

    for (i=0 ; i < shopFiles.files.length; i++)
        formdata.append('myFiles', shopFiles.files[i], shopFiles.files[i].name);

    fetch('/shops' ,
        { method: 'PATCH', body: formdata})

    .then(function(res) {
        if (res.redirected)  
            window.location.href = res.url;
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

function aboutToJsonArray(ul) {
    var array =[]
    for (var i = 0; i < ul.children.length; i++ ) {
        var value = ul.children[ i ].getElementsByTagName("textarea")[0].value;
        var title = ul.children[ i ].getElementsByTagName("input")[0].value;
        array.push( {title, value})
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
                fileDiv.appendChild(imageLoaded);
            };
            fileReader.readAsDataURL(fileToLoad);
        }
    }
}

function addAttributes(name= '' , values= ['']){
    const template = document.querySelector('#attributes-li-template').innerHTML
    const html = Mustache.render(template, { name: name, values: values })
    ulAttributes.insertAdjacentHTML('beforeend', html)
}

function addImgAttributes(name, values){
    if(!name)
        values=['']
    const template = document.querySelector('#img-attributes-li-template').innerHTML
    const html = Mustache.render(template, { name: name, values: values })
    ulImgAttributes.insertAdjacentHTML('beforeend', html)
}


function replaceUrlParam(paramName, paramValue){
    var url = window.location.href;

    if (paramValue == null) {
        paramValue = '';
    }

    var pattern = new RegExp('\\b('+paramName+'=).*?(&|#|$)');
    if (url.search(pattern)>=0) {
        return url.replace(pattern,'$1' + paramValue + '$2');
    }

    url = url.replace(/[?#]$/,'');
    return url + (url.indexOf('?')>0 ? '&' : '?') + paramName + '=' + paramValue;
}

function pagination(pager, current){
    page = parseInt(pager)
    if ( page < 2)
        return
    
    createPagerLink(page+1, "<")
    for (i=0;i< page ;i++)  
        createPagerLink(i+1, i+1)
    createPagerLink(page+1, ">")
}

function createPagerLink(ind, value){
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.innerHTML= value ;
    var href = replaceUrlParam('pageNum', ind) ; 
    a.href= href;
    li.appendChild(a);
    ulPager.appendChild(li);
}