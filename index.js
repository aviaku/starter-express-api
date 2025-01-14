const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { readdirSync } = require("fs");
const fs = require("fs");
const dotenv = require("dotenv");
const serverless = require("serverless-http");
const userRoute = require("./routes/user");
const stripe = require("stripe")(
  "sk_test_51M6UVmSA1CggwQAXcM5Pd85IGKpJbvipXI3Vc8mr466lFEH49hXU5nqjcvnStjeRQveIk2wzghrUNrulpMxoAem700CCMkWZbz"
);
const paypal = require("paypal-rest-sdk");
// const tempDirectory = "/tmp/assets/images";

// if (!fs.existsSync(tempDirectory)) {
//   fs.mkdirSync(tempDirectory);
// }

dotenv.config();

// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: "2022-08-01",
// });

const app = express();
app.use(express.json());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

paypal.configure({
  mode: process.env.PAYPAL_MODE,
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

app.get("/hello", async (req, res) => {
  res.send({ msg: "Hello World" });
});

// app.get("/config", (req, res) => {
//   res.send({
//     publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
//   });
// });

// app.post("/create-payment-intent", async (req, res) => {
//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       currency: "EUR",
//       amount: 1999,
//       automatic_payment_methods: { enabled: true },
//     });

//     // Send publishable key and PaymentIntent details to client
//     res.send({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (e) {
//     return res.status(400).send({
//       error: {
//         message: e.message,
//       },
//     });
//   }
// });

// Start the cron job
require("./crons/auctionCron.js");
require("./crons/paymentCron.js");
require("./crons/eventCron.js");

//routes
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));
// app.use('/', userRoute);

//database
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true, // Use new URL parser
    useUnifiedTopology: true, // Use new Server Discovery and Monitoring engine
    // user: username, // MongoDB username
    // pass: password, // MongoDB password
    // authSource: "$external", // Auth source
    // authMechanism: "MONGODB-AWS", // Auth mechanism
  })
  .then(() => console.log("database connected successfully"))
  .catch((err) => console.log("error connecting to mongodb", err));

// if (process.env.ENVIRONMENT === "production") {
//   exports.handler = serverless(app);
// } else {
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}..`);
});
// }
