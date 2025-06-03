import pool from "../db.js";

export const getUser = async (uid) => {
    try {
      const client = await pool.connect();
      const userRes = await client.query("SELECT * FROM user_data WHERE uid = $1", [uid]);
      client.release();
  
      if (userRes.rows.length === 0) return null;
      return userRes.rows[0];
    } catch (err) {
      throw err;
    }
  };