 

//  var formData = new FormData();
//  var d = Date.now()

 
//  formData.append('geo.lat', 66)
//  formData.append('geo.long', 88)
//  formData.append('photo', {
//    uri: '/home/doronps/Desktop/node/n3-17-24-deployment/task-manager/public/js/0.jpeg',
//    name: 'test' + d + '.jpg',
//    type: 'image/jpeg',
//  });

//  const config = {
//    method: 'POST',
//    // headers: {  // same result with and without headers
//    //   'Accept': 'application/json',
//    //   'Content-Type': 'multipart/form-data'
//    // },
//    body: formData
//  }

//  fetch("/upload", config)
//    .then((responseData) => {
//      console.log(responseData);
//    })
//    .catch(err => {
//      console.log(err);
//    });
















const form = document.getElementById( "loginForm" );

form.addEventListener('submit', (e) => {
     e.preventDefault()
    //  console.log('form----------------------'+form)
    var formdata6 = new FormData(form);
    formdata6.append('name3', 'nnnnnnn')
    // formdata.append('email', form.elements.namedItem("email").value)
    // formdata.append('password', form.elements.namedItem("password").value)
  // fetch('/upload', { method: 'POST',
  //   headers: {'Content-Type': 'application/json' },
  //   body: formdata6
    
  // })
  // .then(function(res) {
  //     return res;
  // })
  //   fetch('/upload', { method: 'POST',
  //     headers: {'Content-Type': 'application/json' },
  //     body:JSON.stringify({name3:'jjjjjj'})
      
  //   })
  //   .then(function(res) {
  //       return res;
  //   })
    
    fetch('/upload', { method: 'POST',
    //headers: {'Content-Type': 'application/json' },
    body: formdata6
    
  })
  .then(function(res) {
      return res;
  })
  

    // fetch("/signup", {
    //   method: "POST",
    //   body: formdata,
    //   headers: {
    //     "Content-Type": "application/json"
    // }
    // })
    //   .then((res) => {
    //     if (res.ok){
    //       return res 
    //     } else {
    //       throw new Error ('Something went wrong with your fetch');
    //     }
    //   }).then((json) => {
    //     console.log(json);


    //   })
    // fetch('/users', {
    //   method: "POST",
    //   // headers: {
    //   //  // 'Accept': 'application/json',
    //   //  'Content-Type': 'application/json'
    //   // },
    //   body:formdata,
    // }).then((res) => {
    //   console.log("this is res", res)
    // }).catch((err) => {
    //   console.log(err)
    // })



    // fetch('/weather?address=' + location).then((response) => {
    //     response.json().then((data) => {
    //         if (data.error) {
    //             messageOne.textContent = data.error
    //         } else {
    //             messageOne.textContent = data.location
    //             messageTwo.textContent = data.forecast
    //         }
    //     })
    // })
})