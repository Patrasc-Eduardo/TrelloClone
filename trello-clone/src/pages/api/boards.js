import dbConnect from "@/utils/db";
import Board from "@/models/Board";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const boards = await Board.find();
    res.status(200).json({ success: true, data: boards });
  } else if (req.method === "POST") {
    const board = await Board.create(req.body);
    res.status(201).json({ success: true, data: board });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
