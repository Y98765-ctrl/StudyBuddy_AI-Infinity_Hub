/* =========================================================
   StudyBuddy AI — ONE CHAT (NO MODES / NO BUTTONS)
   - Just type anything and press Enter or Send
   - Auto-detect: Islam duas, AI concepts, Math, Tools, Quiz, General chat
   - Offline (works on GitHub Pages)
========================================================= */

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
  welcome();
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

  if (isGuest) {
    userLabel.innerText = "👤 Guest Mode (No account)";
  } else {
    userLabel.innerText = "✅ Logged in as: " + currentUser;
  }

  chat.innerHTML = "";
  chatLog = [];
  welcome();
}

/* ---------- Welcome ---------- */
function welcome() {
  addMsg("Assalamualaikum 😊💙 Welcome to StudyBuddy AI!", "bot");
  addMsg(
    "No modes, no buttons.\nJust type anything like:\n• dua enter home\n• what is AI vs ML vs DL\n• solve: 2x+5=15\n• summarize: (text)\n• start quiz\n\nAnd I will understand automatically.",
    "bot"
  );
}

/* =========================================================
   MAIN SEND
========================================================= */
function send() {
  const t = input.value.trim();
  if (!t) return;
  input.value = "";
  addMsg(t, "user");

  const lower = t.toLowerCase();

  // Priority: Islam Duas
  if (isIslamRequest(lower)) return handleIslam(lower);

  // Priority: Tools commands
  if (isToolsRequest(lower)) return handleTools(t);

  // Priority: Math
  if (isMathRequest(lower)) return handleMath(t);

  // Priority: Quiz
  if (isQuizRequest(lower)) return handleQuiz(lower);

  // Priority: AI Learn
  if (isAIQuestion(lower)) return addMsg(getAIAnswer(lower), "bot");

  // Otherwise: General chat
  return handleChat(t);
}

/* =========================================================
   GENERAL CHAT
========================================================= */
function handleChat(q) {
  const lower = q.toLowerCase();

  // greetings
  if (lower === "hi" || lower.includes("hello") || lower.includes("hey")) {
    addMsg("Hello 😊 I'm StudyBuddy AI. How can I help you today?", "bot");
    return;
  }

  if (lower.includes("assalam") || lower.includes("salam")) {
    addMsg("Wa Alaikum Assalam 😊💙", "bot");
    return;
  }

  if (lower.includes("how are you")) {
    addMsg(
      "I'm doing great Alhamdulillah 😊\nI'm ready to help you with study, coding, AI, math, quizzes, and Islam.",
      "bot"
    );
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
        "• Islamic duas\n" +
        "• Writing + tools\n\n" +
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
        "✅ Give Islamic duas with meaning\n" +
        "✅ Tools: summarize, notes, translate, MCQs\n\n" +
        "And I work fully offline on GitHub Pages.",
      "bot"
    );
    return;
  }

  // FIXED: who made you (ALWAYS this)
  if (lower.includes("who made you") || lower.includes("who created you")) {
    addMsg(
      "I was made by a young Muslim developer (Named Muhammad Yousaf) 💙✨",
      "bot"
    );
    return;
  }

  // fallback
  addMsg(
    "I understand 😊\n\nTry:\n• dua enter home\n• explain AI vs ML vs DL\n• solve: 5+9*2\n• summarize: (paste text)\n• start quiz",
    "bot"
  );
}

/* =========================================================
   DETECTORS
========================================================= */
function isMathRequest(t) {
  if (t.includes("solve:") || t.includes("calc:")) return true;
  if (t.match(/^\s*[\d\.\+\-\*\/\(\)\s]+$/)) return true;
  if (t.includes("=") && t.includes("x")) return true;
  return false;
}

function isQuizRequest(t) {
  return (
    t.includes("quiz") ||
    t.includes("start quiz") ||
    t.includes("mcq") ||
    t.includes("question")
  );
}

function isToolsRequest(t) {
  const lower = t.toLowerCase();
  return (
    lower.startsWith("summarize:") ||
    lower.startsWith("notes:") ||
    lower.startsWith("bullet points:") ||
    lower.startsWith("explain easy:") ||
    lower.startsWith("make mcqs:") ||
    lower.startsWith("translate to urdu:") ||
    lower.startsWith("translate to english:") ||
    lower.startsWith("write essay on:") ||
    lower.startsWith("write application:") ||
    lower.startsWith("write email:") ||
    lower.startsWith("write story:") ||
    lower.startsWith("write poem:")
  );
}

