/* =========================
   GLOBAL SETTINGS + STORAGE
========================= */

let SB_MODE = localStorage.getItem("SB_MODE") || "study";
let CG_MODE = localStorage.getItem("CG_MODE") || "smart";
let THEME = localStorage.getItem("THEME") || "dark";

const SB_CHAT_KEY = "SB_CHAT_LOG";
const CG_CHAT_KEY = "CG_CHAT_LOG";

function $(id){ return document.getElementById(id); }

window.onload = () => {
  applyTheme();
  showPage("home");
  setupModesUI();
  loadChats();
  fillMinecraftCommand();
};

/* =========================
   PAGE SYSTEM (BUTTON FIX)
========================= */

function showPage(pageName){
  // Hide all pages
  document.querySelectorAll(".page").forEach(p => p.classList.remove("show"));

  // Show selected
  const page = document.getElementById("page-" + pageName);
  if(page) page.classList.add("show");

  // Nav active
  document.querySelectorAll(".navbtn").forEach(b => b.classList.remove("active"));
  const btns = document.querySelectorAll(".navbtn");
  btns.forEach(btn=>{
    if(btn.getAttribute("onclick")?.includes("'" + pageName + "'")){
      btn.classList.add("active");
    }
  });
}

/* =========================
   THEME
========================= */

function toggleTheme(){
  THEME = (THEME === "dark") ? "light" : "dark";
  localStorage.setItem("THEME", THEME);
  applyTheme();
}

function applyTheme(){
  if(THEME === "light") document.body.classList.add("light");
  else document.body.classList.remove("light");
}

/* =========================
   AUTH SYSTEM (LOCAL)
========================= */

function openAuth(){
  $("authModal").classList.add("show");
  authTab("login");
}

function closeAuth(){
  $("authModal").classList.remove("show");
}

function authTab(tab){
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  document.querySelectorAll(".authPage").forEach(p=>p.classList.remove("show"));

  if(tab==="login"){
    document.querySelectorAll(".tab")[0].classList.add("active");
    $("auth-login").classList.add("show");
  }
  if(tab==="signup"){
    document.querySelectorAll(".tab")[1].classList.add("active");
    $("auth-signup").classList.add("show");
  }
  if(tab==="guest"){
    document.querySelectorAll(".tab")[2].classList.add("active");
    $("auth-guest").classList.add("show");
  }
}

function doSignup(){
  const email = $("signupEmail").value.trim();
  const pass = $("signupPass").value.trim();
  if(!email || !pass) return alert("Enter email and password!");

  localStorage.setItem("USER_EMAIL", email);
  localStorage.setItem("USER_PASS", pass);

  alert("Account created! Now login.");
  authTab("login");
}

function doLogin(){
  const email = $("loginEmail").value.trim();
  const pass = $("loginPass").value.trim();

  const savedE = localStorage.getItem("USER_EMAIL");
  const savedP = localStorage.getItem("USER_PASS");

  if(email === savedE && pass === savedP){
    localStorage.setItem("LOGGED_IN", "yes");
    alert("Login success!");
    closeAuth();
  }else{
    alert("Wrong email or password!");
  }
}

function useGuest(){
  localStorage.setItem("LOGGED_IN", "guest");
  alert("Guest mode enabled!");
  closeAuth();
}

/* =========================
   STUDYBUDDY AI
========================= */

function setSBMode(mode){
  SB_MODE = mode;
  localStorage.setItem("SB_MODE", SB_MODE);
  setupModesUI();
  sbSystemMessage("Mode changed to: " + mode.toUpperCase());
}

function sbSystemMessage(text){
  addMsg("sbChat", "bot", "📚 StudyBuddy: " + text);
  saveChats();
}

function sbSend(){
  const input = $("sbInput");
  const text = input.value.trim();
  if(!text) return;

  addMsg("sbChat", "user", text);
  input.value = "";

  const reply = sbBrain(text);
  addMsg("sbChat", "bot", reply);

  saveChats();
}

function sbBrain(q){
  const question = q.toLowerCase();

  // Basic
  if(question.includes("hi") || question.includes("hello"))
    return "Hello! 👋 I am StudyBuddy AI. Ask me anything.";

  if(question.includes("who are you"))
    return "I am StudyBuddy AI — your study helper, exam assistant, and coding tutor.";

  if(question.includes("who made you"))
    return "I was made by YOU 😎 (Yousaf) using HTML, CSS, and JavaScript.";

  if(question.includes("how are you"))
    return "I am great! Ready to help you study 💙";

  // Modes
  if(SB_MODE === "exam"){
    return "📝 Exam Mode Answer:\n" + quickAnswer(question);
  }

  if(SB_MODE === "coding"){
    return "💻 Coding Mode:\n" + codingAnswer(question);
  }

  if(SB_MODE === "summarize"){
    return "📌 Summarize Mode:\nPaste your text and I will summarize it.";
  }

  if(SB_MODE === "translate"){
    return "🌍 Translate Mode:\nTell me what sentence and which language.";
  }

  // Default study mode
  return "📚 Study Mode:\n" + quickAnswer(question);
}

