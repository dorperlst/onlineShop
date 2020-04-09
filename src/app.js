const express   = require('express');
//const engines   = require('consolidate');
const bodyParser = require('body-parser');
const multer = require('multer');
multerS3 = require('multer-s3');
const path = require('path')
const hbs = require('hbs')
var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var myBucket = 'myBucket';
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

const app = express();
 
app.set('view engine', 'hbs')
app.use(express.static(publicDirectoryPath))
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: myBucket,
    key: function (req, file, cb) {
      console.log(file);
      cb(null, file.originalname);
    }
  })
});

app.post('/upload', upload.array('photo', 1), (request, response, next) => {
  // upload to S3 works great!
  console.log(request.body); // returns "{ geo: ' ' }", would love to play with the lat, long here

  response.send('uploaded!')
});

//exports.app = functions.https.onRequest(app);





app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Andrew Mead'
    })
})

module.exports = app