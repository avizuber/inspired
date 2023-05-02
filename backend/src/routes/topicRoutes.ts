import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { getConnection } from "../database";
import { QueryTupleResult } from "../types";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const connection = await getConnection();
  const [topics] = (await connection.query(
    "SELECT * FROM topics"
  )) as QueryTupleResult;
  res.json(topics);
});

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  const connection = await getConnection();
  const { title } = req.body;

  if (!title) {
    res.status(400).json({ message: "Title is required." });
    return;
  }

  const id = uuidv4();

  await connection.query("INSERT INTO topics (id, title) VALUES (?, ?)", [
    id,
    title,
  ]);

  res.status(201).json({ message: "Topic created successfully.", id });
});

router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  const connection = await getConnection();
  const { id } = req.params;
  const { title } = req.body;

  if (!title) {
    res.status(400).json({ message: "Title is required." });
    return;
  }

  await connection.query("UPDATE topics SET title = ? WHERE id = ?", [
    title,
    id,
  ]);

  res.json({ message: "Topic updated successfully." });
});

router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  const connection = await getConnection();
  const { id } = req.params;

  await connection.query("DELETE FROM topics WHERE id = ?", [id]);

  res.json({ message: "Topic deleted successfully." });
});

export default router;
