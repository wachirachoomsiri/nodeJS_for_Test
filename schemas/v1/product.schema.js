const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "กรุณากรอกชื่อสินค้า"]
        },
        details: {
            type: String
        },
        price: {
            type: Number,
            min: [0, "ราคาสินค้าต้องมากกว่าหรือเท่ากับ 0"],
            required: [true, "กรุณากรอกราคาสินค้า"]
        },
        img: {
            type: String,
            required: [true, "กรุณากรอกลิงค์รูปภาพสินค้า"]
        },
        stock: {
            type: Number,
            min: [0, "จำนวนสินค้าต้องมากกว่าหรือเท่ากับ 0"],
            required: [true, "กรุณากรอกจำนวนสินค้า"]
        },
        seller: {
            userId: {
                type: mongoose.Types.ObjectId,
                required: true,
            },
        },
        createAt: {
            type: Date,
            default: Date.now
        },
        updateAt: {
            type: Date,
            default: Date.now
        },
    }
);

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
