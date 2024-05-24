import Handlebars from 'handlebars';

Handlebars.registerHelper('multiply', function(price, quantity) {
  return price * quantity;
});

Handlebars.registerHelper('calculateTotal', function(products) {
  let total = 0;
  for (const item of products) {
    total += item.product.price * item.quantity;
  }
  return total;
});


export default Handlebars;
