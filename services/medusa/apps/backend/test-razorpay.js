require("dotenv").config()

const Razorpay = require("razorpay")

console.log("Node:", process.version)

console.log({
  key: JSON.stringify(process.env.RAZORPAY_KEY_ID),
  secret: JSON.stringify(process.env.RAZORPAY_KEY_SECRET),
})

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

;(async () => {
  try {
    const order = await razorpay.orders.create({
      amount: 100,
      currency: "INR",
      receipt: "medusa-test",
    })

    console.log(order)
  } catch (e) {
    console.dir(e, { depth: null })
  }
})()
