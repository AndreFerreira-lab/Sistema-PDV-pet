/* UTILIDADE */
const $ = (id) => document.getElementById(id);

/* SPLASH */
window.addEventListener("load", () => {
  setTimeout(() => {
    $("splash").remove();

    if (localStorage.getItem("logado") === "true") {
      $("app").classList.remove("hidden");
      carregarDados();
    } else {
      $("login-page").classList.remove("hidden");
    }

  }, 2000);
});

/* LOGIN */
function login() {
  const u = $("usuario").value.trim();
  const s = $("senha").value.trim();

  if (u === "admin" && s === "1234") {
    localStorage.setItem("logado", "true");
    $("login-page").classList.add("hidden");
    $("app").classList.remove("hidden");
    carregarDados();
  } else alert("Usuário ou senha inválidos!");
}

function logout() {
  localStorage.removeItem("logado");
  location.reload();
}

/* NAVEGAÇÃO */
function mostrarPagina(id) {
  document.querySelectorAll("main section").forEach(sec => sec.classList.add("hidden"));
  $(id).classList.remove("hidden");

  document.querySelectorAll(".sidebar a").forEach(a => a.classList.remove("active"));
  $("link" + id.charAt(0).toUpperCase() + id.slice(1)).classList.add("active");

  atualizarDashboard();
}

/* BANCO LOCAL */
let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let estoque = JSON.parse(localStorage.getItem("estoque")) || [];
let vendas = JSON.parse(localStorage.getItem("vendas")) || [];

/* CLIENTES */
function addCliente() {

  const cliente = {
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

  if (!cliente.nome) return alert("Informe o nome!");

  clientes.push(cliente);
  localStorage.setItem("clientes", JSON.stringify(clientes));

  limparCamposCliente();
  atualizarClientes();
  atualizarSelects();
  atualizarDashboard();
}


function atualizarClientes() {
  $("tabelaClientes").innerHTML = clientes
    .map(c => `<tr>
      <td>${c.nome}</td>
      <td>${c.tel || ""}</td>
      <td><button class="btn-delete" onclick="delCliente(${c.id})">Excluir</button></td>
    </tr>`).join("");
}

function delCliente(id) {
  clientes = clientes.filter(c => c.id !== id);
  localStorage.setItem("clientes", JSON.stringify(clientes));
  atualizarClientes();
  atualizarSelects();
  atualizarDashboard();
}

/* ESTOQUE */
function addProduto() {
  const nome = $("nomeProduto").value.trim();
  if (!nome) return alert("Nome do produto obrigatório!");

  estoque.push({
    id: Date.now(),
    nome,
    qtd: parseInt($("quantidadeProduto").value),
    preco: parseFloat($("precoProduto").value)
  });

  localStorage.setItem("estoque", JSON.stringify(estoque));

  $("nomeProduto").value = "";
  $("quantidadeProduto").value = "";
  $("precoProduto").value = "";

  atualizarEstoque();
  atualizarSelects();
  atualizarDashboard();
}

function atualizarEstoque() {
  $("tabelaEstoque").innerHTML = estoque
    .map(p => `<tr>
      <td>${p.nome}</td>
      <td>${p.qtd}</td>
      <td>R$ ${p.preco.toFixed(2)}</td>
      <td><button class="btn-delete" onclick="delProduto(${p.id})">Excluir</button></td>
    </tr>`).join("");
}

function delProduto(id) {
  estoque = estoque.filter(p => p.id !== id);
  localStorage.setItem("estoque", JSON.stringify(estoque));
  atualizarEstoque();
  atualizarSelects();
  atualizarDashboard();
}

/* VENDAS */
function fazerVenda() {
  const cliente = $("clienteVenda").value;
  const produtoNome = $("produtoVenda").value;
  const qtd = parseInt($("qtdVenda").value);

  if (!cliente || !produtoNome || qtd <= 0) return alert("Preencha os campos!");

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

  alert("Venda registrada!");
}

function atualizarVendas() {
  $("tabelaVendas").innerHTML = vendas
    .map(v => `<tr>
      <td>${v.cliente}</td>
      <td>${v.produto}</td>
      <td>${v.qtd}</td>
      <td>R$ ${v.total.toFixed(2)}</td>
    </tr>`).join("");
}

/* DASHBOARD */
function atualizarDashboard() {
  $("totalClientes").textContent = clientes.length;
  $("totalProdutos").textContent = estoque.reduce((a, b) => a + b.qtd, 0);
  $("totalVendas").textContent = vendas.length;
}

function atualizarSelects() {
  $("clienteVenda").innerHTML = `<option value="">-- selecione --</option>` +
    clientes.map(c => `<option>${c.nome}</option>`).join("");

  $("produtoVenda").innerHTML = `<option value="">-- selecione --</option>` +
    estoque.map(p => `<option>${p.nome}</option>`).join("");
}

function carregarDados() {
  atualizarClientes();
  atualizarEstoque();
  atualizarVendas();
  atualizarSelects();
  atualizarDashboard();
}


