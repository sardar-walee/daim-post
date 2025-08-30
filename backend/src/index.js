
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());

// Utility
function sign(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Bad token' });
  }
}

// Health
app.get('/health', (_, res) => res.json({ ok: true }));

// Auth
app.post('/auth/signup', async (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string().min(6) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);
  const { email, password } = parsed.data;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(400).json({ error: 'Email already in use' });
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hash } });
  res.json({ token: sign(user) });
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ token: sign(user) });
});

// Posts
app.get('/posts', auth, async (req, res) => {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { id: true, email: true } } }
  });
  res.json(posts);
});

app.post('/posts', auth, async (req, res) => {
  const schema = z.object({ content: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);
  const post = await prisma.post.create({
    data: { content: parsed.data.content, authorId: req.user.id }
  });
  res.json(post);
});

// AI Assistant (simple local fixer; replace multiple spaces, trim)
app.post('/ai/fix', async (req, res) => {
  const { text } = req.body || {};
  if (typeof text !== 'string' || !text.trim()) return res.status(400).json({ error: 'text required' });
  // Simple heuristics; integrate OpenAI later if OPENAI_API_KEY is set
  let fixed = text.replace(/\s+/g, ' ').trim();
  // Capitalize first letter if English-like
  if (/^[a-z]/.test(fixed)) fixed = fixed[0].toUpperCase() + fixed.slice(1);
  res.json({ original: text, fixed, provider: 'local' });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
