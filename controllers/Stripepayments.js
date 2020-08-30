const stripe = require("stripe")(
  "sk_test_51HLCNiHMuRPwFBy2vTIx8wFgQU8BukB20SVj05IIIWGzIZ5cUlcO7ubKPjBuE5vHffQagtSqbseXSBj2xtnR9My3002wMWFjZm"
);
const uuid = require("uuid/v4");

exports.makeStripePayment = (req, res) => {
  const { products, token } = req.body;
  //   console.log(products);

  let amount = 0;
  products.map((p) => {
    amount += p.price;
  });

  const idempotencyKey = uuid();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((custmer) => {
      stripe.charges
        .create(
          {
            amount: amount * 100,
            currency: "usd",
            customer: custmer.id,
            receipt_email: token.email,
            shipping: {
              name: token.card.name,
              country: token.card.country,
            },
          },
          { idempotencyKey }
        )
        .then((result) => res.status(400).json(result))
        .catch((err) => console.log(err));
    });
};
