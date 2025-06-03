import pool from '../db.js';

export const findUserByEmail = async (email) => {
  const res = await pool.query('SELECT * FROM auth WHERE email = $1', [email]);
  return res.rows[0];
};

export const createUser = async (email, hashedPassword, authMethod) => {
  const res = await pool.query(
    'INSERT INTO auth (email, password, auth_method) VALUES ($1, $2, $3) RETURNING *',
    [email, hashedPassword, authMethod]
  );
  return res.rows[0];
};