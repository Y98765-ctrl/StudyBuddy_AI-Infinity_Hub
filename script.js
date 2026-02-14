/* =========================================================
   StudyBuddy AI - Infinity Hub (OFFLINE)
   FIXED VERSION:
   ✅ Buttons always work
   ✅ Full Islam duas (complete)
   ✅ "Who made you" ALWAYS answers:
      "I was made by a young Muslim developer (Named Muhammad Yousaf)."
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
    let v = localStorage.getItem(key);
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
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
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
  document.querySelectorAll(".tab").forEach((b) => b.classList.remove("active"));
  const btn = document.querySelector(`.tab[data-mode="${newMode}"]`);
  if (btn) btn.classList.add("active");

  addMsg("Mode changed to: " + newMode.toUpperCase(), "bot");

  if (newMode === "games") addMsg(getGameMenu(), "bot");
  if (newMode === "quiz") addMsg("Quiz Mode: Type 'start quiz' to begin.", "bot");
  if (newMode === "ai") addMsg("AI Learn Mode: Ask about AI/ML/DL/NLP/Ethics etc.", "bot");
  if (newMode === "islam") addMsg(getIslamHelp(), "bot");
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
  addMsg("You are in Mode: CHAT. Change modes using the buttons above.", "bot");
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
  const lower = q.toLowerCase().trim();

  // greetings
  if (lower === "hi" || lower === "hello" || lower === "hey" || lower.includes("assalam")) {
    addMsg("Wa Alaikum Assalam 😊 I'm StudyBuddy AI. How can I help you today?", "bot");
    return;
  }

  if (lower.includes("how are you")) {
    addMsg("I'm doing great Alhamdulillah 😊\nI'm ready to help you with study, coding, AI, math, quizzes, and more.", "bot");
    return;
  }

  if (lower.includes("who are you")) {
    addMsg(
      "I am StudyBuddy AI — an offline educational assistant.\n\n" +
        "I help with:\n" +
        "• AI concepts (ML, DL, NLP, Computer Vision)\n" +
        "• Study help and explanations\n" +
        "• Math solving\n" +
        "• Quizzes\n" +
        "• Islamic reminders & duas\n\n" +
        "I work inside your website without needing any API.",
      "bot"
    );
    return;
  }

  if (lower.includes("what can you do")) {
    addMsg(
      "I can do a lot! Here are my main abilities:\n\n" +
        "✅ Explain topics (AI, ML, DL, science, history, etc.)\n" +
        "✅ Solve math problems\n" +
        "✅ Create quizzes and test you\n" +
        "✅ Give study tips and summaries\n" +
        "✅ Help with coding examples\n" +
        "✅ Islamic reminders and duas\n\n" +
        "And I work fully offline on GitHub Pages.",
      "bot"
    );
    return;
  }

  // ✅ FIXED: ALWAYS SAME ANSWER
  if (lower.includes("who made you") || lower.includes("who created you") || lower.includes("your creator")) {
    addMsg("I was made by a young Muslim developer (Named Muhammad Yousaf). 💙", "bot");
    return;
  }

  // AI topics in chat mode
  if (isAIQuestion(lower)) {
    addMsg(getAIAnswer(lower), "bot");
    return;
  }

  addMsg(
    "I understand your message.\n\n" +
      "Try asking me:\n" +
      "• What is Artificial Intelligence?\n" +
      "• Explain AI vs ML vs DL\n" +
      "• What is Gradient Descent?\n" +
      "• What is overfitting?\n" +
      "• What is NLP?\n\n" +
      "Or switch modes above.",
    "bot"
  );
}

/* =========================================================
   MODE: AI LEARN (Detailed)
========================================================= */
function handleAIlearn(q) {
  const lower = q.toLowerCase();

  if (lower.includes("help") || lower === "ai") {
    addMsg(
      "AI Learn Mode Help:\n\n" +
        "Ask me questions like:\n" +
        "• What is AI?\n" +
        "• What is ML and DL?\n" +
        "• What is Generative AI?\n" +
        "• What is the Turing Test?\n" +
        "• What is NLP?\n" +
        "• What is Computer Vision?\n" +
        "• What is overfitting?\n" +
        "• What is gradient descent?\n" +
        "• What is AI bias?\n" +
        "• Narrow AI vs AGI\n\n" +
        "I will answer in detailed Mode C.",
      "bot"
    );
    return;
  }

  addMsg(getAIAnswer(lower), "bot");
}

