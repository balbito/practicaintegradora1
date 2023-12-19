import { Schema, model } from 'mongoose';

const cartSchema = new Schema({

    products: [{

        productId: { type: Schema.Types.ObjectId, required: true, ref: "products" },

        quantity: { type: Number, required: true, default: 1},

    }],

});

const cartModel = model("carts", cartSchema);

export { cartModel };