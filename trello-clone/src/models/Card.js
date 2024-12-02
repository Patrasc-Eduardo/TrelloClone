import mongoose from "mongoose";

const CardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    listId: { type: mongoose.Schema.Types.ObjectId, ref: "List", required: true },
});

export default mongoose.models.Card || mongoose.model("Card", CardSchema);
