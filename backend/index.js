const app = require('express')()
const Razorpay = require('razorpay')
const shortid = require('shortid')
const cors = require('cors')
const formidable = require('express-formidable');

app.use(cors())
app.use(formidable());

const razorpay = new Razorpay({
    key_id: 'rzp_test_577h02zBHnXglJ',
    key_secret: '5OkLdvp5UI8v4eF9onN5qviG',
  });





app.post('/razorpay', async (req,res) => {

    const payment_capture = 1
    const amount = 500
    const currency = 'INR'

    const options  = {
        amount: (amount * 100).toString(), 
        currency, 
        receipt: shortid.generate(), 
        payment_capture
    }
    

   const response = await razorpay.orders.create(options)
   console.log(response)
   res.send({
       id: response.id,
       currency: response.currency,
       amount: response.amount
   })
})  

app.post('/verify', (req, res) => {

    

    console.log('Payment_ID: ' + req.fields.razorpay_payment_id);
    console.log('Order_ID: ' +  req.fields.razorpay_order_id);
    console.log('Signature: ' + req.fields.razorpay_signature);

   let body=req.fields.razorpay_order_id + "|" + req.fields.razorpay_payment_id;
   console.log(body);

  var crypto = require("crypto");
  var expectedSignature = crypto.createHmac('sha256', '5OkLdvp5UI8v4eF9onN5qviG')
                                  .update(body.toString())
                                  .digest('hex');
                                  console.log("sig recieved " ,req.fields.razorpay_signature);
                                  console.log("sig generated " ,expectedSignature);
  var response = {"signatureIsValid":"false"}
  console.log((expectedSignature === req.fields.razorpay_signature))
//    response={"signatureIsValid":"true"}
//    res.send({
   
// })
})

app.listen(1769, () => {
	console.log('Listening on 1769')
})
