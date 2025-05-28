const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

const BIN_ID = '6832cc128561e97a501b3942';
const API_KEY = '$2a$10$tSLa00PWcTbhaMWpfPSDMuxyKuGc1s7brkzaQxGClVGAe7TseOVRq';
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// ফন্ট ম্যাপিং (font1)
const font1Map = {
  a: '𝗮', b: '𝗯', c: '𝗰', d: '𝗱', e: '𝗲', f: '𝗳', g: '𝗴', h: '𝗵', i: '𝗶',
  j: '𝗷', k: '𝗸', l: '𝗹', m: '𝗺', n: '𝗻', o: '𝗼', p: '𝗽', q: '𝗾', r: '𝗿',
  s: '𝘀', t: '𝘁', u: '𝘂', v: '𝘃', w: '𝘄', x: '𝘅', y: '𝘆', z: '𝘇',
  A: '𝗔', B: '𝗕', C: '𝗖', D: '𝗗', E: '𝗘', F: '𝗙', G: '𝗚', H: '𝗛', I: '𝗜',
  J: '𝗝', K: '𝗞', L: '𝗟', M: '𝗠', N: '𝗡', O: '𝗢', P: '𝗣', Q: '𝗤', R: '𝗥',
  S: '𝗦', T: '𝗧', U: '𝗨', V: '𝗩', W: '𝗪', X: '𝗫', Y: '𝗬', Z: '𝗭',
  ' ': ' ', '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱',
  '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
};

function applyFont1(text) {
  return text.split('').map(ch => font1Map[ch] || ch).join('');
}

// স্পেশাল সিম্বল ফিল্টার
function cleanText(text) {
  return text.replace(/[~`|ঽ√π÷×{}£$℅^°_=‌®©™\\<@#৳%&*\-+()!"':;/]/g, '').trim().toLowerCase();
}

async function getMemory() {
  try {
    const res = await axios.get(BASE_URL, {
      headers: { 'X-Master-Key': API_KEY }
    });
    return res.data.record || {};
  } catch (err) {
    console.error('Memory fetch error:', err.message);
    return {};
  }
}

async function updateMemory(memory) {
  try {
    await axios.put(BASE_URL, memory, {
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY,
        'X-Bin-Versioning': false
      }
    });
  } catch (err) {
    console.error('Memory update error:', err.message);
  }
}

app.get('/sim/:font?', async (req, res) => {
  const { font } = req.params;
  const { ask, teach } = req.query;

  if (req.path.endsWith('/list')) {
    const memory = await getMemory();
    const count = Object.keys(memory).length;
    let message = `Total taught: ${count} items`;
    if (font === 'font1') message = applyFont1(message);
    return res.json({ total: count, message });
  }

  let memory = await getMemory();

  if (teach) {
    const [question, answer] = teach.split('|');
    if (!question || !answer) {
      return res.status(400).json({ error: 'Teach format: /sim?teach=question|answer' });
    }
    const qKey = cleanText(question);
    if (memory[qKey]) {
      return res.json({ message: `Already learned: "${question}" → "${memory[qKey]}"` });
    }
    memory[qKey] = answer.trim();
    await updateMemory(memory);
    return res.json({ success: `Taught: "${question}" → "${answer}"` });
  }

  if (ask) {
    const qKey = cleanText(ask);
    let reply = memory[qKey] || 'I don’t know that yet! Teach me using /sim?teach=question|answer';
    if (font === 'font1') reply = applyFont1(reply);
    return res.json({ reply });
  }

  return res.status(400).json({ error: 'Use /sim?ask=question or /sim?teach=question|answer' });
});

// Serve index.html directly from root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Simsimi API running on port ${PORT}`);
});