/* =========================================================
   AI KNOWLEDGE ENGINE (YOUR TOPICS)
========================================================= */
function isAIQuestion(t) {
  const keys = [
    "artificial intelligence",
    "ai",
    "machine learning",
    "ml",
    "deep learning",
    "dl",
    "generative ai",
    "turing test",
    "neural network",
    "nlp",
    "computer vision",
    "supervised",
    "unsupervised",
    "reinforcement",
    "hallucination",
    "overfitting",
    "gradient descent",
    "normalization",
    "ethical ai",
    "bias",
    "narrow ai",
    "agi",
    "30% rule",
    "loss function",
    "cost function",
    "agentic ai",
  ];
  return keys.some((k) => t.includes(k));
}

function getAIAnswer(t) {
  if (t.includes("ai vs ml") || t.includes("ml vs ai") || t.includes("ai ml dl") || t.includes("deep learning") || t.includes("dl")) {
    return (
      "✅ AI vs ML vs DL (Mode C)\n\n" +
      "• AI (Artificial Intelligence): A broad field where machines try to act intelligently.\n" +
      "• ML (Machine Learning): A subset of AI where machines learn patterns from data.\n" +
      "• DL (Deep Learning): A subset of ML using multi-layer neural networks.\n\n" +
      "Example:\n" +
      "AI = whole universe\nML = one planet\nDL = one country inside that planet."
    );
  }

  if (t.includes("generative ai")) {
    return (
      "✅ Generative AI (Mode C)\n\n" +
      "Generative AI is AI that can CREATE new content.\n" +
      "It can generate:\n" +
      "• Text (stories, answers)\n" +
      "• Images\n" +
      "• Code\n" +
      "• Music\n\n" +
      "Example: ChatGPT is a Generative AI model."
    );
  }

  if (t.includes("turing test")) {
    return (
      "✅ Turing Test (Mode C)\n\n" +
      "The Turing Test checks if a machine can talk like a human.\n\n" +
      "If a person cannot tell whether they are talking to a human or a machine, then the machine passes the test."
    );
  }

  if (t.includes("neural network")) {
    return (
      "✅ Neural Networks (Mode C)\n\n" +
      "A neural network is a model inspired by the human brain.\n" +
      "It learns patterns using layers:\n" +
      "Input → Hidden Layers → Output\n\n" +
      "Used in:\n" +
      "• Image recognition\n" +
      "• Speech recognition\n" +
      "• Chatbots"
    );
  }

  if (t.includes("nlp")) {
    return (
      "✅ NLP (Natural Language Processing)\n\n" +
      "NLP helps computers understand human language.\n\n" +
      "Examples:\n" +
      "• Translation\n" +
      "• Chatbots\n" +
      "• Voice assistants\n" +
      "• Text summarization"
    );
  }

  if (t.includes("computer vision")) {
    return (
      "✅ Computer Vision\n\n" +
      "Computer Vision allows AI to understand images/videos.\n\n" +
      "Examples:\n" +
      "• Face detection\n" +
      "• Object recognition\n" +
      "• Medical scans analysis"
    );
  }

  if (t.includes("supervised")) {
    return (
      "✅ Supervised Learning\n\n" +
      "Supervised learning uses labeled data.\n\n" +
      "Example:\n" +
      "Images labeled: Cat / Dog\n" +
      "The model learns to predict the correct label."
    );
  }

  if (t.includes("unsupervised")) {
    return (
      "✅ Unsupervised Learning\n\n" +
      "Unsupervised learning uses unlabeled data.\n\n" +
      "The AI groups similar things together.\n\n" +
      "Example:\n" +
      "Customer grouping (clustering) in shopping data."
    );
  }

  if (t.includes("reinforcement")) {
    return (
      "✅ Reinforcement Learning\n\n" +
      "Reinforcement learning is learning by reward and punishment.\n\n" +
      "Example:\n" +
      "An AI learns to play a game by getting points (reward)."
    );
  }

  if (t.includes("hallucination")) {
    return (
      "✅ Hallucination in AI\n\n" +
      "Hallucination happens when an AI confidently gives a wrong answer.\n\n" +
      "It looks correct, but it is false."
    );
  }

  if (t.includes("overfitting")) {
    return (
      "✅ Overfitting\n\n" +
      "Overfitting happens when a model learns training data too perfectly.\n\n" +
      "Result:\n" +
      "It performs well on training but fails on new data."
    );
  }

  if (t.includes("gradient descent")) {
    return (
      "✅ Gradient Descent\n\n" +
      "Gradient Descent is an optimization method.\n\n" +
      "It reduces error by adjusting model parameters step-by-step.\n\n" +
      "Goal:\n" +
      "Minimize the loss (error)."
    );
  }

  if (t.includes("normalization")) {
    return (
      "✅ Data Normalization\n\n" +
      "Normalization scales data into a smaller range (like 0 to 1).\n\n" +
      "This helps training become faster and more stable."
    );
  }

  if (t.includes("ethical ai") || t.includes("bias")) {
    return (
      "✅ Ethical AI & Bias\n\n" +
      "Ethical AI means:\n" +
      "• Fairness\n" +
      "• Transparency\n" +
      "• Accountability\n" +
      "• Privacy\n" +
      "• Security\n\n" +
      "AI Bias happens when AI gives unfair results because the training data was unfair."
    );
  }

  if (t.includes("narrow ai") || t.includes("agi")) {
    return (
      "✅ Narrow AI vs AGI\n\n" +
      "• Narrow AI: AI that does one task (like chatbots).\n" +
      "• AGI: A theoretical AI that can think like a human in all tasks.\n\n" +
      "AGI does not exist yet."
    );
  }

  if (t.includes("30% rule")) {
    return (
      "✅ The 30% Rule\n\n" +
      "The 30% rule suggests AI can automate about one-third of many workplace tasks.\n\n" +
      "This means AI helps humans, not fully replace them."
    );
  }

  if (t.includes("loss function") || t.includes("cost function")) {
    return (
      "✅ Loss / Cost Function\n\n" +
      "A loss function measures how wrong the AI is.\n\n" +
      "Training tries to reduce this loss until the AI becomes accurate."
    );
  }

  if (t.includes("agentic ai")) {
    return (
      "✅ Agentic AI\n\n" +
      "Agentic AI means an AI that can take actions by itself to reach a goal.\n\n" +
      "Example:\n" +
      "AI that plans tasks, executes steps, and checks results."
    );
  }

  return (
    "✅ AI Explanation (Mode C)\n\n" +
    "Ask about:\n" +
    "• AI vs ML vs DL\n" +
    "• Generative AI\n" +
    "• Turing Test\n" +
    "• Neural Networks\n" +
    "• NLP\n" +
    "• Computer Vision\n" +
    "• Overfitting\n" +
    "• Gradient Descent\n" +
    "• Ethical AI & Bias\n" +
    "• Narrow AI vs AGI\n" +
    "• Loss Function\n" +
    "• Agentic AI"
  );
}

