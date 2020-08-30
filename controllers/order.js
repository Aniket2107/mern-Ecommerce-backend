const { Order, ProductCart } = require("../models/order");

exports.getOrderbyId = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err || !order)
        return res.status(400).json({ error: "No order found in Db" });

      req.order = order;
      next();
    });
};

exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((err, order) => {
    if (err || !order)
      return res.status(400).json({ error: "Error creating order" });

    res.json(order);
  });
};

exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name")
    .exec((err, orders) => {
      if (err || !orders)
        return res.status(400).json({ error: "No orders foumd in Db" });

      res.json(orders);
    });
};

exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValue);
};

exports.updateStatus = () => {
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err || !order)
        return res.status(400).json({ error: "Cannot update order status" });

      res.json(order);
    }
  );
};
