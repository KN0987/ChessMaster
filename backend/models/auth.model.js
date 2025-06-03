import pool from "../db.js";

export const findUserByEmail = async (email) => {
  const res = await pool.query("SELECT * FROM auth WHERE email = $1", [email]);
  return res.rows[0];
};

export const createUser = async (email, hashedPassword, authMethod) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insert into auth table
    const authRes = await client.query(
      "INSERT INTO auth (email, password, auth_method) VALUES ($1, $2, $3) RETURNING *",
      [email, hashedPassword, authMethod]
    );

    const uid = authRes.rows[0].uid;
    const dateJoined = new Date().toISOString().split("T")[0];
    const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000);
    const displayName = `Master#${uid.slice(0, 8)}${randomDigits}`;

    // Insert into users table
    await client.query(
      `INSERT INTO user_data (uid, name, created_at)
       VALUES ($1, $2, $3)`,
      [uid, displayName, dateJoined]
    );

    await client.query("COMMIT");
    return authRes.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error creating user, rolled back:", err);
    throw err;
  } finally {
    client.release();
  }
};
