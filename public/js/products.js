var page = 0
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


function refreshAttributes(){

  var att = '[["size","big"]], [["size","meduiom"]]'
  var href = updateQueryStringParameter(window.location.href,"attributes",att)
  window.location.href= href;
 
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