const Order = require("../schemas/v1/order.schema");
const Product = require("../schemas/v1/product.schema");
const { Types } = require("mongoose");
const order_create = async (req, res) => {
    let { product } = req.body;

    let product_list = product.split(",");

    if (product_list.length == 0) {
        return res.status(400).json({ error: "กรุณาใส่รหัสสินค้าให้ถูกต้อง" });
    }

    const result = await Product.aggregate([
        {
            $match: {
                _id: {
                    $in: product_list.map((x) => {
                        try {
                            return new Types.ObjectId(x)
                        } catch (error) {
                            return null
                        }
                    })
                },
            },
        },
        {
            $project: {
                _id: 0,
                product_id: "$_id",
                price: 1,
                "seller.userId": 1,
            },
        },
        {
            $group: {
                _id: null,
                totalPrice: { $sum: "$price" },
                products: { $push: "$$ROOT" },
            },
        },
    ]);

    try {
        const newOrder = new Order({
            product: result[0].products,
            totalPrice: result[0].totalPrice,
            buyer: {
                userId: req.user.userId
            },
        })
        await newOrder.save();
        return res.status(200).json({ newOrder });
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: error?.errors || error });
    }
}

const order_delete = async (req, res) => {
    let { id } = req.params;
    try {
        let { deletedCount } = await Order.deleteOne({ _id: id, 'buyer.userId': req.user.userId });
        if (!deletedCount) {
            return res.status(404).json({
                status: "Not Found",
            });
        }
        return res.status(201).json({
            status: "success",
            message: "deleted Order in Datebase",
        });
    } catch (error) {
        return res.status(400).json({ error: error?.errors || error });
    }
}

const order_update = async (req, res) => {
    let { id } = req.params;

    let { product } = req.body;

    let product_list = product.split(",");

    if (product_list.length == 0) {
        return res.status(400).json({ error: "กรุณาใส่รหัสสินค้าให้ถูกต้อง" });
    }

    const result = await Product.aggregate([
        {
            $match: {
                _id: {
                    $in: product_list.map((x) => {
                        try {
                            return new Types.ObjectId(x)
                        } catch (error) {
                            return null
                        }
                    })
                },
            },
        },
        {
            $project: {
                _id: 0,
                product_id: "$_id",
                price: 1,
                "seller.userId": 1,
            },
        },
        {
            $group: {
                _id: null,
                totalPrice: { $sum: "$price" },
                products: { $push: "$$ROOT" },
            },
        },
    ]);

    try {
        const updatedOrder = await Order.updateOne({ _id: id, 'buyer.userId': req.user.userId },
            {
                $set: {
                    product: result[0].products,
                    totalPrice: result[0].totalPrice,
                },
                updateAt: Date.now()
            },
            { new: true, runValidators: true });
        console.log(updatedOrder)
        if (updatedOrder.matchedCount == 0) {
            return res.status(404).json({
                status: "Not Found",
            });
        }
        return res.status(200).json({
            status: "success",
            message: "updated product in Datebase",
        });
    } catch (error) {
        return res.status(400).json({ error: error?.errors || error });
    }
}

const get_order_by_id = async (req, res) => {
    let { id } = req.params;
    try {
        let order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({
                status: "Not Found",
            });
        }
        return res.status(200).json({
            status: "success",
            data: {
                order: order
            },
        });
    } catch (error) {
        return res.status(400).json({ error: error?.errors || error });
    }
}

const get_all_order = async (req, res) => {
    try {
        return res.status(200).send({
            status: "success",
            data: {
                order: await Order.find()
            },
        });
    } catch (error) {
        return res.status(400).json({ error: error?.errors || error });
    }
}

const get_user_order = async (req, res) => {
    try {
        let order = await Order.find({ 'buyer.userId': req.user.userId });
        if (!order) {
            return res.status(404).json({
                status: "Not Found",
            });
        }
        return res.status(200).json({
            status: "success",
            data: {
                order: order
            },
        });
    } catch (error) {
        return res.status(400).json({ error: error?.errors || error });
    }
}

module.exports = {
    order_create,
    order_delete,
    order_update,
    get_order_by_id,
    get_all_order,
    get_user_order
}