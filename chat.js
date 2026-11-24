// AI assistant — loaded on demand by script.js (first open / hover of the chat button)
// ==================== FLOATING AI CHATBOT ====================
let chatHistory = [];
let chatBusy = false;

const CHAT_GREETING = "Hi! 👋 I'm Paul's AI assistant. Ask me about his work at **Neeyamo**, his **MCP servers**, projects, skills, or how to reach him.";

// Actions the assistant can trigger with tags like [[open:rag-assistant]]
const CHAT_ACTIONS = {
  open: {
    'aria': 'Aria & MCP details',
    'smart-nav': 'Smart Navigation details',
    'ai-didi': 'AI-DIDI details',
    'handwritten': 'Answer Evaluation details',
    'rag-assistant': 'Enterprise RAG details',
    'maitsys': 'Maitsys internship details'
  },
  goto: {
    'projects': 'Go to Projects',
    'experience': 'Go to Experience',
    'skills': 'Go to Tech Stack',
    'contact': 'Go to Contact'
  }
};

function toggleChat(force) {
  const panel = document.getElementById('chat-panel');
  const launcher = document.getElementById('chat-launcher');
  if (!panel) return;
  const open = typeof force === 'boolean' ? force : panel.classList.contains('hidden');
  panel.classList.toggle('hidden', !open);
  document.body.classList.toggle('chat-open', open);
  launcher?.setAttribute('aria-expanded', String(open));
  document.getElementById('chat-icon-open')?.classList.toggle('hidden', open);
  document.getElementById('chat-icon-close')?.classList.toggle('hidden', !open);
  launcher?.setAttribute('aria-label', open ? 'Close AI assistant' : 'Open AI assistant');
  hideChatHint();
  if (open) {
    const container = document.getElementById('chat-messages');
    if (container && !container.children.length) resetChat();
    // Avoid popping the keyboard on phones; focus only on larger screens
    if (window.matchMedia('(min-width: 640px)').matches) {
      document.getElementById('chat-input')?.focus();
    }
  }
}



function handleChatSubmit(event) {
  event.preventDefault();
  const inputEl = document.getElementById('chat-input');
  if (!inputEl) return;
  const message = inputEl.value.trim();
  if (!message || chatBusy) return;
  inputEl.value = '';
  executeChatTurn(message);
}

function sendQuickPrompt(promptText) {
  if (chatBusy) return;
  toggleChat(true);
  executeChatTurn(promptText);
}

// Pull [[type:value]] tags out of a reply and return clean text + actions
function extractActions(text) {
  const actions = [];
  const clean = String(text).replace(/\[\[\s*(open|goto|copy-email)\s*(?::\s*([\w-]+))?\s*\]\]/gi, (_, type, value) => {
    type = type.toLowerCase();
    if (type === 'copy-email') actions.push({ type, label: 'Copy email' });
    else if (CHAT_ACTIONS[type] && CHAT_ACTIONS[type][value]) actions.push({ type, value, label: CHAT_ACTIONS[type][value] });
    return '';
  }).trim();
  const seen = new Set();
  return { clean, actions: actions.filter(a => { const k = a.type + (a.value || ''); if (seen.has(k)) return false; seen.add(k); return true; }) };
}

