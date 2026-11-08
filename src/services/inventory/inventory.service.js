const stock = { P100: 10, P200: 50 }; // productId: quantity

export function reduceStock(productId, quantity) {
  stock[productId] = (stock[productId] || 0) - quantity;
  console.log('Stock now:', stock);
}
