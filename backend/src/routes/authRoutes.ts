import { Router, Request, Response } from "express";
import { getConnection } from "../database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Admin, QueryTupleResult } from "../types";
import { RowDataPacket } from "mysql2";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const connection = await getConnection();
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required." });
    return;
  }

  const [existingAdminResults] = (await connection.query(
    "SELECT * FROM admins WHERE email = ?",
    [email]
  )) as QueryTupleResult;
  const existingAdmin = existingAdminResults as RowDataPacket[];

  if (existingAdmin.length > 0) {
    res.status(400).json({ message: "Admin with this email already exists." });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await connection.query(
    "INSERT INTO admins (email, passwordHash) VALUES (?, ?)",
    [email, passwordHash]
  );

  res.status(201).json({ message: "Admin registered successfully." });
});

router.post("/login", async (req: Request, res: Response) => {
  const connection = await getConnection();
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required." });
    return;
  }

  const [adminResults] = (await connection.query(
    "SELECT * FROM admins WHERE email = ?",
    [email]
  )) as QueryTupleResult;
  const admin = adminResults as RowDataPacket[];

  if (admin.length === 0) {
    res.status(400).json({ message: "Admin with this email does not exist." });
    return;
  }

  const passwordMatch = await bcrypt.compare(
    password,
    (admin[0] as Admin).passwordHash
  );

  if (!passwordMatch) {
    res.status(400).json({ message: "Invalid email or password." });
    return;
  }

  const token = jwt.sign(
    { adminId: (admin[0] as Admin).id },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );

  res.status(200).json({ message: "Logged in successfully.", token });
});

export default router;
