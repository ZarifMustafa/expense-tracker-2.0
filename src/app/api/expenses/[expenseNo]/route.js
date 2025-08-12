import { getDbConnection } from "@/lib/db";

const allowedFields = ["estimatedCost", "priority", "status", "expenseName", "color"];

export async function PATCH(req, { params }) {
  const { expenseNo } = params;
  try {
    const body = await req.json();

    // Validate incoming field and value
    const { field, value } = body;
    if (!allowedFields.includes(field)) {
      return new Response(
        JSON.stringify({ error: "Invalid field to update" }),
        { status: 400 }
      );
    }

    const conn = await getDbConnection();

    // Prepare SQL with parameterized query to avoid injection
    const sql = `UPDATE expenses SET \`${field}\` = ? WHERE expenseNo = ?`;
    await conn.execute(sql, [value, expenseNo]);

    // Return updated expense (optional: fetch from DB or just return new value)
    return new Response(
      JSON.stringify({ expenseNo, field, value }),
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/expenses/:expenseNo error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update expense" }),
      { status: 500 }
    );
  }
}
