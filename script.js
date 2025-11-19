// ======================================================
// =============== VARIÁVEIS PRINCIPAIS =================
// ======================================================
let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let estoque = JSON.parse(localStorage.getItem("estoque")) || [];
let vendas = JSON.parse(localStorage.getItem("vendas")) || [];

// ======================================================
// ======================= LOGIN =========================
// ======================================================
function login() {
    const user = document.getElementById("usuario").value.trim();
    const pass = document.getElementById("senha").value.trim();

    if (user === "admin" && pass === "1234") {
        localStorage.setItem("logado", "true");
        document.getElementById("login-page").classList.add("hidden");
        document.getElementById("app").classList.remove("hidden");
        carregarDados();
    } else {
        alert("Usuário ou senha incorretos!");
    }
}

function logout() {
    localStorage.removeItem("logado");
    location.reload();
}

// ======================================================
// ===================== NAVEGAÇÃO =======================
// ======================================================
function mostrarPagina(id) {
    document.querySelectorAll("main section").forEach(s => s.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");

    document.querySelectorAll(".sidebar a").forEach(a => a.classList.remove("active"));
    const link = document.getElementById("link" + id.charAt(0).toUpperCase() + id.slice(1));
    if (link) link.classList.add("active");

    atualizarDashboard();
}

// ======================================================
// ===================== CLIENTES ========================
// ======================================================
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

    if (!cliente.nome) return alert("O nome do cliente é obrigatório!");

    clientes.push(cliente);
    localStorage.setItem("clientes", JSON.stringify(clientes));

    limparCamposCliente();
    atualizarClientes();
    atualizarSelects();
    atualizarDashboard();
}

function limparCamposCliente() {
    const campos = [
        "nomeCliente", "telefoneCliente", "enderecoCliente", "numeroCliente",
        "bairroCliente", "cidadeCliente", "cepCliente", "referenciaCliente",
        "obsCliente"
    ];
    campos.forEach(id => document.getElementById(id).value = "");
}

function atualizarClientes() {
    const tb = document.getElementById("tabelaClientes");
    tb.innerHTML = clientes.map(c => `
      <tr>
        <td>${c.nome}</td>
        <td>${c.tel}</td>
        <td>${c.bairro}</td>
        <td>${c.cidade}</td>
        <td>
            <button class="btn-sm btn-delete" onclick="delCliente(${c.id})">🗑</button>
        </td>
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

// ======================================================
// ======================== ESTOQUE ======================
// ======================================================
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

    tb.innerHTML = estoque
        .map(p => `
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

// ======================================================
// ======================== VENDAS =======================
// ======================================================
function fazerVenda() {
    const cliente = document.getElementById("clienteVenda").value;
    const produtoNome = document.getElementById("produtoVenda").value;
    const qtd = parseInt(document.getElementById("qtdVenda").value);

    if (!cliente || !produtoNome || qtd <= 0)
        return alert("Preencha todos os campos corretamente!");

    const produto = estoque.find(p => p.nome === produtoNome);

    if (!produto || produto.qtd < qtd)
        return alert("Estoque insuficiente!");

    produto.qtd -= qtd;

    const total = (produto.preco * qtd);

    vendas.push({
        id: Date.now(),
        cliente,
        produto: produtoNome,
        qtd,
        total
    });

    localStorage.setItem("vendas", JSON.stringify(vendas));
    localStorage.setItem("estoque", JSON.stringify(estoque));

    atualizarEstoque();
    atualizarVendas();
    atualizarDashboard();

    alert(`Venda registrada com sucesso!\nTotal: R$ ${total.toFixed(2)}`);
}

function atualizarVendas() {
    const tb = document.getElementById("tabelaVendas");

    tb.innerHTML = vendas
        .map(v => `
        <tr>
            <td>${v.cliente}</td>
            <td>${v.produto}</td>
            <td>${v.qtd}</td>
            <td>R$ ${v.total.toFixed(2)}</td>
        </tr>
    `).join("");
}

// ======================================================
// ======================= DASHBOARD =====================
// ======================================================
function atualizarDashboard() {
    document.getElementById("totalClientes").textContent = clientes.length;
    document.getElementById("totalProdutos").textContent =
        estoque.reduce((acum, p) => acum + p.qtd, 0);
    document.getElementById("totalVendas").textContent = vendas.length;
}

function atualizarSelects() {
    const selectClientes = document.getElementById("clienteVenda");
    const selectProdutos = document.getElementById("produtoVenda");

    selectClientes.innerHTML =
        "<option value=''>-- selecione --</option>" +
        clientes.map(c => `<option>${c.nome}</option>`).join("");

    selectProdutos.innerHTML =
        "<option value=''>-- selecione --</option>" +
        estoque.map(p => `<option>${p.nome}</option>`).join("");
}

// ======================================================
// ===================== INICIALIZAÇÃO ===================
// ======================================================
function carregarDados() {
    atualizarClientes();
    atualizarEstoque();
    atualizarVendas();
    atualizarSelects();
    atualizarDashboard();
}

// AUTO LOGIN
window.addEventListener("load", () => {
    if (localStorage.getItem("logado") === "true") {
        document.getElementById("login-page").classList.add("hidden");
        document.getElementById("app").classList.remove("hidden");
        carregarDados();
    }
});
