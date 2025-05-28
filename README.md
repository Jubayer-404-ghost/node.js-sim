

<pre><code># 🤖 Simsimi Style Chat API

A simple Simsimi-style chatbot API built with Express and JSONBin.io.  
Supports learning (`teach`) and answering (`ask`) in any language (including Bengali), even if the question includes special symbols like `?!@#$%^&*`.

---

## 🚀 Features

- 🧠 Memory stored on [JSONBin.io](https://jsonbin.io)
- 🗣️ Teach bot using `?teach=question|answer`
- ❓ Ask questions using `?ask=question`
- 🔡 Font style support via `/sim/font1`
- 🔢 `/sim/list` to show total number of taught items
- 🔍 Supports asking/teaching with or without symbols like `?!~@#$%^&*()`

---

## 📁 Project Structure

```
your-project/
├── index.js        # Express server
└── index.html      # Frontend HTML page
```

---

## ⚙️ Installation

```bash
npm install
node index.js
```

Then open your browser:  
👉 http://localhost:3000

---

## 🌐 API Endpoints

### 🧠 Teach the bot

```
GET /sim?teach=Your question|Your answer
```

Example:
```
/sim?teach=তোমার নাম কি|আমার নাম বট
```

### ❓ Ask a question

```
GET /sim?ask=Your question
```

Example:
```
/sim?ask=তোমার নাম কি
```

Also works with symbols:
```
/sim?ask=তোমার নাম কি?!
```

### 🆎 Use stylish font

```
GET /sim/font1?ask=Your question
```

### 📊 Get total taught entries

```
GET /sim/list
```

or styled:

```
GET /sim/font1/list
```

---

## 💡 Notes

- All questions are normalized — symbols like `?!@#$%^&*` are removed internally for consistent matching.
- This means:
  - `ask=তোমার নাম কি`
  - `ask=তোমার নাম কি?`
  - `ask=তোমার নাম কি?!`
  → All will return the same answer.

---

## 🛡️ Powered By

- [Express.js](https://expressjs.com)
- [JSONBin.io](https://jsonbin.io)
- ❤️ Your creativity

---

## ✍️ Author

Built with ❤️ by [JUBAYER]
</code></pre>
---

