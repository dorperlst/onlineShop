const express= require('express');
const router= new express.Router()
const paypal= require('paypal-rest-sdk')

paypal.configure({
    'mode': 'sandbox', 
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRET
});


router.get('/create', function(req, res){
    const total= '7.47',
    currency= 'USD'
    //build PayPal payment request
    var payReq = JSON.stringify({
        'intent':'sale',
        'redirect_urls':{
            'return_url':'/process',
            'cancel_url':'/cancel'
        },
        'payer':{
            'payment_method':'paypal'
        },
        'transactions':[{
            'amount':{
                'total': total,
                'currency': currency
            },
            'description': 'This is the payment transaction description.'
        }]
    });

    paypal.payment.create(payReq, function(error, payment){
        if(error){
            console.error(error);
        } else {
            //capture HATEOAS links
            var links = {};
            payment.links.forEach(function(linkObj){
                links[linkObj.rel] = {
                    'href': linkObj.href,
                    'method': linkObj.method
                };
            })
        
            //if redirect url present, redirect user
            if (links.hasOwnProperty('approval_url')){
                res.redirect(links['approval_url'].href);
            } else {
                console.error('no redirect URI present');
            }
        }
    });
});


router.get('/process', function(req, res){
    var paymentId = req.query.paymentId;
    var payerId = { 'payer_id': req.query.PayerID };

    paypal.payment.execute(paymentId, payerId, function(error, payment){
        if(error){
            console.error(error);
        } else {
            if (payment.state == 'approved'){ 
                res.send('payment completed successfully');
            } else {
                res.send('payment not successful');
            }
        }
    });
});


 




module.exports = router