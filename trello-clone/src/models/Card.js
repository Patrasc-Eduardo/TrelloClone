import mongoose from "mongoose";

const CardSchema = new mongoose.Schema({
    listId: { type: mongoose.Schema.Types.ObjectId, ref: "List", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
});

export default mongoose.models.Card || mongoose.model("Card", CardSchema);