/* =========================================================
   MODE: ISLAM (FULL DUAS + MEANING)
========================================================= */
function getIslamHelp() {
  return (
    "🕌 Islam Mode (Duas)\n\n" +
    "You can ask:\n" +
    "• Dua to enter home\n" +
    "• Dua to leave home\n" +
    "• Dua before entering mosque\n" +
    "• Dua after leaving mosque\n" +
    "• Dua in trouble\n" +
    "• Dua for debt and worry\n\n" +
    "Tip: You can also type just: 'duas'"
  );
}

function handleIslam(q) {
  const t = q.toLowerCase();

  if (t === "duas" || t.includes("help")) {
    return addMsg(getIslamHelp(), "bot");
  }

  // ENTER HOME
  if (t.includes("enter home") || t.includes("enter the home")) {
    return addMsg(
      "🏠 Dua to ENTER Home\n\n" +
        "Arabic:\n" +
        "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا\n\n" +
        "Transliteration:\n" +
        "Bismillāhi walajnā, wa bismillāhi kharajnā, wa ‘alā rabbina tawakkalnā.\n\n" +
        "Meaning:\n" +
        "In the name of Allah we enter, in the name of Allah we leave, and upon our Lord we rely.",
      "bot"
    );
  }

  // LEAVE HOME
  if (t.includes("leave home") || t.includes("leaving home")) {
    return addMsg(
      "🚪 Dua to LEAVE Home\n\n" +
        "Arabic:\n" +
        "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ\n\n" +
        "Transliteration:\n" +
        "Bismillāh, tawakkaltu ‘alallāh, wa lā ḥawla wa lā quwwata illā billāh.\n\n" +
        "Meaning:\n" +
        "In the name of Allah, I trust in Allah, and there is no power and no strength except with Allah.",
      "bot"
    );
  }

  // ENTER MOSQUE
  if (t.includes("enter mosque") || t.includes("enter masjid") || t.includes("before entering mosque")) {
    return addMsg(
      "🕌 Dua BEFORE Entering the Mosque\n\n" +
        "Arabic:\n" +
        "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ\n\n" +
        "Transliteration:\n" +
        "Allāhumma iftaḥ lī abwāba raḥmatik.\n\n" +
        "Meaning:\n" +
        "O Allah, open for me the doors of Your mercy.",
      "bot"
    );
  }

  // LEAVE MOSQUE
  if (t.includes("leave mosque") || t.includes("leaving mosque") || t.includes("after leaving mosque")) {
    return addMsg(
      "🕌 Dua AFTER Leaving the Mosque\n\n" +
        "Arabic:\n" +
        "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ\n\n" +
        "Transliteration:\n" +
        "Allāhumma innī as’aluka min faḍlik.\n\n" +
        "Meaning:\n" +
        "O Allah, I ask You from Your فضل (bounty).",
      "bot"
    );
  }

  // TROUBLE
  if (t.includes("trouble") || t.includes("difficulty") || t.includes("hard time") || t.includes("stress")) {
    return addMsg(
      "😔 Dua When You Are In Trouble / Distress\n\n" +
        "Arabic:\n" +
        "لَا إِلٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ\n\n" +
        "Transliteration:\n" +
        "Lā ilāha illā Anta subḥānaka innī kuntu minaẓ-ẓālimīn.\n\n" +
        "Meaning:\n" +
        "There is no god except You. Glory be to You. Indeed I was among the wrongdoers.\n\n" +
        "⭐ This is the famous dua of Prophet Yunus (AS).",
      "bot"
    );
  }

  // DEBT & WORRY
  if (t.includes("debt") || t.includes("worry") || t.includes("loan") || t.includes("anxiety")) {
    return addMsg(
      "💰 Dua for Debt & Worry\n\n" +
        "Arabic:\n" +
        "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ\n\n" +
        "Transliteration:\n" +
        "Allāhumma innī a‘ūdhu bika minal-hammi wal-ḥazan, wa a‘ūdhu bika minal-‘ajzi wal-kasal, wa a‘ūdhu bika minal-jubni wal-bukhl, wa a‘ūdhu bika min ghalabatid-dayn wa qahrir-rijāl.\n\n" +
        "Meaning:\n" +
        "O Allah, I seek refuge in You from worry and grief, from inability and laziness, from cowardice and stinginess, and from being overcome by debt and from being overpowered by men.",
      "bot"
    );
  }

  // fallback
  return addMsg(
    "🕌 Islam Mode:\n\n" +
      "Try typing:\n" +
      "• dua to enter home\n" +
      "• dua to leave home\n" +
      "• dua before entering mosque\n" +
      "• dua after leaving mosque\n" +
      "• dua in trouble\n" +
      "• dua for debt and worry",
    "bot"
  );
}

