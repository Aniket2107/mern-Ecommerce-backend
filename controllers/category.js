const Category = require("../models/category");

exports.getCategorybyId = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err) return res.status(400).json({ error: "Error in category" });

    if (!category) {
      return res.status(400).json({ error: "No category found in db" });
    }
    req.category = category;
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);

  category.save((err, category) => {
    if (err) {
      return res.status(400).json({ error: "Not able to save in Db" });
    }

    res.json({ category });
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategories = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err) return res.status(400).json({ error: "Error finding category" });

    if (!categories)
      return res.status(400).json({ error: "No category found in Db" });

    res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;

  category.save((err, updatedCategory) => {
    if (err || !updatedCategory)
      return res.status(400).json({ error: "Error updating the category" });

    res.json(updatedCategory);
  });
};

exports.removeCategory = (req, res) => {
  const category = req.category;

  category.remove((err, category) => {
    if (err || !category)
      return res.status(400).json({ error: "Error deleting the category" });

    res.json({
      msg: "Category deleted sucessfully",
      DeletedCat: { category },
    });
  });
};
