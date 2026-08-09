require("dotenv").config()

const Razorpay = require("razorpay")

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

async function run() {
  const order = await razorpay.orders.create({
    amount: 100,
    currency: "INR",
    receipt: "simple",
  })

  console.log(order)
}

run().catch(console.error)
