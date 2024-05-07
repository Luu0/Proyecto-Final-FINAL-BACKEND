export default class productDto{
  constructor(product){
    this.title = product.title;
    this.descripcion=product.title;
    this.price=product.price;
    this.thumbnail=product.thumbnail;
    this.stock=product.stock;
  }
}