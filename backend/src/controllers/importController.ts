import { Request, Response } from "express";
import XLSX from "xlsx";
import { getConnection } from "../database";
import { Quote } from "../types";
import { v4 as uuidv4 } from "uuid";

export const importQuotes = async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded." });
    return;
  }

  const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const data = XLSX.utils.sheet_to_json<Quote>(worksheet, { header: "A" });

  if (!data || data.length === 0) {
    res.status(400).json({ message: "No data found in the uploaded file." });
    return;
  }

  const connection = await getConnection();
  const quotes = data.map((quote) => {
    const id = uuidv4();
    const createdAt = new Date();
    const updatedAt = new Date();
    return [id, quote.text, quote.author, createdAt, updatedAt];
  });

  await connection.query(
    "INSERT INTO quotes (id, text, author, createdAt, updatedAt) VALUES ?",
    [quotes]
  );

  res.status(201).json({ message: "Quotes successfully imported." });
};
