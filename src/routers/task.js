var express = require('express');
var bodyParser = require('body-parser');
const router = new express.Router()
var port = 8000;
var multer = require('multer'); // v1.0.5
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname.substring(0,file.originalname.lastIndexOf('.')) + '-' + Date.now() + file.originalname.substring(file.originalname.lastIndexOf('.'),file.originalname.length));
  }
});
var upload = multer({ storage : storage}).array('myFiles', 12);

// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({extended: true}));

// router.post('/api/upload',function(req,res){
//     console.log('req.body9999999999999999999');
//     multer({ storage : storage}).array('myFiles', 12)(req,res,function(err) {
//         if(err) {
//             return res.end("Error uploading file.");
//         }
//         res.end("File is uploaded"); 
//         console.log(req.body);
//     });
// });

module.exports = router