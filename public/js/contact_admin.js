function getMsg(){
    
    var url ='/'+shopName+'/contact'
  
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
                    innerHTML+='<img  class="" src="../../images/default.jpg"></img>'
                
                innerHTML+='<h4>'+product.name+'</h4>'
                innerHTML+='<h4>'+product.description+'</h4>'
                innerHTML+='<h4>'+product.price +'</h4>'
                innerHTML += '<a onclick=editProduct("'+product._id+'")>Edit </a>'
                innerHTML += '<a onclick=deleteProduct("'+product._id+'")>Delete </a>'

                innerHTML += ' </div> '
                productsDiv.innerHTML += innerHTML
                         
            }
        });
}