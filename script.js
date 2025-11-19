/* ============================
   SISTEMA PDV - SCRIPT.JS
   Revisado e testado logicamente
   ============================ */

/* ---------- SPLASH -> LOGIN ---------- */
window.addEventListener("load", () => {
  // mostrar splash por 1.8s, depois revelar login (ou app se já logado)
  setTimeout(() => {
    const splash = document.getElementById("splash");
    if (splash) splash.classList.add("hidden");

    if (localStorage.getItem("logado") === "true") {
      document.getElementById("login-page").classList.add("hidden");
      document.getElementById("app").classList.remove("hidden");
      carregar();
    } else {
      document.getElementById("login-page").classList.remove("hidden");
    }
  }, 1800);
});

/* ---------- LOGIN / LOGOUT ---------- */
document.getElementById("btnLogin").addEventListener("click", login);

function login() {
  const user = document.getElementById("usuario").value.trim();
  const pass = document.getElementById("senha").value.trim();

  if (user === "admin" && pass === "1234") {
    localStorage.setItem("logado", "true");
    document.getElementById("login-page").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    carregar();
    // show dashboard on login
    mostrarPagina("dashboard");
  } else {
    alertaEspecial("Usuário ou senha inválidos!");
  }
}

function logout() {
  localStorage.removeItem("logado");
  location.reload();
}

/* ---------- NAVEGAÇÃO ---------- */
function mostrarPagina(id) {
  document.querySelectorAll("main section").forEach(sec => sec.classList.add("hidden"));
  const sec = document.getElementById(id);
  if (sec) sec.classList.remove("hidden");

  document.querySelectorAll(".sidebar a").forEach(a => a.classList.remove("active"));
  const link = document.getElementById("link" + id.charAt(0).toUpperCase() + id.slice(1));
  if (link) link.classList.add("active");

  atualizarDashboard();

  // trigger subtitle animation when dashboard shown
  if (id === "dashboard") {
    setTimeout(() => onDashboardShow(), 120);
  }
}

/* ---------- STORAGE DATA ---------- */
let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let estoque = JSON.parse(localStorage.getItem("estoque")) || [];
let vendas = JSON.parse(localStorage.getItem("vendas")) || [];

/* ---------- CLIENTES ---------- */
function addCliente() {
  const novo = {
    id: Date.now(),
    nome: document.getElementById("nomeCliente").value.trim(),
    tel: document.getElementById("telefoneCliente").value.trim(),
    endereco: document.getElementById("enderecoCliente").value.trim(),
    numero: document.getElementById("numeroCliente").value.trim(),
    bairro: document.getElementById("bairroCliente").value.trim(),
    cidade: document.getElementById("cidadeCliente").value.trim(),
    cep: document.getElementById("cepCliente").value.trim(),
    referencia: document.getElementById("referenciaCliente").value.trim(),
    tipo: document.getElementById("tipoCliente").value,
    pagamento: document.getElementById("pagamentoPreferido").value,
    obs: document.getElementById("obsCliente").value.trim()
  };

  if (!novo.nome) {
    alertaEspecial("Digite o nome do cliente.");
    return;
  }

  clientes.push(novo);
  localStorage.setItem("clientes", JSON.stringify(clientes));
  limparCamposCliente();
  atualizarClientes();
  atualizarSelects();
  atualizarDashboard();
  alertaEspecial("Cliente salvo com sucesso!");
}

