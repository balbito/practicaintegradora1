import { cartModel } from "../../models/carts.model.js";
import { productModel } from "../../models/products.model.js";


class ProductDao {
  async getProducts() {
    return await productModel.find();
  }
  
  async getProductById(_id) {
    return await productModel.findById(_id);
  }

  async createProduct(product) {
    return await productModel.create(product);
  }

  async updateProduct(_id, product) {
    return await productModel.findByIdAndUpdate({_id}, product);
  }

  async deleteProduct(_id) {

    await cartModel.deleteMany({ product: _id });
    
    return await productModel.findByIdAndDelete({_id});
  }

}

export default new ProductDao();