function runChatAction(type, value) {
  if (type === 'open') {
    openModal(value);
  } else if (type === 'goto') {
    if (window.matchMedia('(max-width: 639px)').matches) toggleChat(false);
    if (value === 'projects') filterCategory('all');
    document.getElementById(value)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if (type === 'copy-email') {
    copyEmail();
  }
}

function appendMessage(role, text) {
  const container = document.getElementById('chat-messages');
  if (!container) return;
  const msgDiv = document.createElement('div');

  if (role === 'user') {
    msgDiv.className = 'flex justify-end';
    msgDiv.innerHTML = `<div class="px-3 py-2 rounded-2xl rounded-tr-sm bg-teal-500 text-black font-medium leading-relaxed max-w-[85%] break-words">${escapeHtml(text)}</div>`;
  } else {
    const { clean, actions } = extractActions(text);
    msgDiv.className = 'flex items-start gap-2';
    const actionHtml = actions.length
      ? `<div class="flex flex-wrap gap-1.5 mt-2">${actions.map(a =>
          `<button class="chat-action" data-type="${a.type}" data-value="${a.value || ''}">${escapeHtml(a.label)} &rarr;</button>`).join('')}</div>`
      : '';
    msgDiv.innerHTML = `
      <div class="w-6 h-6 rounded-md bg-teal-500/20 text-teal-300 flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-mono">AI</div>
      <div class="px-3 py-2 rounded-2xl rounded-tl-sm bg-neutral-900 border border-neutral-800 text-neutral-300 leading-relaxed max-w-[88%] break-words">
        ${formatMarkdown(clean)}${actionHtml}
      </div>`;
    msgDiv.querySelectorAll('.chat-action').forEach(btn => {
      btn.addEventListener('click', () => runChatAction(btn.dataset.type, btn.dataset.value));
    });
  }
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

function appendTypingIndicator() {
  const container = document.getElementById('chat-messages');
  if (!container) return;
  const typingDiv = document.createElement('div');
  typingDiv.id = 'typing-indicator';
  typingDiv.className = 'flex items-start gap-2';
  typingDiv.innerHTML = `
    <div class="w-6 h-6 rounded-md bg-teal-500/20 text-teal-300 flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-mono">AI</div>
    <div class="px-3 py-2.5 rounded-2xl rounded-tl-sm bg-neutral-900 border border-neutral-800 flex items-center gap-1.5">
      <span class="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce"></span>
      <span class="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style="animation-delay:.2s"></span>
      <span class="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style="animation-delay:.4s"></span>
    </div>`;
  container.appendChild(typingDiv);
  container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
  document.getElementById('typing-indicator')?.remove();
}

function resetChat() {
  chatHistory = [];
  const container = document.getElementById('chat-messages');
  if (!container) return;
  container.innerHTML = '';
  appendMessage('assistant', CHAT_GREETING);
}

function setChatBusy(busy) {
  chatBusy = busy;
  const send = document.getElementById('chat-send');
  if (send) send.disabled = busy;
}

async function executeChatTurn(userText) {
  appendMessage('user', userText);
  appendTypingIndicator();
  setChatBusy(true);

  let reply = null;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText, history: chatHistory.slice(-8) }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data && data.reply) reply = data.reply;
    } else if (res.status === 429) {
      reply = "You're sending messages a bit fast — please wait a few seconds and try again. ⏳";
    }
  } catch (err) {
    // Network error / timeout / opened as a local file → use built-in answers
  }

  if (!reply) reply = generateLocalPortfolioResponse(userText);

  removeTypingIndicator();
  appendMessage('assistant', reply);
  chatHistory.push({ role: 'user', content: userText });
  chatHistory.push({ role: 'assistant', content: extractActions(reply).clean });
  setChatBusy(false);
}

