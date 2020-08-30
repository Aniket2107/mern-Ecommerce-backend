var braintree = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "hxvcz4ytykq5vm3s",
  publicKey: "wjdbgvdxs222wpfx",
  privateKey: "974c34f7dd7c505b082f1cf161a8201d",
});

exports.generateToken = (req, res) => {
  gateway.clientToken.generate({}, function (err, response) {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.send(response);
    }
  });
};

exports.processPayment = (req, res) => {
  let nonceFromTheClient = req.body.paymentMethodNonce;

  let amountFromTheClient = req.body.amount;

  gateway.transaction.sale(
    {
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    function (err, result) {
      if (err) {
        return res.status(500).send(err);
      } else {
        return res.send(result);
      }
    }
  );
};
