import mongoose from "mongoose";

const ListSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cards: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Card", // Reference the "Card" schema
        },
    ],
});

export default mongoose.models.List || mongoose.model("List", ListSchema);
