const User = require("../models/user");
const Order = require("../models/order");

exports.getUserbyId = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err) return res.status(400).json({ error: "Error connecting DB" });

    if (!user)
      return res.status(400).json({ error: "No user found by such id" });

    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  //TODO: for password

  //For frontend dont show password and certain unecesary values..
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;

  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err)
        return res.status(400).json({ error: "Error to modify put req" });

      if (!user)
        return res.status(400).json({ error: "No user found to modify" });

      user.salt = undefined;
      user.encry_password = undefined;
      user.createdAt = undefined;
      user.updatedAt = undefined;

      res.json({ user });
    }
  );
};

exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err)
        return res.status(400).json({ error: "Error findind purchase list" });

      if (!order) return res.status(400).json({ error: "No order found.." });

      return res.json(order);
    });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];
  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transacition_id: req.body.order.transacition_id,
    });
  });

  //Store in DB
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true },
    (err, purchases) => {
      if (err)
        return res.status(400).json({ error: "Unable to save purchase list" });
    }
  );

  next();
};