function limparCamposCliente() {
  [
    "nomeCliente","telefoneCliente","enderecoCliente","numeroCliente",
    "bairroCliente","cidadeCliente","cepCliente","referenciaCliente",
    "obsCliente"
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}

function atualizarClientes() {
  const tb = document.getElementById("tabelaClientes");
  if (!tb) return;
  tb.innerHTML = clientes.map(c => `
    <tr>
      <td>${escapeHtml(c.nome)}</td>
      <td>${escapeHtml(c.tel || "")}</td>
      <td>${escapeHtml(c.bairro || "")}</td>
      <td><button class="btn-delete" onclick="delCliente(${c.id})">🗑</button></td>
    </tr>
  `).join("");
}

function delCliente(id) {
  clientes = clientes.filter(c => c.id !== id);
  localStorage.setItem("clientes", JSON.stringify(clientes));
  atualizarClientes();
  atualizarSelects();
  atualizarDashboard();
}

/* ---------- ESTOQUE ---------- */
function addProduto() {
  const nome = document.getElementById("nomeProduto").value.trim();
  const qtd = Number(document.getElementById("quantidadeProduto").value) || 0;
  const preco = Number(document.getElementById("precoProduto").value) || 0;

  if (!nome) {
    alertaEspecial("Informe o nome do produto!");
    return;
  }

  estoque.push({ id: Date.now(), nome, qtd, preco });
  localStorage.setItem("estoque", JSON.stringify(estoque));
  document.getElementById("nomeProduto").value = "";
  document.getElementById("quantidadeProduto").value = "";
  document.getElementById("precoProduto").value = "";
  atualizarEstoque();
  atualizarSelects();
  atualizarDashboard();
  alertaEspecial("Produto salvo!");
}

function atualizarEstoque() {
  const tb = document.getElementById("tabelaEstoque");
  if (!tb) return;
  tb.innerHTML = estoque.map(p => `
    <tr>
      <td>${escapeHtml(p.nome)}</td>
      <td>${p.qtd}</td>
      <td>R$ ${Number(p.preco || 0).toFixed(2)}</td>
      <td><button class="btn-delete" onclick="delProduto(${p.id})">🗑</button></td>
    </tr>
  `).join("");
}

function delProduto(id) {
  estoque = estoque.filter(p => p.id !== id);
  localStorage.setItem("estoque", JSON.stringify(estoque));
  atualizarEstoque();
  atualizarSelects();
  atualizarDashboard();
}

/* ---------- VENDAS ---------- */
function fazerVenda() {
  const cliente = document.getElementById("clienteVenda").value;
  const produtoNome = document.getElementById("produtoVenda").value;
  const qtd = Number(document.getElementById("qtdVenda").value) || 0;

  if (!cliente || !produtoNome || qtd <= 0) {
    alertaEspecial("Preencha cliente, produto e quantidade.");
    return;
  }

  const produto = estoque.find(p => p.nome === produtoNome);
  if (!produto) { alertaEspecial("Produto inválido."); return; }
  if (produto.qtd < qtd) { alertaEspecial("Estoque insuficiente."); return; }

  produto.qtd -= qtd;
  const total = produto.preco * qtd;
  vendas.push({ id: Date.now(), cliente, produto: produtoNome, qtd, total });
  localStorage.setItem("vendas", JSON.stringify(vendas));
  localStorage.setItem("estoque", JSON.stringify(estoque));
  atualizarVendas();
  atualizarEstoque();
  atualizarSelects();
  atualizarDashboard();
  alertaEspecial(`Venda registrada — R$ ${total.toFixed(2)}`);
}

function atualizarVendas() {
  const tb = document.getElementById("tabelaVendas");
  if (!tb) return;
  tb.innerHTML = vendas.map(v => `
    <tr>
      <td>${escapeHtml(v.cliente)}</td>
      <td>${escapeHtml(v.produto)}</td>
      <td>${v.qtd}</td>
      <td>R$ ${Number(v.total || 0).toFixed(2)}</td>
    </tr>
  `).join("");
}

/* ---------- DASHBOARD / SELECTS / LOAD ---------- */
function atualizarDashboard() {
  const elC = document.getElementById("totalClientes");
  const elP = document.getElementById("totalProdutos");
  const elV = document.getElementById("totalVendas");
  if (elC) elC.textContent = clientes.length;
  if (elP) elP.textContent = estoque.reduce((a,b)=>a+(Number(b.qtd)||0),0);
  if (elV) elV.textContent = vendas.length;
}

function atualizarSelects() {
  const selC = document.getElementById("clienteVenda");
  const selP = document.getElementById("produtoVenda");
  if (selC) selC.innerHTML = "<option value=''>-- selecione --</option>" + clientes.map(c => `<option>${escapeHtml(c.nome)}</option>`).join("");
  if (selP) selP.innerHTML = "<option value=''>-- selecione --</option>" + estoque.map(p => `<option>${escapeHtml(p.nome)}</option>`).join("");
}

function carregar() {
  atualizarClientes();
  atualizarEstoque();
  atualizarVendas();
  atualizarSelects();
  atualizarDashboard();
}

/* ---------- ALERTA VISUAL (central) ---------- */
function alertaEspecial(mensagem, autoHideMs=1600) {
  // cria overlay
  const existente = document.querySelector(".alerta-bg");
  if (existente) existente.remove();

  const alerta = document.createElement("div");
  alerta.className = "alerta-bg";
  alerta.style.position = "fixed";
  alerta.style.inset = "0";
  alerta.style.display = "flex";
  alerta.style.justifyContent = "center";
  alerta.style.alignItems = "center";
  alerta.style.background = "rgba(0,0,0,0.6)";
  alerta.style.zIndex = 99999;

  const box = document.createElement("div");
  box.className = "alerta-box";
  box.style.background = "#1e1e1e";
  box.style.border = "3px solid #ffb300";
  box.style.color = "#ffb300";
  box.style.padding = "24px 38px";
  box.style.borderRadius = "14px";
  box.style.fontSize = "1.1rem";
  box.style.fontWeight = "700";
  box.style.textAlign = "center";
  box.style.boxShadow = "0 0 30px rgba(255,179,0,0.35)";
  box.innerHTML = `🍕 ${escapeHtml(mensagem)}`;

  alerta.appendChild(box);
  document.body.appendChild(alerta);

  // clique para fechar
  alerta.addEventListener("click", () => alerta.remove());

  if (autoHideMs>0) {
    setTimeout(()=>{ alerta.remove(); }, autoHideMs);
  }
}

/* ---------- SUBTITLE TYPING + SOM + SMOKE ---------- */
function tocarSomEntrada(vol=0.22) {
  try {
    const a = new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_3479db72aa.mp3");
    a.volume = vol;
    a.play().catch(()=>{});
  } catch(e) {}
}

function triggerSubtitleAnimation(text="Seja bem-vindo ao nosso sistema! 🍕🔥", durationMS=2200) {
  const el = document.querySelector(".dashboard-subtitle");
  if (!el) return;
  el.classList.remove("typing");
  el.style.width = "0ch";
  el.style.transition = "none";
  el.textContent = text;
  const totalChars = Math.max(1, String(text).length);
  const totalDuration = Math.max(600, durationMS);
  const perChar = totalDuration / totalChars;
  let current = 0;
  el.style.borderRight = "3px solid rgba(255,221,102,0.95)";
  el.classList.add("typing");
  tocarSomEntrada(0.18);
  const timer = setInterval(() => {
    current++;
    el.style.width = current + "ch";
    if (current >= totalChars) {
      clearInterval(timer);
      setTimeout(()=>{ el.style.borderRight = "0px"; }, 500);
    }
  }, perChar);
}

function onDashboardShow() {
  triggerSubtitleAnimation("🔥 Bem-vindo à Pizzaria Dona Jô — Vendas quentes hoje! 🔥", 2200);
}

/* ---------- UTILIDADES ---------- */
function escapeHtml(str) {
  if (!str && str !== 0) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ---------- AUTO-LOAD if already logged ---------- */
if (localStorage.getItem("logado") === "true") {
  // If already logged, reveal app immediately (splash will hide on load handler)
  document.addEventListener("DOMContentLoaded", () => {
    const splash = document.getElementById("splash");
    if (splash) splash.classList.add("hidden");
    document.getElementById("login-page").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    carregar();
  });
}
