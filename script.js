// ====== VARIÁVEIS ======
let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let estoque = JSON.parse(localStorage.getItem("estoque")) || [];
let vendas = JSON.parse(localStorage.getItem("vendas")) || [];

// ====== LOGIN ======
function login() {
  const user = document.getElementById("usuario").value.trim();
  const pass = document.getElementById("senha").value.trim();

  if (user === "admin" && pass === "1234") {
    localStorage.setItem("logado", "true");
    document.getElementById("login-page").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    carregarDados();
  } else {
    alert("Usuário ou senha inválidos!");
  }
}

function logout() {
  localStorage.removeItem("logado");
  location.reload();
}

// ====== NAVEGAÇÃO ======
function mostrarPagina(id) {
  document.querySelectorAll("main section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");

  document.querySelectorAll(".sidebar a").forEach(a => a.classList.remove("active"));
  const link = document.getElementById("link" + id.charAt(0).toUpperCase() + id.slice(1));
  if (link) link.classList.add("active");

  atualizarDashboard();
}

// ====== CLIENTES ======
function addCliente() {
  const nome = document.getElementById("nomeCliente").value.trim();
  const tel = document.getElementById("telefoneCliente").value.trim();
  if (!nome) return alert("Informe o nome do cliente!");

  clientes.push({ id: Date.now(), nome, tel });
  localStorage.setItem("clientes", JSON.stringify(clientes));

  document.getElementById("nomeCliente").value = "";
  document.getElementById("telefoneCliente").value = "";
  atualizarClientes();
  atualizarSelects();
  atualizarDashboard();
}

function atualizarClientes() {
  const tb = document.getElementById("tabelaClientes");
  if (!tb) return;
  tb.innerHTML = clientes.map(c => `
    <tr>
      <td>${c.nome}</td>
      <td>${c.tel || ""}</td>
      <td><button class="btn-sm btn-delete" onclick="delCliente(${c.id})">🗑</button></td>
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

// ====== ESTOQUE ======
function addProduto() {
  const nome = document.getElementById("nomeProduto").value.trim();
  const qtd = parseInt(document.getElementById("quantidadeProduto").value) || 0;
  const preco = parseFloat(document.getElementById("precoProduto").value) || 0;

  if (!nome) return alert("Informe o nome do produto!");

  estoque.push({ id: Date.now(), nome, qtd, preco });
  localStorage.setItem("estoque", JSON.stringify(estoque));

  document.getElementById("nomeProduto").value = "";
  document.getElementById("quantidadeProduto").value = "";
  document.getElementById("precoProduto").value = "";
  atualizarEstoque();
  atualizarSelects();
  atualizarDashboard();
}

function atualizarEstoque() {
  const tb = document.getElementById("tabelaEstoque");
  if (!tb) return;
  tb.innerHTML = estoque.map(p => `
    <tr>
      <td>${p.nome}</td>
      <td>${p.qtd}</td>
      <td>R$ ${p.preco.toFixed(2)}</td>
      <td><button class="btn-sm btn-delete" onclick="delProduto(${p.id})">🗑</button></td>
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

// ====== VENDAS ======
function fazerVenda() {
  const cliente = document.getElementById("clienteVenda").value;
  const produtoNome = document.getElementById("produtoVenda").value;
  const qtd = parseInt(document.getElementById("qtdVenda").value);

  if (!cliente || !produtoNome || qtd <= 0) return alert("Preencha todos os campos!");

  const produto = estoque.find(p => p.nome === produtoNome);
  if (!produto || produto.qtd < qtd) return alert("Estoque insuficiente!");

  produto.qtd -= qtd;
  const total = produto.preco * qtd;
  vendas.push({ id: Date.now(), cliente, produto: produtoNome, qtd, total });

  localStorage.setItem("vendas", JSON.stringify(vendas));
  localStorage.setItem("estoque", JSON.stringify(estoque));

  atualizarEstoque();
  atualizarVendas();
  atualizarDashboard();

  alert(`Venda registrada com sucesso!\nTotal: R$ ${total.toFixed(2)}`);
}

function atualizarVendas() {
  const tb = document.getElementById("tabelaVendas");
  if (!tb) return;
  tb.innerHTML = vendas.map(v => `
    <tr>
      <td>${v.cliente}</td>
      <td>${v.produto}</td>
      <td>${v.qtd}</td>
      <td>R$ ${v.total.toFixed(2)}</td>
    </tr>
  `).join("");
}

// ====== DASHBOARD ======
function atualizarDashboard() {
  document.getElementById("totalClientes").innerText = clientes.length;
  document.getElementById("totalProdutos").innerText = estoque.reduce((s, p) => s + p.qtd, 0);
  document.getElementById("totalVendas").innerText = vendas.length;
}

function atualizarSelects() {
  const sc = document.getElementById("clienteVenda");
  const sp = document.getElementById("produtoVenda");

  sc.innerHTML = '<option value="">-- selecione --</option>' + clientes.map(c => `<option>${c.nome}</option>`).join("");
  sp.innerHTML = '<option value="">-- selecione --</option>' + estoque.map(p => `<option>${p.nome}</option>`).join("");
}

function carregarDados() {
  atualizarClientes();
  atualizarEstoque();
  atualizarVendas();
  atualizarSelects();
  atualizarDashboard();
}

// ====== AUTO LOGIN ======
window.addEventListener("load", () => {
  if (localStorage.getItem("logado") === "true") {
    document.getElementById("login-page").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    carregarDados();
  }
});
