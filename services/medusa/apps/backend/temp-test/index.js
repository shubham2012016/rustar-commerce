require("dotenv").config()

const Razorpay = require("razorpay")

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

async function run() {
  try {
    const order = await razorpay.orders.create({
      amount: 100,
      currency: "INR",
      receipt: "temp",
    })

    console.log(order)
  } catch (e) {
    console.dir(e, { depth: null })
  }
}

run()
