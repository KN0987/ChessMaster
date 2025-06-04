import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../models/auth.model.js';
import { getUser } from '../models/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  const {email, password } = req.body;
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(email, hashedPassword, "traditional");
    res.status(201).json({ message: 'User created', user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(`Login attempt for email: ${email}`); // Debugging line
  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ error: 'Email not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Password is incorrect' });

    const userData = await getUser(user.uid);
    if (!userData) return res.status(404).json({ error: 'User data not found' });

    console.log(`User data retrieved: ${JSON.stringify(userData)}`); // Debugging line

    const token = jwt.sign({ uid: user.uid, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: userData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
