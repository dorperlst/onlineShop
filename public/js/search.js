
const categories = document.getElementById("search");    
var shopName=''

function init(shop){
    shopName = shop
    getCats()

}

function getCats(){
    fetch('/'+shopName+'/cats')
        .then((res) => { 
        if(res.status == 200)
            return res.json() 
        return null
        })
        .then((jsonData) => {   
             
            categories.options.length=0
            categories.clear
            var opt = document.createElement('option');
            opt.value = 0;
            opt.innerHTML = '--all--'
            categories.appendChild(opt);

            for(var data in jsonData.cats)
            {
                var opt = document.createElement('option');
                opt.value = jsonData.cats[data]._id;
                opt.innerHTML = jsonData.cats[data].name
                categories.appendChild(opt);
            }  
        });
}