// Built-in answers used when the Groq API is unavailable.
// Each intent has keywords with weights; the best-scoring intent wins.
const LOCAL_INTENTS = [
  {
    id: 'greeting',
    words: { hi: 3, hii: 3, hello: 3, hey: 3, hola: 3, 'good morning': 3, 'good evening': 3, namaste: 3, vanakkam: 3 },
    exact: true,
    reply: "Hi! 👋 Nice to meet you. I can tell you about Paul's **projects**, his current role at **Neeyamo**, his **skills**, or how to **contact** him. What would you like to know?"
  },
  {
    id: 'thanks',
    words: { thanks: 3, thank: 3, thx: 3, great: 1, awesome: 1, cool: 1 },
    exact: true,
    reply: "You're welcome! 😊 If you'd like to talk to Paul directly, his email is **pauljacksenb@gmail.com**.\n[[copy-email]]"
  },
  {
    id: 'projects',
    words: { project: 4, projects: 4, built: 2, build: 2, portfolio: 2, works: 2, 'side project': 3, showcase: 2 },
    reply: "Here are Paul's main projects:\n• **Smart Navigation & Crowd Heatmap** — indoor railway navigation with YOLO + A* pathfinding. Top 20 of 100+, ₹18,000 CSRC grant.\n• **AI-DIDI** — Indian Sign Language translator with 3D avatars, >90% comprehension with 30+ deaf students.\n• **Handwritten Answer Evaluation** — OCR + NLP + LLM grading pipeline with semantic scoring.\n• **Enterprise RAG Assistant** — hybrid BM25 + vector retrieval, reranking and anti-hallucination gates.\nAsk me about any one for details!\n[[goto:projects]]"
  },
  {
    id: 'neeyamo',
    words: { neeyamo: 5, aria: 5, work: 3, working: 3, employed: 3, now: 1, mcp: 4, bedrock: 4, 'current role': 5, 'current job': 5, currently: 2, job: 2, company: 2, role: 2, 'model context': 4 },
    reply: "Paul is an **Associate Product Developer at Neeyamo** (May 2026 – Present), working on **Aria**, an enterprise AI chatbot.\n• Builds **MCP (Model Context Protocol) servers** in Java & Spring Boot so AI models can safely call enterprise APIs.\n• Integrates **Amazon Bedrock** foundation models into workflows like leave management and confirmations.\n• Works across the Angular chat UI and Spring Boot / MySQL backend.\n[[open:aria]]"
  },
  {
    id: 'experience',
    words: { experience: 4, internship: 4, intern: 4, worked: 2, maitsys: 5, career: 3, background: 2, timeline: 3 },
    reply: "Paul's experience:\n• **Neeyamo** — Associate Product Developer (May 2026 – Present): Aria chatbot, MCP servers, Amazon Bedrock.\n• **Maitsys** — SAP ABAP & AI Intern (Jan – Apr 2026): Qwen fine-tuning, RAG pipelines, SAP OData services.\n• **SSN College of Engineering** — AI Research Intern (May – Jul 2025): built the AI-DIDI sign language translator.\n[[goto:experience]]"
  },
  {
    id: 'rag',
    words: { rag: 5, retrieval: 4, 'enterprise rag': 6, hallucination: 4, rerank: 4, reranking: 4, qdrant: 4, bm25: 5 },
    reply: "The **Enterprise RAG Assistant** is a document-grounded Q&A system:\n• **Hybrid search** — BM25 + bge-small vectors fused with Reciprocal Rank Fusion.\n• **Cross-encoder reranking** with bge-reranker-base.\n• **3 anti-hallucination gates** — score floor, mandatory citations, refusal checks.\n• **24-configuration evaluation sweep** on a gold test set.\n[[open:rag-assistant]]"
  },
  {
    id: 'smartnav',
    words: { navigation: 5, 'smart navigation': 6, yolo: 5, heatmap: 5, railway: 4, csrc: 5, funded: 3, grant: 3, 'a*': 4, pathfinding: 4 },
    reply: "The **Smart Navigation & Crowd Heatmap System** guides people through crowded railway stations:\n• **YOLO** object detection for real-time crowd sensing.\n• **A* pathfinding** for routing, with voice-assisted guidance.\n• Selected **Top 20 of 100+ projects** and awarded a **₹18,000 CSRC grant**.\n[[open:smart-nav]]"
  },
  {
    id: 'didi',
    words: { didi: 6, 'ai-didi': 6, sign: 4, 'sign language': 6, deaf: 5, avatar: 4, ssn: 4, unreal: 3, blender: 3 },
    reply: "**AI-DIDI** translates text into **Indian Sign Language** with a 3D avatar:\n• NLP pipeline with **spaCy** to convert text to ISL grammar.\n• Avatar motion built with **Unreal Engine, Blender and Move AI**.\n• Tested with **30+ deaf students** — **>90% comprehension accuracy**.\n[[open:ai-didi]]"
  },
  {
    id: 'handwritten',
    words: { handwritten: 6, ocr: 5, grading: 4, evaluation: 3, answer: 2, exam: 3 },
    reply: "The **Handwritten Answer Evaluation System** grades student answer sheets automatically:\n• **OCR** reads the handwriting.\n• **NLP + LLM APIs** score concept coverage with semantic similarity, not just keywords.\n• Generates feedback on grammar, clarity and missing concepts.\n[[open:handwritten]]"
  },
  {
    id: 'skills',
    words: { skill: 4, skills: 4, stack: 4, tech: 3, technologies: 4, language: 3, languages: 3, tools: 3, framework: 3, know: 1 },
    reply: "Paul's main skills:\n• **AI & GenAI:** MCP, Amazon Bedrock, LLMs/SLMs/VLMs, RAG, Qdrant, Qwen fine-tuning\n• **ML & Vision:** PyTorch, TensorFlow, Scikit-learn, YOLO, spaCy\n• **Backend:** Java, Spring Boot, FastAPI, MySQL, REST APIs, SAP ABAP, Docker\n• **Frontend & tools:** Angular, Streamlit, Python, Power BI, Git\n[[goto:skills]]"
  },
  {
    id: 'hire',
    words: { hire: 5, 'why should': 5, strengths: 4, strength: 4, fit: 3, good: 1, best: 2, recommend: 3, choose: 3 },
    reply: "Why Paul is a strong AI/ML hire:\n• **Ships production AI** — builds MCP servers and Bedrock integrations for an enterprise chatbot today.\n• **Full-stack range** — from model work (RAG, YOLO, fine-tuning) to Java/Spring Boot backends and Angular UIs.\n• **Proven results** — Top 20 of 100+ with a CSRC grant, >90% accuracy in user testing with deaf students.\n• **Leadership** — Secretary of the ICONICS Association, coordinating 4 student clubs.\n[[goto:contact]]"
  },
  {
    id: 'education',
    words: { education: 5, cgpa: 5, gpa: 5, college: 4, university: 4, degree: 4, study: 3, studied: 3, school: 3, anna: 4 },
    reply: "Paul's education:\n• **B.E. Computer Science & Engineering (Honours)**, Anna University Regional Campus Madurai (2022–2026) — **CGPA 8.43 / 10**.\n• **CBSE Higher Secondary**, Velammal Vidyalaya — **88.4%**."
  },
  {
    id: 'leadership',
    words: { leadership: 5, leader: 4, club: 4, clubs: 4, iconics: 6, secretary: 5, symposium: 4 },
    reply: "Paul was **Secretary of the ICONICS Association** — he led campus technical symposiums and coordinated **4 student clubs**."
  },
  {
    id: 'contact',
    words: { contact: 5, email: 5, mail: 4, phone: 5, call: 3, reach: 4, linkedin: 5, github: 5, connect: 3, resume: 3, cv: 3, interview: 3 },
    reply: "You can reach Paul here:\n• **Email:** pauljacksenb@gmail.com\n• **Phone:** +91 70105 31540\n• **LinkedIn:** linkedin.com/in/paul-jacksen\n• **GitHub:** github.com/Faactos\nHe's open to full-time AI/ML engineering roles.\n[[copy-email]] [[goto:contact]]"
  },
  {
    id: 'about',
    words: { about: 2, who: 3, paul: 1, yourself: 3, summary: 3, introduce: 3, overview: 3 },
    reply: "**Paul Jacksen B** is an AI/ML Engineer from Madurai, India. He currently builds the **Aria** enterprise chatbot at **Neeyamo** using MCP servers and Amazon Bedrock, and has shipped projects in computer vision (Smart Navigation), accessibility AI (AI-DIDI) and RAG systems. He holds a B.E. CSE (Honours) with an 8.43 CGPA."
  }
];

