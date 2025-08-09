// This is your test secret API key.
const stripe = require('stripe')('sk_test_pJiL43vnUyaJT9xOyyG80W4s0096SCKG0c');
const express = require('express');
const app = express();
const cors = require('cors');
const bodypPrser = require('body-parser');

app.use(express.static('public'));
app.use(cors());
app.use( bodypPrser.json());


const YOUR_DOMAIN = 'http://localhost:4242';

app.post('/checkout', async (req, res) => {

  const items = req.body.items.map(( item ) =>{
    return{
     price_data:{
      currency:'usd',
      product_data:{
        name: item.title,
        images:[item.image]
      },
      unit_amount: item.price *100,
     },
     quantity: item.qty
    }
  })
  const session = await stripe.checkout.sessions.create({
    line_items:[ ...items],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });

  res.status(200).json(session);
});

app.listen(4242, () => console.log('Running on port 4242'));