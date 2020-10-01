var cloudinary = require('cloudinary').v2;
const path = require('path');

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key:process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
    });


   
    module.exports = {
        upload: (image) => {
            if(!image)
                return
            cloudinary.uploader.upload(
                "public/uploads/"+image , 
                {public_id: path.parse(image).name}, 
                function(error, result) { 
                   if ( error) throw error
                }
                );
        },
      
        url: (image) => {
          return cloudinary.url(path.parse(image).name);
        },
        destroy: (image) => {
            cloudinary.uploader.destroy(path.parse( image ).name, function(result) { console.log(result) });

          },
      
       };