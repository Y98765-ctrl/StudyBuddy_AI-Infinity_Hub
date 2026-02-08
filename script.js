/* =========================================================
   StudyBuddy AI - Infinity Hub (OFFLINE)
   FIXED VERSION:
   - No cut code
   - Buttons always work
   - No missing functions
========================================================= */

let mode = "chat";
let chatLog = [];
let currentUser = null;

/* ---------- DOM ---------- */
const pageLogin = document.getElementById("page-login");
const pageApp = document.getElementById("page-app");

const authEmail = document.getElementById("authEmail");
const authPass = document.getElementById("authPass");
const authMsg = document.getElementById("authMsg");

const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const guestBtn = document.getElementById("guestBtn");

const chat = document.getElementById("chat");
const input = document.getElementById("input");
const sendBtn = document.getElementById("sendBtn");

const themeBtn = document.getElementById("themeBtn");
const exportBtn = document.getElementById("exportBtn");
const resetBtn = document.getElementById("resetBtn");

const userLabel = document.getElementById("userLabel");
const logoutBtn = document.getElementById("logoutBtn");

/* ---------- Safe LocalStorage ---------- */
function lsGet(key, def = null) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : def;
  } catch (e) {
    return def;
  }
}
function lsSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
}

/* ---------- Pages ---------- */
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
}

/* ---------- Chat UI ---------- */
function addMsg(text, who) {
  const d = document.createElement("div");
  d.className = "msg " + who;
  d.innerText = text;
  chat.appendChild(d);
  chat.scrollTop = chat.scrollHeight;
  chatLog.push((who === "user" ? "User: " : "AI: ") + text);
}

/* ---------- Theme ---------- */
function toggleTheme() {
  document.body.classList.toggle("light");
  lsSet("sb_theme_light", document.body.classList.contains("light"));
}

