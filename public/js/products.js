var page = 0, min=0, max=0;

const  ulPager= document.getElementById("pager");

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

function toAttArray() {
    var ul = document.getElementById("ul-attributes");

    var array =[]
    for (var i = 0; i < ul.children.length; i++ ) {
        var name = ul.children[i].children[0].text.trim();
        var values_array =[]
        for (var j = 0; j < ul.children[i].children[1].children.length; j++ ) {
            var check=  ul.children[i].children[1].children[j].children[0]
            if (check.checked)
                values_array.push( name, check.value.trim());
        }
        if(values_array.length > 0)
            array.push(values_array)
        
    }
    return array.length > 0 ? JSON.stringify(array) : null;
}

function refreshAttributes(){
    var att =  toAttArray(); 
    var href = window.location.href;
    if(att > 0)
        href = updateQueryStringParameter(href,"attributes",att)
    if(min > 0)
        href = updateQueryStringParameter(href,"pricefrom", min)
    if(max > 0)
        href = updateQueryStringParameter(href,"priceto", max)

    var ulSort = document.getElementById("ulSort");

    for (var i = 0; i <ulSort.children.length; i++ ) {
        if ( ulSort.children[i].children[0].checked)
            href = updateQueryStringParameter(href,"sortBy",  ulSort.children[i].children[0].value.trim()) ;
    }

    if(href !=  window.location.href)
        window.location.href = href;


}

function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) 
      return uri.replace(re, '$1' + key + "=" + value + '$2');
    else 
      return uri + separator + key + "=" + value;
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


function modifyOffset(parent) {
    var el, newPoint, newPlace, offset, siblings, k;
    width    = this.offsetWidth;
    newPoint = (this.value - this.getAttribute("min")) / (this.getAttribute("max") - this.getAttribute("min"));
    offset   = -1;
    if (newPoint < 0) { newPlace = 0;  }
    else if (newPoint > 1) { newPlace = width; }
    else { newPlace = width * newPoint + offset; offset -= newPoint;}
    siblings = this.parentNode.childNodes;
    for (var i = 0; i < siblings.length; i++) {
        sibling = siblings[i];
        if (sibling.id == this.id) { k = true; }
        if ((k == true) && (sibling.nodeName == "OUTPUT")) {
            outputTag = sibling;
        }
    }
    outputTag.style.left       = newPlace - 10+ "px";
   // outputTag.style.marginLeft = offset + "%";
    outputTag.innerHTML        = this.value;
} 

function oninputUbound(parent) {
    parent.parentNode.dataset.ubound = parent.value;
    max= parent.value; 
}

function oninputLbound(parent) {
    parent.parentNode.dataset.lbound = parent.value;
    min= parent.value;
}

function selectCategory(url, cat ) {
    var cat=encodeURIComponent(category)
    var href = `/${url}?category=${cat} `
    window.location.href = href;
}

