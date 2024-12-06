const Product = require("../schemas/v1/product.schema");

const product_add = async (req, res) => {
    let { name, details, price, img, stock } = req.body;
    try {
        const newProduct = new Product({
            name: name,
            details: details,
            price: price,
            img: img,
            stock: stock,
            seller: {
                userId: req.user.userId,
            },
        })
        await newProduct.save();
        return res.status(201).json({
            status: "success",
            message: "Product added to Datebase",
            data: {
                seller: {
                    userId: req.user.userId,
                },
                product_id: newProduct._id
            },
        });
    } catch (error) {
        return res.status(400).json({ error: error?.errors || error });
    }
}

const product_delete = async (req, res) => {
    let { id } = req.params;
    try {
        let { deletedCount } = await Product.deleteOne({ _id: id, 'seller.userId': req.user.userId });

        if (deletedCount == 0) {
            return res.status(404).json({
                status: "Not Found",
            });
        }
        return res.status(201).json({
            status: "success",
            message: "deleted product in Datebase",
        });
    } catch (error) {
        return res.status(400).json({ error: error?.errors || error });
    }
}

const product_update = async (req, res) => {
    let { id } = req.params;
    let updateData = req.body;
    try {
        const updatedProduct = await Product.updateOne({
            _id: id,
            'seller.userId': req.user.userId,
        },
            { $set: updateData, updateAt: Date.now() },
            { new: true, runValidators: true });
        if (!updatedProduct) {
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

const get_product_by_id = async (req, res) => {
    let { id } = req.params;
    try {
        let product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                status: "Not Found",
            });
        }
        return res.status(200).json({
            status: "success",
            data: {
                product: product
            },
        });
    } catch (error) {
        return res.status(400).json({ error: error?.errors || error });
    }
}

const get_all_product = async (req, res) => {
    try {
        return res.status(200).send({
            status: "success",
            data: {
                product: await Product.find()
            },
        });
    } catch (error) {
        return res.status(400).json({ error: error?.errors || error });
    }
}


module.exports = {
    product_add,
    product_delete,
    product_update,
    get_product_by_id,
    get_all_product
}