/* =========================================================
   MODE: MATH
========================================================= */
function handleMath(q) {
  try {
    let safe = q.replace(/[^0-9+\-*/().% ]/g, "");
    if (!safe.trim()) {
      addMsg("Please type a math expression like: 12*(5+3)", "bot");
      return;
    }
    let ans = Function('"use strict";return (' + safe + ")")();
    addMsg("✅ Answer: " + ans, "bot");
  } catch (e) {
    addMsg("❌ I couldn't solve that. Try a simple expression like: 25/5", "bot");
  }
}

/* =========================================================
   MODE: QUIZ (Simple)
========================================================= */
let quizOn = false;
let quizScore = 0;
let quizIndex = 0;

const quizQs = [
  { q: "What does AI stand for?", a: "artificial intelligence" },
  { q: "What is the capital of France?", a: "paris" },
  { q: "What is H2O?", a: "water" },
  { q: "2 + 2 = ?", a: "4" },
];

function handleQuiz(q) {
  const t = q.toLowerCase().trim();

  if (!quizOn) {
    if (t.includes("start")) {
      quizOn = true;
      quizScore = 0;
      quizIndex = 0;
      addMsg("🧠 Quiz Started!\n\nQ1: " + quizQs[0].q, "bot");
      return;
    }
    addMsg("Type: start quiz", "bot");
    return;
  }

  const correct = quizQs[quizIndex].a;
  if (t === correct) {
    quizScore++;
    addMsg("✅ Correct!", "bot");
  } else {
    addMsg("❌ Wrong. Correct answer: " + correct, "bot");
  }

  quizIndex++;
  if (quizIndex >= quizQs.length) {
    quizOn = false;
    addMsg("🎉 Quiz Finished!\nScore: " + quizScore + "/" + quizQs.length, "bot");
    return;
  }

  addMsg("Next: " + quizQs[quizIndex].q, "bot");
}

