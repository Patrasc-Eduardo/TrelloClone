import mongoose from "mongoose";

const BoardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lists: [{ type: mongoose.Schema.Types.ObjectId, ref: "List" }],
});

export default mongoose.models.Board || mongoose.model("Board", BoardSchema);