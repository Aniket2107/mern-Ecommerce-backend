const Contact = require("../models/contact");

exports.postForm = (req, res) => {
  const data = new Contact(req.body);
  data.save((err, response) => {
    if (err) return res.status(400).json({ error: "All fields are required" });

    res.json({ response });
  });
};
