import { Router, Request, Response } from "express";
import { getConnection } from "../database";
import { QueryTupleResult } from "../types";
import { authMiddleware } from "../middleware/authMiddleware";
import { importQuotes } from "../controllers/importController";
import { uploadMiddleware } from "../middleware/uploadMiddleware";
const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const connection = await getConnection();
  const [quotes] = (await connection.query(
    "SELECT * FROM quotes"
  )) as QueryTupleResult;
  res.json(quotes);
});

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  const connection = await getConnection();
  const { text, author } = req.body;

  if (!text || !author) {
    res.status(400).json({ message: "Text and author are required." });
    return;
  }

  await connection.query("INSERT INTO quotes (text, author) VALUES (?, ?)", [
    text,
    author,
  ]);

  res.status(201).json({ message: "Quote created successfully." });
});

router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  const connection = await getConnection();
  const { id } = req.params;
  const { text, author } = req.body;

  if (!text || !author) {
    res.status(400).json({ message: "Text and author are required." });
    return;
  }

  await connection.query(
    "UPDATE quotes SET text = ?, author = ? WHERE id = ?",
    [text, author, id]
  );

  res.json({ message: "Quote updated successfully." });
});

router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  const connection = await getConnection();
  const { id } = req.params;

  await connection.query("DELETE FROM quotes WHERE id = ?", [id]);

  res.json({ message: "Quote deleted successfully." });
});

router.get("/topics", async (req: Request, res: Response) => {
  const { topics } = req.query;

  if (!topics) {
    res.status(400).json({ message: "No topics provided." });
    return;
  }

  const topicIds = Array.isArray(topics) ? topics : [topics];

  const connection = await getConnection();
  const [quotes] = (await connection.query(
    `SELECT quotes.*
     FROM quotes
     INNER JOIN quote_topic ON quotes.id = quote_topic.quoteId
     WHERE quote_topic.topicId IN (?)`,
    [topicIds]
  )) as QueryTupleResult;

  res.json(quotes);
});

router.get("/topics-by-title", async (req: Request, res: Response) => {
  const { titles } = req.query;

  if (!titles) {
    res.status(400).json({ message: "No topics provided." });
    return;
  }

  const topicTitles = Array.isArray(titles) ? titles : [titles];

  const connection = await getConnection();
  const [quotes] = (await connection.query(
    `SELECT quotes.*
     FROM quotes
     INNER JOIN quote_topic ON quotes.id = quote_topic.quoteId
     INNER JOIN topics ON topics.id = quote_topic.topicId
     WHERE topics.title IN (?)`,
    [topicTitles]
  )) as QueryTupleResult;

  res.json(quotes);
});

router.post(
  "/import",
  authMiddleware,
  uploadMiddleware.single("file"),
  importQuotes
);

export default router;
