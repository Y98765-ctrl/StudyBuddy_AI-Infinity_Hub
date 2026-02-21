// ============================
// StudyBuddy AI - Ultimate Hub
// ============================

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const versionText = document.getElementById("versionText");
const upgradeBtn = document.getElementById("upgradeBtn");
const downgradeBtn = document.getElementById("downgradeBtn");
const themeBtn = document.getElementById("themeBtn");
const exportBtn = document.getElementById("exportBtn");
const resetBtn = document.getElementById("resetBtn");
const modeLabel = document.getElementById("modeLabel");

// ============================
// VERSION SYSTEM
// ============================

let currentVersion = localStorage.getItem("appVersion") || "1.0";

function updateVersionUI() {
  versionText.innerText = "Version: " + currentVersion;
  modeLabel.innerText = currentVersion === "1.0" ? "Free" : "Premium 💎";

  if (currentVersion === "1.0") {
    upgradeBtn.style.display = "inline-block";
    downgradeBtn.style.display = "none";
  } else {
    upgradeBtn.style.display = "none";
    downgradeBtn.style.display = "inline-block";
  }
}

upgradeBtn.onclick = () => {
  currentVersion = "1.1";
  localStorage.setItem("appVersion", currentVersion);
  updateVersionUI();
  addMsg("💎 Premium Mode Activated!", "bot");
};

downgradeBtn.onclick = () => {
  currentVersion = "1.0";
  localStorage.setItem("appVersion", currentVersion);
  updateVersionUI();
  addMsg("⬇ Back to Free Mode", "bot");
};

// ============================
// CHAT SYSTEM
// ============================

let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];

function saveChat() {
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

function addMsg(text, sender = "bot") {
  const div = document.createElement("div");
  div.classList.add("msg");
  div.classList.add(sender === "user" ? "user" : "bot");
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  chatHistory.push({ sender, text });
  saveChat();
}

function loadChat() {
  chatBox.innerHTML = "";
  chatHistory.forEach(m => {
    const div = document.createElement("div");
    div.classList.add("msg");
    div.classList.add(m.sender === "user" ? "user" : "bot");
    div.innerText = m.text;
    chatBox.appendChild(div);
  });
}

// ============================
// AI RESPONSES
// ============================

function getAIResponse(q) {
  q = q.toLowerCase();

  if (q.includes("who made you")) {
    return "I was created by Muhammad Yousaf 💙";
  }

  if (q.includes("salam")) {
    return "Wa Alaikum Assalam 😊";
  }

  if (q.match(/^\d+(\s*[\+\-\*\/]\s*\d+)+$/)) {
    return "🧮 Answer: " + eval(q);
  }

  if (currentVersion === "1.1") {
    if (q.includes("motivation")) {
      return "💎 You are stronger than your excuses. Keep going!";
    }
    if (q.includes("study")) {
      return "💎 Study 25 min, break 5 min. Sleep well. Make dua.";
    }
  }

  return "🤖 Ask me about dua, math, motivation or study tips.";
}

// ============================
// SEND MESSAGE
// ============================

function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMsg(text, "user");
  userInput.value = "";

  setTimeout(() => {
    addMsg(getAIResponse(text), "bot");
  }, 300);
}

sendBtn.onclick = sendMessage;

userInput.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

// ============================
// THEME
// ============================

themeBtn.onclick = () => {
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
};

if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
}

// ============================
// EXPORT CHAT
// ============================

exportBtn.onclick = () => {
  const blob = new Blob([JSON.stringify(chatHistory, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "StudyBuddyChat.json";
  a.click();
};

// ============================
// RESET
// ============================

resetBtn.onclick = () => {
  if (confirm("Reset everything?")) {
    localStorage.clear();
    location.reload();
  }
};

// ============================
// START
// ============================

updateVersionUI();
loadChat();

if (chatHistory.length === 0) {
  addMsg("👋 Assalamualaikum! I am your StudyBuddy AI 😊", "bot");
}
