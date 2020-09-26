const express   = require('express');

const app = express();
app.get('/', async (req, res) => {
     
     

 

    res.send("loggg")
})

const port = process.env.PORT || 3500

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

module.exports = app