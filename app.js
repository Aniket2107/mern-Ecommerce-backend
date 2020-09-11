const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const PORT = process.env.PORT || 5000;

//Routes
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const categoryRoute = require("./routes/category");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/Stripepayments");
const btRoute = require("./routes/btpayments");
const contactRoute = require("./routes/contact");

//dotenv config
dotenv.config();

//Connect mongoDb
mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  () => console.log("Db connected")
);

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//Routes
app.use("/api", authRoute);
app.use("/api", userRoute);
app.use("/api", categoryRoute);
app.use("/api", productRoute);
app.use("/api", orderRoute);
app.use("/api", stripeRoute);
app.use("/api", btRoute);
app.use("/api", contactRoute);

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
