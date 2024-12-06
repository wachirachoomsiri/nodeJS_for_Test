const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    product: [
      {
        price: { type: Number, required: true },
        product_id: { type: mongoose.Types.ObjectId, required: true },
        seller: {
          userId: {
            type: mongoose.Types.ObjectId,
            required: true,
          },
        },
      }
    ],
    totalPrice: { type: Number, required: true },
    buyer: {
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
  },
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
