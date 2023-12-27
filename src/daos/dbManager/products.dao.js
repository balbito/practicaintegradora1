import { cartModel } from "../../models/carts.model.js";
import { productModel } from "../../models/products.model.js";


class ProductDao {
  async getAllProducts({ limit = 10, page = 1, sort, query } = {}) {
    try {
      let filter = {};

      // filtro basado en el query
      if (query) {
        const [field, value] = query.split(":");
        filter[field] = value;
      }

      const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sort ? { price: sort === "asc" ? 1 : -1 } : undefined,
      };

      const response = await productModel.paginate(filter, options);

      return response;
    } catch(error) {
      throw new Error("Error fetching products: " + error.message);
    }
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