function generateLocalPortfolioResponse(query) {
  const q = ' ' + query.toLowerCase().replace(/[^a-z0-9*\-\s]/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
  const wordCount = q.trim().split(' ').filter(Boolean).length;
  let best = null, bestScore = 0;
  for (const intent of LOCAL_INTENTS) {
    // Greeting/thanks only win for short messages like "hi" or "thanks!"
    if (intent.exact && wordCount > 4) continue;
    let score = 0;
    for (const [word, weight] of Object.entries(intent.words)) {
      if (q.includes(' ' + word + ' ') || (word.length > 4 && q.includes(word))) score += weight;
    }
    if (score > bestScore) { best = intent; bestScore = score; }
  }
  if (best) return best.reply;
  return "I'm not sure about that one — I can only answer questions about Paul. Try asking about his **projects**, **experience at Neeyamo**, **skills**, or **how to contact** him. For anything else, email **pauljacksenb@gmail.com**.\n[[copy-email]]";
}

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatMarkdown(str) {
  return escapeHtml(str)
    .replace(/^\s*[-•*]\s+/gm, '&bull; ')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-medium">$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em class="text-neutral-200">$2</em>')
    .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-black/60 border border-neutral-800 text-teal-300 font-mono text-[11px]">$1</code>')
    .replace(/\n/g, '<br>');
}

