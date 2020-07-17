 
 var order_info = [];


function addCount(delta, parent ,id){
    var calcItems= parent.parentElement.parentElement.getElementsByClassName("calc")
    var counter = calcItems[1]
    var price = calcItems[0]
    var total = calcItems[2]

    var count = parseInt(counter.innerHTML)
    var newCount = count  + delta
    if(newCount <= 0)
        return
    counter.innerHTML = newCount
    var old_total =  parseInt(total.innerHTML)  
    var new_total =  parseInt(price.innerHTML) * newCount

    total.innerHTML = new_total
    var order_total = document.getElementById("order_total")
    var order_total_item = document.getElementById("order_total_items")

    order_total.innerHTML = new_total - old_total + parseInt(order_total.innerHTML)
    order_total_item.innerHTML =   delta + parseInt(order_total_item.innerHTML)
    const  ord = order_info.find(o => o.id === id);

    if (ord)
        ord.count= newCount 
    else
        order_info.push({ id:id, count: newCount })
        
}

function deleteProduct(id) {
    var conf = confirm("Are you sure you want to delete this category!");
    if (conf == true) {
        fetch('/orders/'+id ,
        { method: "delete"})
        .then( function(res) {
            if(res.status==200)
                window.location.href="/"+shopName+"/account"
        } ) 
    }
}

// function jsonPriceArray() {
//     var array = document.getElementsByClassName("price");
//     array_val=[]
//      for (var i = 0; i < array.length; i++ ) {
//         array_val.push( array[i].value)
//     }
//     return JSON.stringify(array)
// }
 

function updateOrder(id)
{

    var formdata = new FormData();
    formdata.append( 'id', id)
    formdata.append( 'products', JSON.stringify(order_info))

    fetch('/orders' ,
    { method: "PATCH", body: formdata})


    .then(function(res) {}

    ) 
}