/* ---------- Export ---------- */
function exportChat() {
  const blob = new Blob([chatLog.join("\n\n")], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "StudyBuddyAI_Chat.txt";
  a.click();
}

/* ---------- Reset ---------- */
function resetAll() {
  if (!confirm("Reset chat?")) return;
  chat.innerHTML = "";
  chatLog = [];
  addMsg("Welcome back to StudyBuddy AI 🚀", "bot");
}

/* ---------- Modes ---------- */
function setMode(newMode) {
  mode = newMode;

  document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
  const btn = document.querySelector(`.tab[data-mode="${newMode}"]`);
  if (btn) btn.classList.add("active");

  addMsg("Mode changed to: " + newMode.toUpperCase(), "bot");

  if (newMode === "games") addMsg(getGameMenu(), "bot");
  if (newMode === "quiz") addMsg("Quiz Mode: Type 'start quiz' to begin.", "bot");
  if (newMode === "ai") addMsg("AI Learn Mode: Ask about AI/ML/DL/NLP/Ethics etc.", "bot");
  if (newMode === "math") addMsg("Math Mode: Type any math like 12*7 or (5+2)^2", "bot");
  if (newMode === "islam") addMsg("Islam Mode: Ask duas, reminders, basic Islamic questions.", "bot");
}

/* ---------- Login System (Offline) ---------- */
function getUsers() {
  return lsGet("sb_users", {});
}
function saveUsers(users) {
  lsSet("sb_users", users);
}
function signup() {
  const email = authEmail.value.trim().toLowerCase();
  const pass = authPass.value.trim();

  if (!email || !pass) {
    authMsg.style.color = "orange";
    authMsg.innerText = "Please enter email + password.";
    return;
  }
  if (pass.length < 4) {
    authMsg.style.color = "orange";
    authMsg.innerText = "Password must be at least 4 characters.";
    return;
  }

  const users = getUsers();
  if (users[email]) {
    authMsg.style.color = "red";
    authMsg.innerText = "Account already exists. Please login.";
    return;
  }

  users[email] = { pass: pass, created: Date.now() };
  saveUsers(users);

  authMsg.style.color = "lightgreen";
  authMsg.innerText = "Account created! Now press Login.";
}
function login() {
  const email = authEmail.value.trim().toLowerCase();
  const pass = authPass.value.trim();
  const users = getUsers();

  if (!users[email] || users[email].pass !== pass) {
    authMsg.style.color = "red";
    authMsg.innerText = "Wrong email or password.";
    return;
  }

  currentUser = email;
  lsSet("sb_currentUser", email);
  startApp(false);
}
function guest() {
  currentUser = null;
  lsSet("sb_currentUser", null);
  startApp(true);
}
function logout() {
  currentUser = null;
  lsSet("sb_currentUser", null);
  showPage("page-login");
  authMsg.innerText = "";
}

/* ---------- Start App ---------- */
function startApp(isGuest) {
  showPage("page-app");

  if (isGuest) userLabel.innerText = "👤 Guest Mode (No account)";
  else userLabel.innerText = "✅ Logged in as: " + currentUser;

  chat.innerHTML = "";
  chatLog = [];

  addMsg("Welcome to StudyBuddy AI 🚀", "bot");
  addMsg("You are in Mode: CHAT. Use the buttons above to change modes.", "bot");
}

/* ---------- MAIN SEND ---------- */
function send() {
  const t = input.value.trim();
  if (!t) return;

  input.value = "";
  addMsg(t, "user");

  if (mode === "math") return handleMath(t);
  if (mode === "quiz") return handleQuiz(t);
  if (mode === "games") return handleGames(t);
  if (mode === "islam") return handleIslam(t);
  if (mode === "ai") return handleAIlearn(t);

  return handleChat(t);
}

/* =========================================================
   MODE: CHAT (General AI)
========================================================= */
function handleChat(q) {
  const lower = q.toLowerCase();

  if (lower === "hi" || lower.includes("hello") || lower.includes("hey")) {
    addMsg("Hello 😊 I'm StudyBuddy AI. How can I help you today?", "bot");
    return;
  }
  if (lower.includes("how are you")) {
    addMsg("I'm doing great Alhamdulillah 😊\nI'm ready to help you!", "bot");
    return;
  }
  if (lower.includes("who are you")) {
    addMsg(
      "I am StudyBuddy AI — an offline educational assistant.\n\n" +
      "I help with:\n" +
      "• AI concepts (ML, DL, NLP, Computer Vision)\n" +
      "• Study explanations\n" +
      "• Math solving\n" +
      "• Quizzes\n" +
      "• Islamic reminders\n\n" +
      "I work inside your website without needing any API.",
      "bot"
    );
    return;
  }
  if (lower.includes("what can you do")) {
    addMsg(
      "I can:\n\n" +
      "✅ Explain topics (AI, ML, DL, science, history)\n" +
      "✅ Solve math\n" +
      "✅ Create quizzes\n" +
      "✅ Summarize text\n" +
      "✅ Give coding examples\n" +
      "✅ Islamic reminders\n\n" +
      "All offline on GitHub Pages.",
      "bot"
    );
    return;
  }
  if (lower.includes("who made you")) {
    addMsg(
      "I was made by young muslim developer (Yousaf) 💙\nHe built this app using HTML, CSS, and JavaScript.",
      "bot"
    );
    return;
  }

  if (isAIQuestion(lower)) {
    addMsg(getAIAnswer(lower), "bot");
    return;
  }

  addMsg(
    "Try asking:\n" +
    "• What is AI?\n" +
    "• AI vs ML vs DL\n" +
    "• What is NLP?\n" +
    "• What is gradient descent?\n" +
    "Or switch modes above.",
    "bot"
  );
}

/* =========================================================
   MODE: AI LEARN (Detailed)
========================================================= */
function handleAIlearn(q) {
  const lower = q.toLowerCase();
  addMsg(getAIAnswer(lower), "bot");
}

/* =========================================================
   AI KNOWLEDGE ENGINE (YOUR TOPICS)
========================================================= */
function isAIQuestion(t) {
  const keys = [
    "artificial intelligence","ai",
    "machine learning","ml",
    "deep learning","dl",
    "generative ai",
    "turing test",
    "neural network",
    "nlp","natural language processing",
    "computer vision",
    "supervised","unsupervised","reinforcement",
    "hallucination","overfitting",
    "gradient descent",
    "normalization",
    "ethical ai","bias",
    "narrow ai","agi",
    "30% rule",
    "loss function","cost function",
    "agentic ai"
  ];
  return keys.some(k => t.includes(k));
}

function getAIAnswer(t) {
  // AI ML DL
  if (t.includes("ai vs ml") || t.includes("ml vs ai") || t.includes("ai ml dl") || t.includes("deep learning") || t.includes(" dl")) {
    return (
      "✅ AI vs ML vs DL (Mode C)\n\n" +
      "• AI (Artificial Intelligence): The big field where machines act intelligently.\n" +
      "• ML (Machine Learning): A part of AI where the system learns patterns from data.\n" +
      "• DL (Deep Learning): A part of ML that uses multi-layer neural networks.\n\n" +
      "Example:\n" +
      "AI = The whole 'robot brain' idea\n" +
      "ML = Learning from examples\n" +
      "DL = Learning using deep neural networks (many layers)"
    );
  }

  // Generative AI
  if (t.includes("generative ai")) {
    return (
      "✅ Generative AI\n\n" +
      "Generative AI is AI that can CREATE new content.\n\n" +
      "It can generate:\n" +
      "• Text (chatbots)\n" +
      "• Images\n" +
      "• Code\n" +
      "• Music\n\n" +
      "It does not just classify — it produces new output."
    );
  }

  // Turing Test
  if (t.includes("turing test")) {
    return (
      "✅ Turing Test\n\n" +
      "The Turing Test checks if a machine can behave so intelligently that a human cannot tell if it is a machine.\n\n" +
      "If a human chats with it and thinks it is human, it 'passes' the test."
    );
  }

  // Neural networks
  if (t.includes("neural network")) {
    return (
      "✅ Neural Networks\n\n" +
      "A neural network is a model inspired by the brain.\n\n" +
      "It learns patterns by adjusting weights between layers.\n\n" +
      "Used for:\n" +
      "• Image recognition\n" +
      "• Speech recognition\n" +
      "• Text generation\n" +
      "• Predictions"
    );
  }

  // NLP
  if (t.includes("nlp") || t.includes("natural language processing")) {
    return (
      "✅ NLP (Natural Language Processing)\n\n" +
      "NLP is AI that helps computers understand and work with human language.\n\n" +
      "Examples:\n" +
      "• Chatbots\n" +
      "• Translation\n" +
      "• Summarization\n" +
      "• Sentiment analysis"
    );
  }

  // Computer Vision
  if (t.includes("computer vision")) {
    return (
      "✅ Computer Vision\n\n" +
      "Computer Vision allows AI to understand images and videos.\n\n" +
      "Examples:\n" +
      "• Face detection\n" +
      "• Object recognition\n" +
      "• Self-driving cars\n" +
      "• Medical scans"
    );
  }

  // Learning types
  if (t.includes("supervised")) {
    return (
      "✅ Supervised Learning\n\n" +
      "Supervised learning means the model learns from labeled data.\n\n" +
      "Example:\n" +
      "Images labeled 'cat' or 'dog' → model learns to classify."
    );
  }
  if (t.includes("unsupervised")) {
    return (
      "✅ Unsupervised Learning\n\n" +
      "Unsupervised learning means the model learns from unlabeled data.\n\n" +
      "It finds patterns like:\n" +
      "• Clustering\n" +
      "• Grouping similar items"
    );
  }
  if (t.includes("reinforcement")) {
    return (
      "✅ Reinforcement Learning\n\n" +
      "Reinforcement learning is learning by rewards and punishment.\n\n" +
      "The AI agent tries actions, and gets rewards for correct actions.\n\n" +
      "Used in:\n" +
      "• Games\n" +
      "• Robotics"
    );
  }

  // Hallucination
  if (t.includes("hallucination")) {
    return (
      "✅ AI Hallucinations\n\n" +
      "Hallucinations happen when an AI confidently gives false or made-up information.\n\n" +
      "This happens because:\n" +
      "• The model predicts text\n" +
      "• It does not truly 'know' facts like humans"
    );
  }

  // Overfitting
  if (t.includes("overfitting")) {
    return (
      "✅ Overfitting\n\n" +
      "Overfitting happens when a model learns training data too perfectly.\n\n" +
      "Result:\n" +
      "• Great on training data\n" +
      "• Bad on new unseen data\n\n" +
      "Solution:\n" +
      "• More data\n" +
      "• Regularization\n" +
      "• Dropout\n" +
      "• Simpler model"
    );
  }

  // Gradient descent
  if (t.includes("gradient descent")) {
    return (
      "✅ Gradient Descent\n\n" +
      "Gradient Descent is an optimization method used to reduce errors.\n\n" +
      "It works by:\n" +
      "1) Measuring error (loss)\n" +
      "2) Adjusting model parameters\n" +
      "3) Repeating until loss becomes small"
    );
  }

  // Normalization
  if (t.includes("normalization")) {
    return (
      "✅ Data Normalization\n\n" +
      "Normalization scales input values so training becomes easier.\n\n" +
      "Example:\n" +
      "Instead of values 0 to 100000,\n" +
      "scale to 0 to 1."
    );
  }

  // Ethical AI
  if (t.includes("ethical ai")) {
    return (
      "✅ Ethical AI\n\n" +
      "Ethical AI means AI should be:\n" +
      "• Fair\n" +
      "• Transparent\n" +
      "• Accountable\n" +
      "• Private\n" +
      "• Secure\n\n" +
      "It must avoid harming people."
    );
  }

  // Bias
  if (t.includes("bias")) {
    return (
      "✅ AI Bias\n\n" +
      "AI bias happens when AI gives unfair results because of biased training data.\n\n" +
      "Example:\n" +
      "If training data is unfair, AI will learn unfair patterns."
    );
  }

  // Narrow AI vs AGI
  if (t.includes("narrow ai") || t.includes("agi")) {
    return (
      "✅ Narrow AI vs AGI\n\n" +
      "• Narrow AI: Works on one task only (today’s AI).\n" +
      "• AGI: Theoretical AI that matches human intelligence in everything.\n\n" +
      "AGI does not exist yet."
    );
  }

  // 30% rule
  if (t.includes("30% rule")) {
    return (
      "✅ The 30% Rule\n\n" +
      "The '30% Rule' is the idea that AI can automate around one-third of workplace tasks.\n\n" +
      "It means AI helps workers, but does not fully replace all jobs."
    );
  }

  // Loss / cost
  if (t.includes("loss function") || t.includes("cost function")) {
    return (
      "✅ Loss Function / Cost Function\n\n" +
      "A loss (cost) function measures how wrong the model is.\n\n" +
      "The goal of training is:\n" +
      "➡ Make the loss as small as possible."
    );
  }

  // Agentic AI
  if (t.includes("agentic ai")) {
    return (
      "✅ Agentic AI\n\n" +
      "Agentic AI means AI that can take actions by itself to reach a goal.\n\n" +
      "Example:\n" +
      "AI that plans steps, searches, decides, and completes tasks."
    );
  }

  // default answer
  return (
    "I can answer AI questions like:\n\n" +
    "• AI vs ML vs DL\n" +
    "• Generative AI\n" +
    "• Turing Test\n" +
    "• Neural Networks\n" +
    "• NLP\n" +
    "• Computer Vision\n" +
    "• Supervised vs Unsupervised vs Reinforcement\n" +
    "• Hallucinations\n" +
    "• Overfitting\n" +
    "• Gradient Descent\n" +
    "• Normalization\n" +
    "• Ethical AI & Bias\n" +
    "• Narrow AI vs AGI\n" +
    "• 30% Rule\n" +
    "• Loss/Cost Function\n" +
    "• Agentic AI\n\n" +
    "Ask me one of these!"
  );
}

/* =========================================================
   MODE: MATH
========================================================= */
function handleMath(q) {
  try {
    let expr = q.replace(/\^/g, "**");
    if (!/^[0-9+\-*/().\s**]+$/.test(expr)) {
      addMsg("Math Mode: Only numbers and + - * / ( ) allowed.", "bot");
      return;
    }
    // eslint-disable-next-line no-eval
    const ans = eval(expr);
    addMsg("Answer: " + ans, "bot");
  } catch (e) {
    addMsg("I couldn't solve that. Example: (5+2)*7", "bot");
  }
}

/* =========================================================
   MODE: QUIZ
========================================================= */
let quizActive = false;
let quizScore = 0;
let quizQ = 0;

const quizBank = [
  { q: "What does AI stand for?", a: "artificial intelligence" },
  { q: "ML is a subset of AI. True or false?", a: "true" },
  { q: "What is the capital of France?", a: "paris" },
  { q: "What is H2O?", a: "water" },
  { q: "What is gradient descent used for?", a: "optimization" }
];

function handleQuiz(q) {
  const lower = q.toLowerCase().trim();

  if (lower === "start quiz") {
    quizActive = true;
    quizScore = 0;
    quizQ = 0;
    addMsg("Quiz started! 🎯", "bot");
    addMsg("Q1: " + quizBank[0].q, "bot");
    return;
  }

  if (!quizActive) {
    addMsg("Type: start quiz", "bot");
    return;
  }

  const correct = quizBank[quizQ].a;
  if (lower.includes(correct)) {
    quizScore++;
    addMsg("✅ Correct!", "bot");
  } else {
    addMsg("❌ Wrong. Correct answer: " + correct, "bot");
  }

  quizQ++;
  if (quizQ >= quizBank.length) {
    quizActive = false;
    addMsg("Quiz finished! Score: " + quizScore + "/" + quizBank.length, "bot");
    return;
  }

  addMsg("Q" + (quizQ + 1) + ": " + quizBank[quizQ].q, "bot");
}

/* =========================================================
   MODE: GAMES
========================================================= */
let ttt = Array(9).fill("");
let tttTurn = "X";
let tttActive = false;

function getGameMenu() {
  return (
    "🎮 Games Menu:\n\n" +
    "1) Type: ttt   (Tic Tac Toe)\n" +
    "2) Type: rps   (Rock Paper Scissors)\n\n" +
    "Minecraft cannot run offline inside HTML like real Minecraft.\n" +
    "But I can add a block-building mini game later."
  );
}

function handleGames(q) {
  const t = q.toLowerCase().trim();

  if (t === "ttt") {
    ttt = Array(9).fill("");
    tttTurn = "X";
    tttActive = true;
    addMsg("Tic Tac Toe started! Type a number 1-9.", "bot");
    addMsg(drawTTT(), "bot");
    return;
  }

  if (t === "rps") {
    addMsg("Rock Paper Scissors! Type: rock / paper / scissors", "bot");
    return;
  }

  if (["rock","paper","scissors"].includes(t)) {
    const ai = ["rock","paper","scissors"][Math.floor(Math.random()*3)];
    if (ai === t) addMsg("I chose " + ai + ". Draw 🤝", "bot");
    else if (
      (t==="rock" && ai==="scissors") ||
      (t==="paper" && ai==="rock") ||
      (t==="scissors" && ai==="paper")
    ) addMsg("I chose " + ai + ". You win 🎉", "bot");
    else addMsg("I chose " + ai + ". I win 😄", "bot");
    return;
  }

  if (tttActive && /^[1-9]$/.test(t)) {
    const pos = parseInt(t, 10) - 1;
    if (ttt[pos]) {
      addMsg("That spot is already taken.", "bot");
      return;
    }
    ttt[pos] = tttTurn;
    tttTurn = tttTurn === "X" ? "O" : "X";
    addMsg(drawTTT(), "bot");
    return;
  }

  addMsg(getGameMenu(), "bot");
}

function drawTTT() {
  const c = ttt.map(x => x || " ");
  return (
    " " + c[0] + " | " + c[1] + " | " + c[2] + "\n" +
    "---+---+---\n" +
    " " + c[3] + " | " + c[4] + " | " + c[5] + "\n" +
    "---+---+---\n" +
    " " + c[6] + " | " + c[7] + " | " + c[8] + "\n"
  );
}

/* =========================================================
   MODE: ISLAM
========================================================= */
function handleIslam(q) {
  const t = q.toLowerCase();

  if (t.includes("salam") || t.includes("assalam")) {
    addMsg("Wa Alaikum Assalam wa Rahmatullahi wa Barakatuh 🌙", "bot");
    return;
  }

  if (t.includes("dua") && t.includes("sleep")) {
    addMsg("Dua before sleeping:\n\nبِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا\n\nTransliteration: Bismika Allahumma amootu wa ahyaa", "bot");
    return;
  }

  addMsg(
    "Islam Mode:\n" +
    "Ask me:\n" +
    "• A dua\n" +
    "• Islamic reminder\n" +
    "• Salam\n",
    "bot"
  );
}

/* =========================================================
   EVENTS (THIS IS WHAT MAKES BUTTONS WORK)
========================================================= */
document.addEventListener("DOMContentLoaded", () => {

  // restore theme
  const light = lsGet("sb_theme_light", false);
  if (light) document.body.classList.add("light");

  // auto login
  const saved = lsGet("sb_currentUser", null);
  if (saved) {
    currentUser = saved;
    startApp(false);
  } else {
    showPage("page-login");
  }

  // AUTH buttons
  signupBtn.addEventListener("click", signup);
  loginBtn.addEventListener("click", login);
  guestBtn.addEventListener("click", guest);
  logoutBtn.addEventListener("click", logout);

  // header buttons
  themeBtn.addEventListener("click", toggleTheme);
  exportBtn.addEventListener("click", exportChat);
  resetBtn.addEventListener("click", resetAll);

  // send
  sendBtn.addEventListener("click", send);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
  });

  // tabs
  document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      setMode(btn.dataset.mode);
    });
  });
});
