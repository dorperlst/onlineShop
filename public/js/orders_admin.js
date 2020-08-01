

function changeStatus(parent, id)
{
    var formdata = new FormData();
    var status = parent.parentElement.parentElement.getElementsByTagName("select")[0].value
    formdata.append('status', status)

    formdata.append('id', id)
    fetch(`/orderStatus`,
    { method: 'PATCH', body :formdata})
    .then(function(res) {  
        if(res.status == 200)
          parent.parentElement.getElementsByTagName("label")[0].innerHTML= "Update!!!"
        else
            parent.parentElement.getElementsByTagName("label")[0].innerHTML= "Update Fail!!!"
    }) 
}

function deleteOrder(parent, id)
{
    var formdata = new FormData();
    fetch(`/orders/${id}`,
    { method: 'delete'})
    .then(function(res) {  
      if(res.status == 200)
        parent.parentElement..parentElement.remove()
      else
          parent.parentElement.getElementsByTagName("label")[0].innerHTML= "delete Fail!!!"
    }) 
}
    