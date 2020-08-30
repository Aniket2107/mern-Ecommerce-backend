const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductbyId = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err || !product)
        return res.status(400).json({ error: "No product found" });

      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) return res.status(400).json({ error: "Problem with image" });

    const { name, description, price, category, stock } = fields;

    if (!name || !description || !price || !category || !stock)
      return res.status(400).json({ error: "All fields are compulosry" });

    let product = new Product(fields);

    if (file.photo) {
      if (file.photo.size > 3000000)
        return res.status(400).json({ error: "Photo size too big" });

      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //Save to Db
    product.save((err, prodct) => {
      if (err || !prodct)
        return res.status(400).json({ error: "Error saving product in Db" });

      res.json(prodct);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.removeProduct = (req, res) => {
  let product = req.product;
  product.remove((err, delProdct) => {
    if (err || !delProdct)
      return res.status(400).json({ error: "Failed to delete product" });

    res.json({
      msg: "Product deleted sucessfully",
      delProdct,
    });
  });
};

exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) return res.status(400).json({ error: "Problem with image" });

    let product = req.product;
    product = _.extend(product, fields);

    if (file.photo) {
      if (file.photo.size > 3000000)
        return res.status(400).json({ error: "Photo size too big" });

      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //Save to Db
    product.save((err, prodct) => {
      if (err || !prodct)
        return res.status(400).json({ error: "Error updating product" });

      res.json(prodct);
    });
  });
};

exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err || !products)
        return res.status(400).json({ error: "Error finding products in Db" });

      res.json(products);
    });
};

exports.getAllUnqCategory = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if (err || !category)
      return res.status(400).json({ error: "No category found in Db" });

    res.json(category);
  });
};

exports.updateStock = (req, res, next) => {
  let opereation = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  Product.bulkWrite(opereation, {}, (err, products) => {
    if (err || !products)
      return res.status(400).json({ error: "Bulk operation failed" });
  });
  next();
};
