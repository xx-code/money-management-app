import sqlite3 from 'sqlite3';
import { open } from "sqlite";

sqlite3.verbose();

export async function open_database(db_file_name: string) {
  return open({
    filename: db_file_name,
    driver: sqlite3.Database
  })
}

