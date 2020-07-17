const express= require('express');
const router= new express.Router()
const paypal= require('paypal-rest-sdk')
const auth = require('../middleware/auth').auth
const Order = require('../models/order').Order
var multer = require('multer'); 

paypal.configure({
    'mode': 'sandbox', 
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRET
});


router.get('/:shop/create', multer().none(), auth, async (req, res) => {

    var orderStats = await Order.orderStats(req.user._id, req.params.shop )
    currency = 'USD'
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
                'total': orderStats.total,
                'currency': currency
            },
            'description': 'online shop test'
        }]
    });

    paypal.payment.create(payReq, function(error, payment){
        if(error){
            res.send({error});
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

    paypal.payment.execute(paymentId, payerId, async function(error, payment){
        if(error){
            console.error(error);
        } else {
            if (payment.state == 'approved'){ 

                if(req.user && req.user.orders  )
                {
                  
                    const order = req.user.orders.find(element => element.status == 0);
                    order.status = Order.statusEnum.PAYED;
                    order.paymentId = paymentId;
                    await order.save()

                }


                res.send({paymentId : paymentId, msg :'payment completed successfully'});
            } else {
                res.send('payment not successful');
            }
        }
    });
});


 




module.exports = router