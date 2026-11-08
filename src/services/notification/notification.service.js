// Pretend we sent an email or SMS here
export function notifyUser(order) {
  console.log(`Email to ${order.userId}: Your order ${order.orderId} is confirmed!`);
}
