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
    var page = parseInt(pager)
    if ( page < 2)
        return
    const  ulPager= document.getElementById("pager");
    for (i=0;i< page ;i++) { 
        const li = document.createElement("li");
        const a = document.createElement("a");

        a.innerHTML= i+1 ;
        var href=replaceUrlParam('pageNum', i+1) ; 
        a.href= href;
        li.appendChild(a);
        ulPager.appendChild(li)
    }
}

