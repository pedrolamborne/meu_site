const chat = document.getElementById("chat");
const input = document.getElementById("msg");
const sendBtn = document.getElementById("sendBtn");

// Carregar histórico do localStorage
let history = JSON.parse(localStorage.getItem("lamboHistory")) || [];
history.forEach(msg => addMessage(msg.text, msg.sender));

// Envio de mensagem
sendBtn.addEventListener("click", send);
input.addEventListener("keypress", e => { if(e.key==='Enter') send(); });

function addMessage(text, sender){
  const div = document.createElement("div");
  div.classList.add("message", sender);
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;

  // Salvar no histórico
  history.push({text, sender});
  localStorage.setItem("lamboHistory", JSON.stringify(history));
}

async function send(){
  const text = input.value.trim();
  if(!text) return;
  addMessage("Você: " + text, "user");
  input.value = "";

  // Feedback de carregamento
  const loading = document.createElement("div");
  loading.classList.add("message", "bot");
  loading.id = "loading";
  loading.textContent = "LamboGPT está pensando...";
  chat.appendChild(loading);
  chat.scrollTop = chat.scrollHeight;

  try{
    const res = await fetch("https://SEU_BACKEND_RENDER_URL/chat", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ message:text })
    });
    const data = await res.json();
    loading.remove();
    addMessage("LamboGPT: " + data.response, "bot");

    // Leitura em voz
    const utter = new SpeechSynthesisUtterance(data.response);
    speechSynthesis.speak(utter);

  }catch(e){
    loading.remove();
    addMessage("Erro ao conectar com LamboGPT 😢", "bot");
  }
}
