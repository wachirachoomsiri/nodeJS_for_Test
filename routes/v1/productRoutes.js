const express = require("express");
const router = express.Router();
const { product_add, product_delete, product_update, get_product_by_id, get_all_product } = require('../../controllers/productControllers')
const { verifyRefreshToken } = require('../../middlewares/auth');
//add product
router.post("/add", verifyRefreshToken, product_add);

//update product
router.patch("/:id", verifyRefreshToken, product_update);

//get product by id
router.get("/:id", get_product_by_id);

//delete product
router.delete("/:id", verifyRefreshToken, product_delete);

//get all product
router.get("/", get_all_product);

module.exports = router;