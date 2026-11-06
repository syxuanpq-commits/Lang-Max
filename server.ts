import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to sanitize flashcard data safely
function sanitizeCardData(raw: any) {
  const id = raw?.id && typeof raw.id === 'string' && raw.id.trim()
    ? raw.id.trim()
    : `card-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const deckId = raw?.deckId && typeof raw.deckId === 'string' && raw.deckId.trim()
    ? raw.deckId.trim()
    : 'deck-oxford-core';

  const word = String(raw?.word || 'Vocabulary').trim();
  const phonetic = String(raw?.phonetic || '').trim() || '/.../';
  const partOfSpeech = String(raw?.partOfSpeech || 'n.').trim();
  const definition = String(raw?.definition || 'Definition of ' + word).trim();
  const vietnamese = String(raw?.vietnamese || 'Định nghĩa của ' + word).trim();
  const exampleEn = String(raw?.exampleEn || `She used the word "${word}" in a sentence.`).trim();
  const exampleVi = String(raw?.exampleVi || `Cô ấy đã sử dụng từ "${word}" trong một câu.`).trim();

  const collocations = Array.isArray(raw?.collocations)
    ? raw.collocations.map((c: any) => String(c).trim()).filter(Boolean)
    : [];

  const synonyms = Array.isArray(raw?.synonyms)
    ? raw.synonyms.map((s: any) => String(s).trim()).filter(Boolean)
    : [];

  const antonyms = Array.isArray(raw?.antonyms)
    ? raw.antonyms.map((a: any) => String(a).trim()).filter(Boolean)
    : [];

  const masteryLevel = typeof raw?.masteryLevel === 'number'
    ? Math.max(0, Math.min(2, Math.floor(raw.masteryLevel)))
    : 0;

  return {
    id,
    deckId,
    word,
    phonetic,
    partOfSpeech,
    definition,
    vietnamese,
    exampleEn,
    exampleVi,
    collocations,
    synonyms,
    antonyms,
    masteryLevel,
    lastReviewed: raw?.lastReviewed || new Date().toISOString(),
    audioUrl: raw?.audioUrl
  };
}

// In-memory data store for realtime cross-device state
let initialData: { decks: any[]; flashcards: any[]; students: any[] } = {
  decks: [],
  flashcards: [],
  students: []
};

try {
  const dataPath = path.resolve(__dirname, 'src', 'data', 'initialData.json');
  if (fs.existsSync(dataPath)) {
    initialData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  }
} catch (err) {
  console.warn('Notice: Could not load initialData.json, using fallback store:', err);
}

let flashcards = Array.isArray(initialData.flashcards) ? initialData.flashcards.map(sanitizeCardData) : [];
let decks = Array.isArray(initialData.decks) ? [...initialData.decks] : [];
let students = Array.isArray(initialData.students) ? [...initialData.students] : [];

// API: Get initial or synced data
app.get('/api/data', (req, res) => {
  res.json({
    success: true,
    flashcards,
    decks,
    students
  });
});

// API: Flashcards
app.put('/api/flashcards/:id', (req, res) => {
  const { id } = req.params;
  const updatedCard = sanitizeCardData(req.body);
  flashcards = flashcards.map(c => c.id === id ? updatedCard : c);
  res.json({ success: true, card: updatedCard });
});

app.post('/api/flashcards/import', (req, res) => {
  const { newCards, targetDeckId } = req.body;
  if (Array.isArray(newCards)) {
    const sanitized = newCards.map(sanitizeCardData);
    flashcards = [...sanitized, ...flashcards];
    // update deck count
    decks = decks.map(d => {
      if (d.id === targetDeckId) {
        return { ...d, cardCount: d.cardCount + sanitized.length };
      }
      return d;
    });
  }
  res.json({ success: true, count: flashcards.length });
});

app.delete('/api/flashcards/:id', (req, res) => {
  const { id } = req.params;
  flashcards = flashcards.filter(c => c.id !== id);
  res.json({ success: true });
});

// API: Decks
app.post('/api/decks', (req, res) => {
  const { newDeck } = req.body;
  if (newDeck) {
    decks = [newDeck, ...decks];
  }
  res.json({ success: true, deck: newDeck });
});

app.delete('/api/decks/:id', (req, res) => {
  const { id } = req.params;
  const preserveCards = req.query.preserveCards === 'true';
  decks = decks.filter(d => d.id !== id);
  if (preserveCards) {
    flashcards = flashcards.map(c => c.deckId === id ? { ...c, deckId: 'unassigned' } : c);
  } else {
    flashcards = flashcards.filter(c => c.deckId !== id);
  }
  res.json({ success: true, preserved: preserveCards });
});

// API: Students
app.post('/api/students', (req, res) => {
  const { student } = req.body;
  if (student) {
    const exists = students.some(s => s.id === student.id);
    if (exists) {
      students = students.map(s => s.id === student.id ? student : s);
    } else {
      students = [student, ...students];
    }
  }
  res.json({ success: true, student });
});

app.delete('/api/students/:id', (req, res) => {
  const { id } = req.params;
  students = students.filter(s => s.id !== id);
  res.json({ success: true });
});

// API: Register password
app.post('/api/auth/register-password', (req, res) => {
  const { email, password, name } = req.body;
  if (email) {
    students = students.map(s => 
      s.email.toLowerCase() === email.toLowerCase()
        ? { ...s, password, hasPassword: true, name: name || s.name }
        : s
    );
  }
  res.json({ success: true });
});

// Setup Vite middleware or static serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LangMax Full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