function quickAnswer(q){
  // Simple built-in knowledge
  if(q.includes("capital of france")) return "The capital of France is Paris.";
  if(q.includes("capital of japan")) return "The capital of Japan is Tokyo.";
  if(q.includes("h2o") || q.includes("water formula")) return "Water formula is H₂O.";

  if(q.includes("artificial intelligence") || q.includes("what is ai")){
    return "Artificial Intelligence (AI) is technology that allows computers to learn, reason, and solve problems like humans.";
  }

  if(q.includes("machine learning")){
    return "Machine Learning is a part of AI where computers learn patterns from data instead of being manually programmed.";
  }

  if(q.includes("neural network")){
    return "Neural Networks are AI models inspired by the human brain, used for learning complex patterns.";
  }

  if(q.includes("sleep")){
    return "To improve sleep: keep a fixed schedule, avoid screens before bed, and reduce caffeine.";
  }

  if(q.includes("gift ideas")){
    return "Gift ideas: custom mug, photo frame, handwritten letter, headphones, books, perfume.";
  }

  if(q.includes("summarize")){
    return "Paste your text and I will summarize it for you.";
  }

  // Math detection (simple)
  if(q.match(/[0-9]+\s*[\+\-\*\/]\s*[0-9]+/)){
    try{
      const safe = q.replace(/[^0-9+\-*/(). ]/g,"");
      const ans = Function("return " + safe)();
      return "Answer: " + ans;
    }catch(e){
      return "I could not solve that math problem.";
    }
  }

  return "I can answer general knowledge, definitions, math, coding help, and study questions. Ask me anything!";
}

function codingAnswer(q){
  if(q.includes("best coding languages for ai")){
    return "Best AI languages: Python, R, Java, C++, JavaScript.\nMost popular: Python.";
  }

  if(q.includes("function")){
    return "Example JavaScript function:\n\nfunction add(a,b){\n  return a+b;\n}";
  }

  return "Tell me what code you want and I will write it.";
}

function sbExport(){
  const text = $("sbChat").innerText;
  downloadText("studybuddy_chat.txt", text);
}

function sbReset(){
  $("sbChat").innerHTML = "";
  saveChats();
}

/* =========================
   CHATGPT CLONE
========================= */

function setCGMode(mode){
  CG_MODE = mode;
  localStorage.setItem("CG_MODE", CG_MODE);
  setupModesUI();
  addMsg("cgChat","bot","🤖 Mode changed to: " + mode.toUpperCase());
  saveChats();
}

function cgSend(){
  const input = $("cgInput");
  const text = input.value.trim();
  if(!text) return;

  addMsg("cgChat", "user", text);
  input.value = "";

  const reply = cgBrain(text);
  addMsg("cgChat", "bot", reply);

  saveChats();
}

function cgBrain(t){
  const q = t.toLowerCase();

  if(q.includes("hi") || q.includes("hello")) return "Hello 😄 I am your Super ChatGPT Clone!";
  if(q.includes("who are you")) return "I am your AI chatbot built inside StudyBuddy AI.";
  if(q.includes("what can you do")) return "I can chat, answer questions, help coding, and give ideas.";
  if(q.includes("who made you")) return "You made me 😎 (Yousaf).";

  if(CG_MODE === "creative"){
    return "✨ Creative Answer:\n" + "Here is a creative response: " + t;
  }

  if(CG_MODE === "coding"){
    return "💻 Coding Mode:\n" + "Tell me your programming language and I will write the code.";
  }

  if(CG_MODE === "strict"){
    return "✅ Strict Answer:\n" + "Please ask one clear question.";
  }

  return "🤖 Smart Answer:\n" + quickAnswer(q);
}

function cgExport(){
  const text = $("cgChat").innerText;
  downloadText("chatgpt_clone_chat.txt", text);
}

function cgReset(){
  $("cgChat").innerHTML = "";
  saveChats();
}

/* =========================
   CHAT UI HELPERS
========================= */

