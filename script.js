// Login
function login() {
  const user = document.getElementById("usuario").value.trim();
  const pass = document.getElementById("senha").value.trim();

  if (user === "admin" && pass === "1234") {
    // redireciona para a página inicial (no mesmo diretório)
    window.location.href = "./index.html";
  } else {
    alert("Usuário ou senha inválidos!");
  }
}

// Dados locais
let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let estoque = JSON.parse(localStorage.getItem("estoque")) || [];
let vendas = JSON.parse(localStorage.getItem("vendas")) || [];

// CLIENTES
function addCliente() {
  const nome = document.getElementById("nomeCliente").value;
  const tel = document.getElementById("telefoneCliente").value;
  if (!nome) return alert("Informe o nome!");
  clientes.push({ nome, tel });
  localStorage.setItem("clientes", JSON.stringify(clientes));
  atualizarClientes();
}

function atualizarClientes() {
  const tabela = document.querySelector("#tabelaClientes tbody");
  if (tabela) {
    tabela.innerHTML = clientes.map(c => `<tr><td>${c.nome}</td><td>${c.tel}</td></tr>`).join("");
  }
}

// ESTOQUE
function addProduto() {
  const nome = document.getElementById("nomeProduto").value;
  const qtd = parseInt(document.getElementById("quantidadeProduto").value);
  const preco = parseFloat(document.getElementById("precoProduto").value);
  if (!nome || !qtd || !preco) return alert("Preencha todos os campos!");
  estoque.push({ nome, qtd, preco });
  localStorage.setItem("estoque", JSON.stringify(estoque));
  atualizarEstoque();
}

function atualizarEstoque() {
  const tabela = document.querySelector("#tabelaEstoque tbody");
  if (tabela) {
    tabela.innerHTML = estoque.map(p => `<tr><td>${p.nome}</td><td>${p.qtd}</td><td>R$ ${p.preco.toFixed(2)}</td></tr>`).join("");
  }
}

// VENDAS
function fazerVenda() {
  const cliente = document.getElementById("clienteVenda").value;
  const produto = document.getElementById("produtoVenda").value;
  const qtd = parseInt(document.getElementById("qtdVenda").value);
  const item = estoque.find(p => p.nome === produto);
  if (!item || item.qtd < qtd) return alert("Estoque insuficiente!");
  item.qtd -= qtd;
  const total = item.preco * qtd;
  vendas.push({ cliente, produto, qtd, total });
  localStorage.setItem("vendas", JSON.stringify(vendas));
  localStorage.setItem("estoque", JSON.stringify(estoque));
  atualizarEstoque();
  atualizarVendas();
  alert(`Venda registrada: R$ ${total.toFixed(2)}`);
}

function atualizarVendas() {
  const tabela = document.querySelector("#tabelaVendas tbody");
  if (tabela) {
    tabela.innerHTML = vendas.map(v => `<tr><td>${v.cliente}</td><td>${v.produto}</td><td>${v.qtd}</td><td>R$ ${v.total.toFixed(2)}</td></tr>`).join("");
  }
  const clienteSel = document.getElementById("clienteVenda");
  const produtoSel = document.getElementById("produtoVenda");
  if (clienteSel && produtoSel) {
    clienteSel.innerHTML = clientes.map(c => `<option>${c.nome}</option>`).join("");
    produtoSel.innerHTML = estoque.map(p => `<option>${p.nome}</option>`).join("");
  }
}

// DASHBOARD
function atualizarDashboard() {
  const c = document.getElementById("totalClientes");
  const e = document.getElementById("totalProdutos");
  const v = document.getElementById("totalVendas");
  if (c && e && v) {
    c.innerText = clientes.length;
    e.innerText = estoque.length;
    v.innerText = vendas.length;
  }
}

// AUTOLOAD
window.onload = () => {
  atualizarClientes();
  atualizarEstoque();
  atualizarVendas();
  atualizarDashboard();
};

