const express = require("express");
const router = express.Router();
const { order_create, order_delete, order_update, get_all_order, get_order_by_id, get_user_order } = require('../../controllers/orderControllers')
const { verifyRefreshToken,verifyAccessToken } = require('../../middlewares/auth');

router.post("/create", verifyRefreshToken, order_create);

//get my order
router.get("/me", verifyRefreshToken, get_user_order);

//update order
router.patch("/:id", verifyRefreshToken, order_update);

//get order by id
router.get("/:id", verifyRefreshToken, get_order_by_id);

//delete order
router.delete("/:id", verifyRefreshToken, order_delete);

//get all order
router.get("/", verifyAccessToken, get_all_order);

module.exports = router;
