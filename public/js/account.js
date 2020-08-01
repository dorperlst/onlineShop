 
 var order_info = [];
 const order_total = document.getElementById("order_total")
 const order_total_item = document.getElementById("order_total_items")


function addCount(delta, parent ,id){
    const calcItems= parent.parentElement.parentElement.getElementsByClassName("calc")

    const counter = calcItems[1]
    const price = calcItems[0]
    const total = calcItems[2]

    const newCount = parseInt(counter.innerHTML)  + delta
    if(newCount <= 0)
        return
    counter.innerHTML = newCount
    var new_total =  parseInt(price.innerHTML) * newCount

    total.innerHTML = new_total
  
    order_total.innerHTML = new_total - parseInt(total.innerHTML) + parseInt(order_total.innerHTML)
    order_total_item.innerHTML =   delta + parseInt(order_total_item.innerHTML)
    const  ord = order_info.find(o => o.id === id);

    if (ord)
        ord.count= newCount 
    else
        order_info.push({ id:id, count: newCount })
        
}

function deleteProduct(id) {
    var conf = confirm(" Remove this Item!");
    if (conf == true) {
        fetch('/orders/'+id ,
        { method: "delete"})
        .then( function(res) {
            if(res.status==200)
                window.location.href=`/${shopName}/account`
        } ) 
    }
}

function updateOrder(id)
{
    var formdata = new FormData();
    formdata.append( 'id', id)
    formdata.append( 'products', JSON.stringify(order_info))
    fetch('/orders',{ method: "PATCH", body: formdata}).then(function(res) {}

    ) 
}