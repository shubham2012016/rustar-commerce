import Razorpay from "razorpay"

console.log("================================")
console.log({
  key: JSON.stringify(process.env.RAZORPAY_KEY_ID),
  secret: JSON.stringify(process.env.RAZORPAY_KEY_SECRET),
  keyLength: process.env.RAZORPAY_KEY_ID?.length,
  secretLength: process.env.RAZORPAY_KEY_SECRET?.length,
})
console.log("================================")

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export default razorpay
