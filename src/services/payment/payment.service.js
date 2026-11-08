// Pretend we called a payment gateway here
export function chargeCustomer(order) {
  return { ...order, paymentId: 'PAY-' + Date.now() };
}
