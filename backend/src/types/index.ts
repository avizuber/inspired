import { RowDataPacket, FieldPacket, OkPacket, ResultSetHeader } from "mysql2";

export interface QueryResult {
  results:
    | RowDataPacket[]
    | RowDataPacket[][]
    | OkPacket
    | OkPacket[]
    | ResultSetHeader;
  fields: FieldPacket[];
}

export type QueryTupleResult = [
  RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader,
  FieldPacket[]
];

export interface Admin {
  id: number;
  email: string;
  passwordHash: string;
}

export interface Topic {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Quote {
  id: number;
  text: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}
