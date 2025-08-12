import { getDbConnection } from "@/lib/db";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const conn = await getDbConnection();

    // Load SQL from file
    const sqlPath = path.resolve("./src/lib/queries/dml/getAllExpenses.sql");
    const sql = fs.readFileSync(sqlPath, "utf-8");

    const [rows] = await conn.query(sql);
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET /api/expenses error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch expenses" }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      expenseName,
      estimatedCost,
      priority,
      status,
      color
    } = body;

    // Basic validation
    if (!expenseName || typeof expenseName !== "string") {
      return new Response(JSON.stringify({ error: "expenseName is required" }), { status: 400 });
    }
    // Add more validation if needed

    const conn = await getDbConnection();

    // Use parameterized query to avoid SQL injection
    const sql = `
      INSERT INTO expenses (expenseName, estimatedCost, priority, status, color)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await conn.execute(sql, [
      expenseName,
      Number(estimatedCost) || 0,
      priority || "Medium",
      status || "Pending",
      color || "#888888"
    ]);

    // result.insertId is the new expenseNo
    const newExpense = {
      expenseNo: result.insertId,
      expenseName,
      estimatedCost: Number(estimatedCost) || 0,
      priority,
      status,
      color,
    };

    return new Response(JSON.stringify(newExpense), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("POST /api/expenses error:", error);
    return new Response(JSON.stringify({ error: "Failed to add expense" }), { status: 500 });
  }
}
