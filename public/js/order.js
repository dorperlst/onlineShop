const form = document.getElementById("form");
var orderDiv = document.getElementById("ordersDiv");    
var orderFiles = document.getElementById("orderFiles");    

getOrders()

function getOrders(){
    form.reset();
    fetch('/orders/')
        .then((res) => { 
        if(res.status == 200)
            return res.json() 
        return null
        })
        .then((jsonData) => {   
            orderDiv.innerHTML = ''
           
            for(var data in jsonData.order)
            {
                orderDiv.innerHTML += '<div> <label>Order Name : '+jsonData.order[data].name+'</label> </br>'
                orderDiv.innerHTML += ' <label>Description   : '+jsonData.order[data].description+'</label></br>'
                orderDiv.innerHTML += '<label>Price : '+jsonData.order[data].price+'</label></br>'
                orderDiv.innerHTML += '<a onclick = deleteOrder("'+jsonData.order[data]._id+'") >Delete</a></br>'

                orderDiv.innerHTML += '<a onclick = editOrder("'+jsonData.order[data]._id+'") >Edit</a></br>'+' </div></br></br>'
            }  
        });
}

function addOrder(id){
    form.reset();
     
}

function editOrder(id){
    form.reset();
    fetch('/orders/'+id+'/')
    .then((res) => { 
      if(res.status == 200)
        return res.json() 
      return null
    })
    .then((jsonData) => {
 
        form.elements['name'].value = jsonData.order.name
        form.elements['price'].value = jsonData.order.price
        form.elements['description'].value = jsonData.order.description
        form.elements['id'].value = jsonData.order._id
          
        
         
    });
}

function deleteOrder(id){
    var formdata = new FormData();



    fetch('/orders/'+id,
        { method: 'delete',body :{}})
    .then(function(res) {   
        getOrders()
        return res; 
    })

 
}



form.addEventListener('submit', (e) => {
    e.preventDefault()
    var formdata = new FormData();
    formdata.append('name',form.elements['name'].value)
    formdata.append('price',form.elements['price'].value)
    formdata.append('description',form.elements['description'].value)
    formdata.append('id',form.elements['id'].value)
    var method="post"
    if(form.elements['id'].value!='')
        method="PATCH"
    for (i=0 ; i < orderFiles.files.length; i++)
        formdata.append('myFiles', orderFiles.files[i], orderFiles.files[i].name);

    fetch('/orders',
        { method: method, body: formdata})
    .then(function(res) {   
        getOrders()
        return res; 
    })
})