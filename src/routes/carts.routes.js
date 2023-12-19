import { Router } from 'express';
import cartsDao from '../daos/dbManager/carts.dao.js';
import productsDao from '../daos/dbManager/products.dao.js';

const router = Router();

router.get("/", async (req, res) => {
    try {
      let carts = await cartsDao.getAllCarts();
      res.json({
        data: carts,
        message: "carrito list"
      });
    } catch (error) {
      console.log(error);
      res.json({
        error,
        message: "error de carrito"
      });
    }
});

router.post("/", async (req, res) => {
    try {
      let cart = await cartsDao.createCart();

      res.json({
        cart,
        status: "succcess",
      });
    } catch(error) {
      res.json({
        error,
        message: "error al crear el carrito"
      });
    }
});

router.get("/:cid", async (req, res) => {
    try {
        let cid = req.params.cid;
        let cart = await cartsDao.getCartById(cid);
        res.json({
            cart,
            status: "success",
        });
    } catch (error) {
       res.json({
          error,
          message: "Error con el id del carrito"
       });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try{
      let cid = req.params.cid;
      let pid = req.params.pid
      let respuesta = await cartsDao.addProductCart(cid, pid);
      res.json({
        respuesta,
        status: "success",
      });
    } catch(error) {
       res.json({
        error,
        message: "error agregando el producto al carrito",
       });
    }
});

export default router;