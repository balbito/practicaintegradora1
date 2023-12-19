import { cartModel } from "../../models/carts.model.js";
import { productModel } from "../../models/products.model.js";

class CartDao {
    async getAllCarts() {
        return await cartModel.find();
    }

    async createCart() {
        return await cartModel.create({})
    }

    async getCartById(id) {
        const cart = await cartModel.findById(id);
        if (!cart) {
            throw new Error("carrito no encontrado")
        } else {
            return cart;
        }
    }

    async addProductCart(productId, cartId) {
        //Obtengo el carrito por su ID
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }

        // Obtengo el producto por ID
        const product = await productModel.findById(productId);
        if(!product) {
            throw new Error ("Producto no encontrado");
        }

        // Verifico si el producto ya esta en el carrito
        const producExist = cart.products.find((product) => product.prodId.equals(productId));

        // Actualizo la cantidad del producto en el carrito
        if(producExist) {
            producExist.quantity++;
        } else {
            // Si el producto no esta en el carrito lo agrego con una cantidad inicial de 1
            cart.products.push({ productId: productId, quantity: 1 });
        }

        // Guardo y deuelvo el carrito actualizado
        return await cart.save();
     }
}
export default new CartDao();