function isIslamRequest(t) {
  const keys = [
    "dua",
    "duaa",
    "enter home",
    "leave home",
    "enter mosque",
    "leave mosque",
    "in trouble",
    "debt",
    "worry",
    "mosque dua",
    "home dua",
  ];
  return keys.some((k) => t.includes(k));
}

/* =========================================================
   ISLAM MODE (DUAS + MEANING + TRANSLITERATION)
========================================================= */
function handleIslam(q) {
  // ENTER HOME
  if (q.includes("enter home") || q.includes("dua enter home")) {
    return addMsg(
      "🏠 Dua to ENTER Home\n\n" +
        "Arabic:\n" +
        "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا\n\n" +
        "Transliteration:\n" +
        "Bismillāhi walajnā, wa bismillāhi kharajnā, wa ‘alā Rabbinā tawakkalnā.\n\n" +
        "Meaning:\n" +
        "In the name of Allah we enter, in the name of Allah we leave, and upon our Lord we rely.",
      "bot"
    );
  }

  // LEAVE HOME
  if (q.includes("leave home") || q.includes("leaving home") || q.includes("dua leave home")) {
    return addMsg(
      "🚪 Dua to LEAVE Home\n\n" +
        "Arabic:\n" +
        "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ\n\n" +
        "Transliteration:\n" +
        "Bismillāh, tawakkaltu ‘alallāh, wa lā ḥawla wa lā quwwata illā billāh.\n\n" +
        "Meaning:\n" +
        "In the name of Allah, I rely upon Allah, and there is no power and no strength except with Allah.",
      "bot"
    );
  }

  // ENTER MOSQUE
  if (q.includes("enter mosque") || q.includes("dua enter mosque")) {
    return addMsg(
      "🕌 Dua to ENTER Mosque\n\n" +
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
  if (q.includes("leave mosque") || q.includes("dua leave mosque")) {
    return addMsg(
      "🕌 Dua to LEAVE Mosque\n\n" +
        "Arabic:\n" +
        "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ\n\n" +
        "Transliteration:\n" +
        "Allāhumma innī as’aluka min faḍlik.\n\n" +
        "Meaning:\n" +
        "O Allah, I ask You from Your فضل (bounty).",
      "bot"
    );
  }

  // IN TROUBLE
  if (q.includes("trouble") || q.includes("dua in trouble")) {
    return addMsg(
      "😟 Dua to Read When You Are In Trouble\n\n" +
        "Arabic:\n" +
        "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ\n\n" +
        "Transliteration:\n" +
        "Ḥasbunallāhu wa ni‘mal-wakīl.\n\n" +
        "Meaning:\n" +
        "Allah is sufficient for us, and He is the best disposer of affairs.",
      "bot"
    );
  }

  // DEBT + WORRY
  if (q.includes("debt") || q.includes("worry") || q.includes("dua for debt") || q.includes("dua for worry")) {
    return addMsg(
      "💸 Dua for Debt + Worry\n\n" +
        "Arabic:\n" +
        "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ\n\n" +
        "Transliteration:\n" +
        "Allāhumma innī a‘ūdhu bika minal-hammi wal-ḥazan, wa a‘ūdhu bika minal-‘ajzi wal-kasal, wa a‘ūdhu bika minal-jubni wal-bukhl, wa a‘ūdhu bika min ghalabatid-dayni wa qahrir-rijāl.\n\n" +
        "Meaning:\n" +
        "O Allah, I seek refuge in You from worry and grief, from weakness and laziness, from cowardice and miserliness, and from being overcome by debt and overpowered by people.",
      "bot"
    );
  }

  // default islam help
  addMsg(
    "🕌 Islamic Help:\nType exactly:\n• dua enter home\n• dua leave home\n• dua enter mosque\n• dua leave mosque\n• dua in trouble\n• dua for debt and worry",
    "bot"
  );
}

/* =========================================================
   TOOLS MODE (NO BUTTONS)
========================================================= */
function handleTools(text) {
  const lower = text.toLowerCase();

  // Summarize
  if (lower.startsWith("summarize:")) {
    const content = text.slice("summarize:".length).trim();
    if (!content) return addMsg("Please paste text after summarize:", "bot");
    return addMsg(
      "🧠 Summary:\n" +
        makeSummary(content),
      "bot"
    );
  }

  // Notes
  if (lower.startsWith("notes:")) {
    const content = text.slice("notes:".length).trim();
    if (!content) return addMsg("Please paste text after notes:", "bot");
    return addMsg("📝 Notes:\n" + makeNotes(content), "bot");
  }

  // Bullet points
  if (lower.startsWith("bullet points:")) {
    const content = text.slice("bullet points:".length).trim();
    if (!content) return addMsg("Please paste text after bullet points:", "bot");
    return addMsg("• " + makeBullets(content).join("\n• "), "bot");
  }

  // Explain easy
  if (lower.startsWith("explain easy:")) {
    const content = text.slice("explain easy:".length).trim();
    if (!content) return addMsg("Please paste text after explain easy:", "bot");
    return addMsg("😊 Easy Explanation:\n" + explainEasy(content), "bot");
  }

  // Translate (simple offline)
  if (lower.startsWith("translate to urdu:")) {
    return addMsg(
      "⚠ Offline Translation Note:\nThis app is fully offline, so I can only do basic manual translation.\n\n(Feature upgrade: add a small built-in dictionary.)",
      "bot"
    );
  }
  if (lower.startsWith("translate to english:")) {
    return addMsg(
      "⚠ Offline Translation Note:\nThis app is fully offline, so I can only do basic manual translation.\n\n(Feature upgrade: add a small built-in dictionary.)",
      "bot"
    );
  }

  // MCQs
  if (lower.startsWith("make mcqs:")) {
    const content = text.slice("make mcqs:".length).trim();
    if (!content) return addMsg("Please paste text after make mcqs:", "bot");
    return addMsg("🧠 MCQs:\n" + makeMCQs(content), "bot");
  }

  // Writing tools
  if (lower.startsWith("write essay on:")) {
    const topic = text.slice("write essay on:".length).trim();
    return addMsg(writeEssay(topic), "bot");
  }
  if (lower.startsWith("write application:")) {
    const topic = text.slice("write application:".length).trim();
    return addMsg(writeApplication(topic), "bot");
  }
  if (lower.startsWith("write email:")) {
    const topic = text.slice("write email:".length).trim();
    return addMsg(writeEmail(topic), "bot");
  }
  if (lower.startsWith("write story:")) {
    const topic = text.slice("write story:".length).trim();
    return addMsg(writeStory(topic), "bot");
  }
  if (lower.startsWith("write poem:")) {
    const topic = text.slice("write poem:".length).trim();
    return addMsg(writePoem(topic), "bot");
  }

  addMsg("Tools: summarize:, notes:, bullet points:, explain easy:, make mcqs:", "bot");
}

/* =========================================================
   MATH MODE (OFFLINE)
========================================================= */
function handleMath(text) {
  let expr = text.trim();

  if (expr.toLowerCase().startsWith("calc:")) expr = expr.slice(5).trim();
  if (expr.toLowerCase().startsWith("solve:")) expr = expr.slice(6).trim();

  // Very basic equation solver: ax+b=c
  if (expr.includes("x") && expr.includes("=")) {
    const ans = solveLinearEquation(expr);
    return addMsg(ans, "bot");
  }

  // Basic calculator
  if (!expr.match(/^[0-9\.\+\-\*\/\(\)\s]+$/)) {
    return addMsg("Math: Type like `calc: 5+9*2` or `solve: 2x+5=15`", "bot");
  }

  try {
    const result = Function("return (" + expr + ")")();
    addMsg("➗ Answer: " + result, "bot");
  } catch (e) {
    addMsg("❌ Math error. Try: calc: 10/2+7", "bot");
  }
}

function solveLinearEquation(eq) {
  // Supports: 2x+5=15, 3x-7=2
  try {
    eq = eq.replace(/\s+/g, "");
    const parts = eq.split("=");
    if (parts.length !== 2) return "❌ Equation format wrong.";

    const left = parts[0];
    const right = parseFloat(parts[1]);

    // extract ax + b
    // Examples:
    // 2x+5
    // x+5
    // 3x-7
    // -2x+1
    let a = 1;
    let b = 0;

    let lx = left;

    // handle like "x+5"
    lx = lx.replace("x", "1x");
    lx = lx.replace("+1x", "+1x");
    lx = lx.replace("-1x", "-1x");

    // Find coefficient
    const matchA = lx.match(/([\-]?\d*\.?\d*)x/);
    if (!matchA) return "❌ Only simple x equations supported.";

    let aStr = matchA[1];
    if (aStr === "" || aStr === "+") aStr = "1";
    if (aStr === "-") aStr = "-1";
    a = parseFloat(aStr);

    // Remove ax
    const after = lx.replace(matchA[0], "");
    if (after) b = parseFloat(after);
    if (isNaN(b)) b = 0;

    const x = (right - b) / a;
    return "✅ Solution:\n" + eq + "\n\nx = " + x;
  } catch (e) {
    return "❌ Sorry, I can only solve simple equations like: 2x+5=15";
  }
}

/* =========================================================
   QUIZ MODE (SIMPLE)
========================================================= */
let quizOn = false;
let quizScore = 0;
let quizQ = 0;

const quizBank = [
  { q: "What does AI stand for?", a: "artificial intelligence" },
  { q: "ML is a subset of what?", a: "ai" },
  { q: "DL uses what type of networks?", a: "neural networks" },
  { q: "What is the capital of France?", a: "paris" },
  { q: "2+2=?", a: "4" },
];

function handleQuiz(t) {
  if (t.includes("start quiz")) {
    quizOn = true;
    quizScore = 0;
    quizQ = 0;
    addMsg("🧠 Quiz Started! Answer in text.", "bot");
    return askQuiz();
  }

  if (!quizOn) {
    addMsg("Type: start quiz", "bot");
    return;
  }

  const ans = t.trim().toLowerCase();
  const correct = quizBank[quizQ - 1].a;

  if (ans.includes(correct)) {
    quizScore++;
    addMsg("✅ Correct!", "bot");
  } else {
    addMsg("❌ Wrong. Correct answer: " + correct, "bot");
  }

  if (quizQ >= quizBank.length) {
    quizOn = false;
    addMsg("🏁 Quiz Finished!\nScore: " + quizScore + "/" + quizBank.length, "bot");
    return;
  }

  askQuiz();
}

function askQuiz() {
  const item = quizBank[quizQ];
  quizQ++;
  addMsg("Q" + quizQ + ") " + item.q, "bot");
}

/* =========================================================
   AI KNOWLEDGE (YOUR TOPICS)
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
  // AI ML DL
  if (
    t.includes("ai vs ml") ||
    t.includes("ml vs ai") ||
    t.includes("ai ml dl") ||
    t.includes("deep learning") ||
    t.includes("dl")
  ) {
    return (
      "✅ AI vs ML vs DL (Simple + Strong)\n\n" +
      "• AI (Artificial Intelligence): Making machines act smart.\n" +
      "• ML (Machine Learning): A part of AI where the machine learns from data.\n" +
      "• DL (Deep Learning): A part of ML that uses multi-layer neural networks.\n\n" +
      "Example:\n" +
      "AI = Whole field\nML = Learning from data\nDL = Neural networks learning deeply"
    );
  }

  // Generative AI
  if (t.includes("generative ai")) {
    return (
      "✅ Generative AI\n\n" +
      "Generative AI is AI that can CREATE new content like:\n" +
      "• Text (stories, answers)\n" +
      "• Images\n" +
      "• Code\n" +
      "• Music\n\n" +
      "It doesn’t only classify — it generates."
    );
  }

  // Turing Test
  if (t.includes("turing test")) {
    return (
      "✅ Turing Test\n\n" +
      "The Turing Test checks if a machine can talk like a human.\n" +
      "If people cannot tell whether they are talking to a human or machine, the AI passes."
    );
  }

  // Neural Networks
  if (t.includes("neural network")) {
    return (
      "✅ Neural Networks\n\n" +
      "Neural networks are models inspired by the human brain.\n" +
      "They learn patterns from data and are used in:\n" +
      "• Image recognition\n" +
      "• Speech\n" +
      "• Chatbots\n" +
      "• Predictions"
    );
  }

  // NLP
  if (t.includes("nlp")) {
    return (
      "✅ NLP (Natural Language Processing)\n\n" +
      "NLP is the technology that helps computers understand human language.\n\n" +
      "Examples:\n" +
      "• Chatbots\n" +
      "• Translation\n" +
      "• Text summarizing\n" +
      "• Speech-to-text"
    );
  }

  // Computer Vision
  if (t.includes("computer vision")) {
    return (
      "✅ Computer Vision\n\n" +
      "Computer Vision is AI that helps machines understand images/videos.\n\n" +
      "Examples:\n" +
      "• Face detection\n" +
      "• Object detection\n" +
      "• Self-driving cars"
    );
  }

  // Learning Types
  if (t.includes("supervised")) {
    return (
      "✅ Supervised Learning\n\n" +
      "Supervised learning means the model learns using labeled data.\n\n" +
      "Example:\n" +
      "Pictures labeled: Cat / Dog."
    );
  }
  if (t.includes("unsupervised")) {
    return (
      "✅ Unsupervised Learning\n\n" +
      "Unsupervised learning means the model learns from unlabeled data.\n\n" +
      "Example:\n" +
      "Clustering similar students by marks."
    );
  }
  if (t.includes("reinforcement")) {
    return (
      "✅ Reinforcement Learning\n\n" +
      "The AI learns by rewards and punishments.\n\n" +
      "Example:\n" +
      "A game AI learns by winning/losing."
    );
  }

  // Hallucinations
  if (t.includes("hallucination")) {
    return (
      "✅ AI Hallucinations\n\n" +
      "Hallucination happens when an AI confidently gives wrong information.\n" +
      "It sounds correct but is actually false."
    );
  }

  // Overfitting
  if (t.includes("overfitting")) {
    return (
      "✅ Overfitting\n\n" +
      "Overfitting happens when a model learns training data too perfectly,\n" +
      "but fails on new data.\n\n" +
      "It memorizes instead of understanding."
    );
  }

  // Gradient Descent
  if (t.includes("gradient descent")) {
    return (
      "✅ Gradient Descent\n\n" +
      "Gradient Descent is an optimization method used to reduce error.\n" +
      "It adjusts model parameters step-by-step to minimize the loss function."
    );
  }

  // Normalization
  if (t.includes("normalization")) {
    return (
      "✅ Data Normalization\n\n" +
      "Normalization scales input values into a similar range (like 0 to 1).\n" +
      "It helps models train faster and better."
    );
  }

  // Ethics + Bias
  if (t.includes("ethical ai") || t.includes("ethics")) {
    return (
      "✅ Ethical AI\n\n" +
      "Ethical AI means AI should be:\n" +
      "• Fair\n" +
      "• Transparent\n" +
      "• Safe\n" +
      "• Private\n" +
      "• Secure\n" +
      "• Accountable"
    );
  }

  if (t.includes("bias")) {
    return (
      "✅ AI Bias\n\n" +
      "AI bias means unfair results because of biased data or wrong training.\n" +
      "It can cause discrimination."
    );
  }

  // Narrow AI vs AGI
  if (t.includes("narrow ai")) {
    return (
      "✅ Narrow AI\n\n" +
      "Narrow AI is AI designed for one task.\n" +
      "Example: Face recognition, chatbots, calculators."
    );
  }
  if (t.includes("agi")) {
    return (
      "✅ AGI (Artificial General Intelligence)\n\n" +
      "AGI is a theoretical AI that can think and learn like humans in every task.\n" +
      "AGI does NOT exist yet."
    );
  }

  // 30% Rule
  if (t.includes("30% rule")) {
    return (
      "✅ The 30% Rule\n\n" +
      "It suggests AI can automate around one-third of workplace tasks.\n" +
      "Humans will still be needed for judgment and creativity."
    );
  }

  // Loss / Cost function
  if (t.includes("loss function") || t.includes("cost function")) {
    return (
      "✅ Loss / Cost Function\n\n" +
      "A loss function measures how wrong a model is.\n" +
      "Training tries to reduce this error using gradient descent."
    );
  }

  // Agentic AI
  if (t.includes("agentic ai")) {
    return (
      "✅ Agentic AI\n\n" +
      "Agentic AI is AI that can take actions by itself to achieve a goal.\n" +
      "Example: planning steps, executing tasks, and checking results."
    );
  }

  return (
    "🤖 AI Learn:\nAsk about:\n• AI vs ML vs DL\n• NLP\n• Computer Vision\n• Overfitting\n• Gradient Descent\n• Ethical AI\n• Bias\n• AGI"
  );
}

/* =========================================================
   SIMPLE OFFLINE TEXT HELPERS
========================================================= */
function makeSummary(text) {
  // simple offline summary: take first 2-3 sentences
  const parts = text.replace(/\n+/g, " ").split(".").map(s => s.trim()).filter(Boolean);
  if (parts.length <= 2) return text.trim();
  return parts.slice(0, 3).join(". ") + ".";
}

function makeNotes(text) {
  const lines = makeBullets(text);
  return lines.slice(0, 6).map((x) => "• " + x).join("\n");
}

function makeBullets(text) {
  const clean = text.replace(/\n+/g, " ").trim();
  const chunks = clean.split(/[,\.]/).map(s => s.trim()).filter(Boolean);
  return chunks.slice(0, 10);
}

function explainEasy(text) {
  return (
    "Here is an easy explanation:\n\n" +
    text.slice(0, 300) +
    (text.length > 300 ? "..." : "")
  );
}

function makeMCQs(text) {
  // basic offline MCQs (template)
  return (
    "1) What is the main idea of the text?\nA) Option A\nB) Option B\nC) Option C\nD) Option D\n\n" +
    "2) Which statement is correct?\nA) Option A\nB) Option B\nC) Option C\nD) Option D\n\n" +
    "3) What does this term mean?\nA) Option A\nB) Option B\nC) Option C\nD) Option D\n\n" +
    "Answer Key (example): 1-C, 2-A, 3-B"
  );
}

/* =========================================================
   WRITING TOOLS (OFFLINE)
========================================================= */
function writeEssay(topic) {
  if (!topic) return "Write: write essay on: (topic)";
  return (
    "✍️ Essay on: " + topic + "\n\n" +
    topic + " is an important topic. It plays a big role in our daily life. " +
    "We should understand it deeply and use it in a positive way. " +
    "In conclusion, " + topic + " helps us improve our knowledge and become better people."
  );
}
function writeApplication(topic) {
  if (!topic) return "Write: write application: (reason)";
  return (
    "📝 Application\n\n" +
    "To,\nThe Principal,\n[School Name]\n\n" +
    "Subject: " + topic + "\n\n" +
    "Respected Sir/Madam,\n" +
    "I am a student of your school. I request you kindly to grant me permission for " +
    topic +
    ".\n\nThank you.\n\nYours obediently,\n[Your Name]\n[Class]"
  );
}
function writeEmail(topic) {
  if (!topic) return "Write: write email: (topic)";
  return (
    "📧 Email\n\n" +
    "Subject: " + topic + "\n\n" +
    "Hello,\n\nI hope you are doing well. I am writing regarding " +
    topic +
    ". Please let me know the details.\n\nThank you.\n\nRegards,\n[Your Name]"
  );
}
function writeStory(topic) {
  if (!topic) return "Write: write story: (topic)";
  return (
    "📖 Story: " + topic + "\n\n" +
    "Once upon a time, there was a student named Yousaf who wanted to build the best AI app. " +
    "He worked hard every day and never gave up. Finally, his StudyBuddy AI became famous. " +
    "Moral: Hard work and faith always win."
  );
}
function writePoem(topic) {
  if (!topic) return "Write: write poem: (topic)";
  return (
    "📝 Poem on: " + topic + "\n\n" +
    topic + " is shining bright,\n" +
    "Like stars that glow at night,\n" +
    "With hope and faith we stand,\n" +
    "Success is close at hand."
  );
}

/* =========================================================
   EVENTS (IMPORTANT FOR BUTTONS WORKING)
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  // Theme load
  const isLight = lsGet("sb_theme_light", false);
  if (isLight) document.body.classList.add("light");

  // Auto login
  const saved = lsGet("sb_currentUser", null);
  if (saved) {
    currentUser = saved;
    startApp(false);
  } else {
    showPage("page-login");
  }

  // Events
  signupBtn.addEventListener("click", signup);
  loginBtn.addEventListener("click", login);
  guestBtn.addEventListener("click", guest);

  logoutBtn.addEventListener("click", logout);

  sendBtn.addEventListener("click", send);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
  });

  themeBtn.addEventListener("click", toggleTheme);
  exportBtn.addEventListener("click", exportChat);
  resetBtn.addEventListener("click", resetAll);
});
