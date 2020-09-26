
var address = document.getElementById("address") 
address.innerHTML = address.innerHTML.trim().replace(/\n/g, "<br />")

const contact_form = document.getElementById("contact_form");
var mymap = L.map('mapid').setView([32.6930877,34.9837202], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);

function onLocationFound(e) {
    var radius = e.accuracy / 2;
    L.marker(e.latlng).addTo(mymap)
    L.circle(e.latlng, radius).addTo(mymap);
}
mymap.on('locationfound', onLocationFound);
mymap.locate({setView: true, maxZoom: 16});

contact_form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formdata = new FormData(contact_form);
    const url=`/users/${shopName}/contact`
    fetch(url,//
        { method: 'POST', body: formdata})
        .then((res) => { 
            if(res.status == 200)
            {
                contact_form.reset();
                return res.json() 
            }
            
        return null 
        }
    ).then((jsonData) => {   
        
        document.getElementById("usermsg").innerHTML = jsonData.msg
    });
})  


 