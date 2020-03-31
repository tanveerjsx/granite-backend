const router = require('express').Router();
const Order = require('../models/order');
const OrderItems = require('../models/orderItem');
const Products = require('../models/product');
const UserAddress = require('../models/userAddress');
const BillingService = require('../services/billingService');
const orderService = require('../services/orderService');
const orderItemService = require('../services/orderItemService');
const stripe = require('stripe')('sk_test_lUvC2AXdpANfL0hbD29egdo000botITw5L');

router.post('/', async (req, res) => {
  try {
    const {
      order: { user, products, bill },
    } = req.body;
    if (!user)
      return res.status(400).json({
        success: false,
        message: 'undefined user',
      });
    if (!products || products.length === 0)
      return res.status(400).json({
        success: false,
        message: 'can not create order with empty cart',
      });
    try {
      const { product, token } = req.body.token;
      const customer = await stripe.customers.create({
        email: token.email,
        source: token.id,
      });

      const charge = await stripe.charges.create({
        amount: req.body.bill.total * 100,
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
    } catch (error) {}
    const newBill = await BillingService.saveBill(bill);
    const savedOrder = await orderService.saveOrder(user, bill.total, newBill._id);
    await new Promise((resolve, reject) => {
      try {
        products.forEach(async p => {
          await orderItemService.saveItem(savedOrder._id, p._id, p.quantity);
          await Products.findById({ _id: p._id }, function(err, doc) {
            if (err) {
              return res.status(400).json({
                success: false,
                message: "can't decrement product stock",
              });
            }
            doc.stock = doc.stock - p.quantity;
            doc.save();
          });
        });
        resolve();
      } catch (error) {
        reject(new Error(error.message));
      }
    });

    res.status(201).json({
      success: true,
      order: savedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get('/getorders/:userId', (req, res) => {
  const { userId } = req.params;
  Order.find({ user: userId })
    .select('address order orderDate paymentType paymentStatus isOrderCompleted')
    .populate('order.product', 'name productPic')
    .exec()
    .then(orders => {
      UserAddress.findOne({ user: userId })
        .exec()
        .then(userAddress => {
          const orderWithAddress = orders.map(order => {
            const address = userAddress.address.find(userAdd => order.address.equals(userAdd._id));
            return {
              _id: order._id,
              order: order.order,
              address,
              orderDate: order.orderDate,
              paymentType: order.paymentType,
              paymentStatus: order.paymentStatus,
              isOrderComleted: order.isOrderComleted,
            };
          });

          res.status(200).json({
            message: orderWithAddress,
          });
        })
        .catch(error => {
          return res.status(500).json({
            message:error.message
          });
        });
    })
    .catch(error => {
      res.status(500).json({
        error,
      });
    });
});

router.get('/', async (req, res) => {
  try {
    const orderItems = OrderItems.find({})
      .populate({
        path: 'order',
        model: 'Order',
        populate: {
          path: 'bill -_id',
          model: 'BillingDetail',
        },
      })
      .populate({
        path: 'order',
        model: 'Order',
        populate: {
          path: 'user -_id',
          model: 'User',
        },
      })
      .exec(function(err, docs) {
        res.status(200).json({ message: docs });
      });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const orderItems = OrderItems.findById({ _id: req.params.id })
      .populate({
        path: 'order',
        model: 'Order',
        populate: {
          path: 'bill -_id',
          model: 'BillingDetail',
        },
      })
      .populate({
        path: 'order',
        model: 'Order',
        populate: {
          path: 'user -_id',
          model: 'User',
        },
      })
      .exec(function(err, docs) {
        res.status(200).json({ message: docs });
      });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;