/* =========================================================
   MODE: GAMES (Mini text games)
========================================================= */
function getGameMenu() {
  return (
    "🎮 Games Mode\n\n" +
    "Type:\n" +
    "• play guess\n" +
    "• play rps\n\n" +
    "Guess = number guessing game\n" +
    "RPS = Rock Paper Scissors"
  );
}

let guessNumber = null;

function handleGames(q) {
  const t = q.toLowerCase().trim();

  if (t.includes("menu")) return addMsg(getGameMenu(), "bot");

  // Guess Game
  if (t.includes("play guess")) {
    guessNumber = Math.floor(Math.random() * 10) + 1;
    addMsg("🎯 Guess Game started! Guess a number 1 to 10.", "bot");
    return;
  }

  if (guessNumber !== null && /^[0-9]+$/.test(t)) {
    const n = parseInt(t, 10);
    if (n === guessNumber) {
      addMsg("🎉 Correct! You guessed it!", "bot");
      guessNumber = null;
    } else if (n < guessNumber) {
      addMsg("⬆ Too low! Try again.", "bot");
    } else {
      addMsg("⬇ Too high! Try again.", "bot");
    }
    return;
  }

  // RPS
  if (t.includes("play rps")) {
    addMsg("✊🖐✌ Rock Paper Scissors!\nType: rock OR paper OR scissors", "bot");
    return;
  }

  if (t === "rock" || t === "paper" || t === "scissors") {
    const arr = ["rock", "paper", "scissors"];
    const ai = arr[Math.floor(Math.random() * 3)];

    let result = "";
    if (t === ai) result = "Draw!";
    else if (
      (t === "rock" && ai === "scissors") ||
      (t === "paper" && ai === "rock") ||
      (t === "scissors" && ai === "paper")
    ) {
      result = "You Win!";
    } else {
      result = "AI Wins!";
    }

    addMsg("🤖 AI chose: " + ai + "\nResult: " + result, "bot");
    return;
  }

  addMsg("🎮 Type: play guess OR play rps", "bot");
}

/* =========================================================
   EVENTS (IMPORTANT: BUTTON FIX)
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  // theme saved
  if (lsGet("sb_theme_light", false)) document.body.classList.add("light");

  // auto login
  const saved = lsGet("sb_currentUser", null);
  if (saved) {
    currentUser = saved;
    startApp(false);
  } else {
    showPage("page-login");
  }

  // Tabs
  document.querySelectorAll(".tab").forEach((b) => {
    b.addEventListener("click", () => setMode(b.dataset.mode));
  });

  // Auth Buttons
  signupBtn.addEventListener("click", signup);
  loginBtn.addEventListener("click", login);
  guestBtn.addEventListener("click", guest);
  logoutBtn.addEventListener("click", logout);

  // Header Buttons
  themeBtn.addEventListener("click", toggleTheme);
  exportBtn.addEventListener("click", exportChat);
  resetBtn.addEventListener("click", resetAll);

  // Send
  sendBtn.addEventListener("click", send);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
  });
});