function addMsg(chatId, who, text){
  const box = document.createElement("div");
  box.className = "msg " + who;
  box.textContent = text;

  $(chatId).appendChild(box);
  $(chatId).scrollTop = $(chatId).scrollHeight;
}

function saveChats(){
  localStorage.setItem(SB_CHAT_KEY, $("sbChat").innerHTML);
  localStorage.setItem(CG_CHAT_KEY, $("cgChat").innerHTML);
}

function loadChats(){
  const sb = localStorage.getItem(SB_CHAT_KEY);
  const cg = localStorage.getItem(CG_CHAT_KEY);

  if(sb) $("sbChat").innerHTML = sb;
  if(cg) $("cgChat").innerHTML = cg;
}

function setupModesUI(){
  // StudyBuddy chips
  const sbChips = document.querySelectorAll("#page-study .chip");
  sbChips.forEach(c=>c.classList.remove("active"));
  sbChips.forEach(c=>{
    if(c.innerText.toLowerCase().includes(SB_MODE)) c.classList.add("active");
  });

  // ChatGPT chips
  const cgChips = document.querySelectorAll("#page-chat .chip");
  cgChips.forEach(c=>c.classList.remove("active"));
  cgChips.forEach(c=>{
    if(c.innerText.toLowerCase().includes(CG_MODE)) c.classList.add("active");
  });
}

/* =========================
   MINECRAFT COMMANDS
========================= */

function fillMinecraftCommand(){
  const cmd =
`/execute as @p run effect give @p minecraft:strength 999999 255 true
/effect give @p minecraft:resistance 999999 255 true
/effect give @p minecraft:regeneration 999999 10 true
/effect give @p minecraft:fire_resistance 999999 1 true
/effect give @p minecraft:invisibility 999999 1 true
/effect give @p minecraft:night_vision 999999 1 true
/effect give @p minecraft:speed 999999 5 true
/effect give @p minecraft:jump_boost 999999 5 true
/effect give @p minecraft:haste 999999 10 true
/effect give @p minecraft:absorption 999999 10 true
/effect give @p minecraft:slow_falling 999999 1 true
/effect give @p minecraft:water_breathing 999999 1 true
/effect give @p minecraft:saturation 999999 1 true
/effect give @p minecraft:health_boost 999999 10 true
/effect give @p minecraft:conduit_power 999999 1 true
/kill @e[type=!player,distance=..20]
/particle minecraft:ash ~ ~2 ~ 1 1 1 0 80 force @a
/title @a title {"text":"HEROBRINE GOD HAS ARRIVED","color":"dark_red","bold":true}
 /give @p minecraft:netherite_sword{Enchantments:[{id:sharpness,lvl:1000},{id:fire_aspect,lvl:1000},{id:knockback,lvl:1000},{id:unbreaking,lvl:1000}],Unbreakable:1b} 1
/give @p minecraft:netherite_helmet{Enchantments:[{id:protection,lvl:1000},{id:unbreaking,lvl:1000}],Unbreakable:1b} 1
/give @p minecraft:netherite_chestplate{Enchantments:[{id:protection,lvl:1000},{id:unbreaking,lvl:1000}],Unbreakable:1b} 1
/give @p minecraft:netherite_leggings{Enchantments:[{id:protection,lvl:1000},{id:unbreaking,lvl:1000}],Unbreakable:1b} 1
/give @p minecraft:netherite_boots{Enchantments:[{id:protection,lvl:1000},{id:unbreaking,lvl:1000}],Unbreakable:1b} 1
/summon wolf ~ ~ ~ {CustomName:'{"text":"Herobrine"}',CustomNameVisible:1b,Tame:1b,Invulnerable:1b,PersistenceRequired:1b}`;

  $("mcGodCmd").value = cmd;
}

function copyText(id){
  const el = $(id);
  el.select();
  el.setSelectionRange(0, 999999);
  document.execCommand("copy");
  alert("Copied!");
}

/* =========================
   MINI GAMES
========================= */

function rollDice(){
  const n = Math.floor(Math.random()*6)+1;
  $("diceResult").textContent = "🎲 " + n;
}

function flipCoin(){
  $("coinResult").textContent = (Math.random()<0.5) ? "HEADS 🟡" : "TAILS ⚪";
}

function randomNumber(){
  $("randResult").textContent = Math.floor(Math.random()*1000);
}

/* =========================
   DOWNLOAD + CLEAR
========================= */

function downloadText(filename, text){
  const blob = new Blob([text], {type:"text/plain"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

function clearAllData(){
  if(confirm("Clear all saved data?")){
    localStorage.clear();
    location.reload();
  }
}
