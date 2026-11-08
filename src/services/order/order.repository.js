// In-memory "database". Swap this file for a real database later;
// nothing else needs to change.
const orders = {};

export const orderRepository = {
  save(order) {
    orders[order.orderId] = order;
  },

  findById(orderId) {
    return orders[orderId];
  },
};
