const router = require('express').Router();
const mongoose = require('mongoose');
const CartItem = require('../models/cartItem');
const stripe = require('stripe')('sk_test_lUvC2AXdpANfL0hbD29egdo000botITw5L');
router.post('/add', (req, res) => {
  CartItem.findOne({ user: req.body.user })
    .exec()
    .then(cartItem => {
      if (cartItem) {
        const item = cartItem.cart.find(cart => cart.product === req.body.product);
        let where;
        let action;
        let set;
        if (item) {
          action = '$set';
          where = { user: req.body.user, 'cart.product': req.body.product };
          set = 'cart.$';
        } else {
          action = '$push';
          where = { user: req.body.user };
          set = 'cart';
        }

        CartItem.findOneAndUpdate(where, {
          [action]: {
            [set]: {
              _id: item ? item._id : new mongoose.Types.ObjectId(),
              product: req.body.product,
              quantity: item ? item.quantity + req.body.quantity : req.body.quantity,
              price: req.body.price,
              total: item
                ? req.body.price * (req.body.quantity + item.quantity)
                : req.body.price * req.body.quantity,
            },
          },
        })
          .exec()
          .then(newItem => {
            res.status(201).json({
              message: newItem,
            });
          })
          .catch(error => {
            res.status(500).json({
              message: error,
            });
          });
      } else {
        const newCartItem = new CartItem({
          _id: new mongoose.Types.ObjectId(),
          user: req.body.user,
          cart: [
            {
              _id: new mongoose.Types.ObjectId(),
              product: req.body.product,
              quantity: req.body.quantity,
              price: req.body.price,
              total: req.body.quantity * req.body.price,
            },
          ],
        });

        newCartItem
          .save()
          .then(newCart => {
            res.status(201).json({
              message: newCart,
            });
          })
          .catch(error => {
            res.status(500).json({
              message:error.message
            });
          });
      }
    })
    .catch(error => {
      res.status(500).json({
        error,
      });
    });
});

router.post('/user/:userId', (req, res) => {
  const { userId } = req.params;

  CartItem.find({ user: userId })
    .select('_id user cart')
    .populate('cart.product', 'name productPic')
    .exec()
    .then(cartItems => {
      res.status(200).json({
        message: cartItems,
      });
    });
});

router.put('/update/quantity', (req, res) => {
  const { userId } = req.body;
  const { productId } = req.body;
  const { quantity } = req.body;
  const { total } = req.body;

  CartItem.update(
    { user: userId, 'cart.product': productId },
    {
      $set: {
        'cart.$.quantity': quantity,
        'cart.$.total': total,
      },
    },
  )
    .exec()
    .then(cartItem => {
      res.status(201).json({
        message: cartItem,
      });
    })
    .catch(error => {
      res.status(500).json({
        message:error.message
      });
    });
});

router.post('/checkout', async (req, res) => {
  let error;
  let status;
  try {
    const { product, token } = req.body;
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const charge = await stripe.charges.create({
      amount: product.amount,
      currency: 'usd',
      customer: customer.id,
      receipt_email: token.email,
      description: `purchase the ${product.name}`,
      shipping: {
        name: token.card.name,
        address: {
          line1: token.card.address_line1,
          line2: token.card.address_line2,
          city: token.card.address_city,
          country: token.card.address_country,
          postal_code: token.card.address_zip,
        },
      },
    });
    status = 'success';
  } catch (err) {
    status = 'failure';
    error = err;
  }

  res.json({ error, status });
});

module.exports = router;
