import { Router } from "express";
import productsDao from "../daos/dbManager/products.dao.js";

const router = Router();

router.get("/realTimeProducts", async (req, res) => {
  const products = await productsDao.getProducts();
  res.render("realTimeProducts", {
    products,
    title: "Mongoose Products"
  });
});

router.get("/chat", (req, res) => {
    res.render("chat", {
        title: "chat"
    });
});

export default router;