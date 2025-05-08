// Remover a importação do banco de dados do navegador
// const { pedidosClientes, pedidosProducao, pedidosConcluidos } = require('./database');

// Inicializar arrays de pedidos
let pedidosClientesArray = [];
let pedidosProducaoArray = [];
let pedidosConcluidosArray = [];

// Carregar dados do banco de dados
async function carregarDados() {
    try {
        // Fazer uma requisição para o servidor para obter os dados
        const response = await fetch('/api/pedidos');
        const data = await response.json();
        
        pedidosClientesArray = data.clientes || [];
        pedidosProducaoArray = data.producao || [];
        pedidosConcluidosArray = data.concluidos || [];
        
        // Renderizar tabelas após carregar os dados
        renderizarTabelaClientes();
        renderizarTabelaProducao();
        renderizarTabelaConcluidos();
        
        // Inicializar datas e cores
        inicializarDatas();
        copiarOpcoesCores();
    } catch (err) {
        console.error('Erro ao carregar dados:', err);
    }
}

// Função para inicializar as datas
function inicializarDatas() {
    const hoje = new Date().toISOString().split('T')[0];
    
    // Inicializar data e prazo do formulário de cliente
    const dataCliente = document.getElementById('data');
    const prazoCliente = document.getElementById('prazo');
    if (dataCliente) dataCliente.value = hoje;
    if (prazoCliente) {
        const prazo = calcularDiasUteis(hoje, 10);
        prazoCliente.value = prazo.toISOString().split('T')[0];
    }
    
    // Inicializar data e prazo do formulário de produção
    const dataProducao = document.getElementById('data-prod');
    const prazoProducao = document.getElementById('prazo-prod');
    if (dataProducao) dataProducao.value = hoje;
    if (prazoProducao) {
        const prazo = calcularDiasUteis(hoje, 10);
        prazoProducao.value = prazo.toISOString().split('T')[0];
    }
}

// Chamar carregarDados quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    carregarDados();
    inicializarDatas();
    copiarOpcoesCores();
});

// Log pedidosProducao
console.log(localStorage.getItem('pedidosProducao'));

// Alternar entre as abas
function openTab(tabId) {
  const tabContents = document.getElementsByClassName('tab-content');
  for (let i = 0; i < tabContents.length; i++) {
    tabContents[i].classList.remove('active');
  }
  
  const tabButtons = document.getElementsByClassName('tab-button');
  for (let i = 0; i < tabButtons.length; i++) {
    tabButtons[i].classList.remove('active');
  }
  
  document.getElementById(tabId).classList.add('active');
  event.currentTarget.classList.add('active');
}

// Mostrar/esconder dropdown
function toggleDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  if (dropdown.style.display === 'block') {
    dropdown.style.display = 'none';
  } else {
    dropdown.style.display = 'block';
  }
}

// Fechar dropdowns quando clicar fora
document.addEventListener('click', function(event) {
  const dropdowns = document.getElementsByClassName('dropdown-content');
  for (let dropdown of dropdowns) {
    if (!event.target.closest('.dropdown')) {
      dropdown.style.display = 'none';
    }
  }
});

// Excluir pedido de cliente
async function excluirPedidoCliente(index) {
  if (confirm('Tem certeza que deseja excluir este pedido?')) {
    pedidosClientesArray.splice(index, 1);
    await salvarPedidos();
    renderizarTabelaClientes();
  }
}

// Excluir pedido de produção
async function excluirPedidoProducao(index) {
  if (confirm('Tem certeza que deseja excluir este pedido?')) {
    pedidosProducaoArray.splice(index, 1);
    await salvarPedidos();
    renderizarTabelaProducao();
  }
}

// Excluir pedido concluído
async function excluirPedidoConcluido(index) {
  if (confirm('Tem certeza que deseja excluir este pedido concluído?')) {
    pedidosConcluidosArray.splice(index, 1);
    await salvarPedidos();
    renderizarTabelaConcluidos();
  }
}

// Editar pedido de cliente
function editarPedidoCliente(index) {
  const pedido = pedidosClientesArray[index];
  document.getElementById('pedido-num').value = pedido.numero || '';
  document.getElementById('data').value = converterDataParaInput(pedido.data) || '';
  document.getElementById('cliente').value = pedido.cliente || '';
  document.getElementById('material').value = pedido.material || '';
  document.getElementById('espessura').value = pedido.espessura || '';
  document.getElementById('modelo').value = pedido.modelo || '';
  document.getElementById('cor').value = pedido.cor || '';
  document.getElementById('quantidade').value = pedido.quantidade || '';
  document.getElementById('tamanho').value = pedido.tamanho || '';
  document.getElementById('vendedor').value = pedido.vendedor || '';
  document.getElementById('status').value = pedido.status || '';
  document.getElementById('prazo').value = converterDataParaInput(pedido.prazo) || '';
  
  document.getElementById('btnSalvarCliente').textContent = 'Atualizar Pedido';
  document.getElementById('btnCancelarEdicaoCliente').style.display = 'inline-block';
  document.getElementById('editandoIndexCliente').value = index;
  document.getElementById('form-cliente').scrollIntoView({ behavior: 'smooth' });
}

// Editar pedido de produção
function editarPedidoProducao(index) {
  const pedido = pedidosProducaoArray[index];
  if (!pedido) return;

  document.getElementById('numero-prod').value = pedido.numero || '';
  document.getElementById('data-prod').value = converterDataParaInput(pedido.data) || '';
  document.getElementById('material-prod').value = pedido.material || '';
  document.getElementById('espessura-prod').value = pedido.espessura || '';
  document.getElementById('modelo-prod').value = pedido.modelo || '';
  document.getElementById('cor-prod').value = pedido.cor || '';
  document.getElementById('quantidade-prod').value = pedido.quantidade || '';
  document.getElementById('tamanho-prod').value = pedido.tamanho || '';
  document.getElementById('responsavel-prod').value = pedido.responsavel || '';
  document.getElementById('status-prod').value = pedido.status || '';
  document.getElementById('prazo-prod').value = converterDataParaInput(pedido.prazo) || '';

  document.getElementById('btn-salvar-prod').textContent = 'Atualizar';
  document.getElementById('btn-cancelar-prod').style.display = 'inline-block';
  document.getElementById('editandoIndexProducao').value = index;
}

// Função para salvar pedidos no banco de dados
async function salvarPedidos() {
    try {
        // Fazer uma requisição para o servidor para salvar os dados
        const response = await fetch('/api/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                clientes: pedidosClientesArray,
                producao: pedidosProducaoArray,
                concluidos: pedidosConcluidosArray
            })
        });
        
        if (!response.ok) {
            throw new Error('Erro ao salvar pedidos');
        }
    } catch (err) {
        console.error('Erro ao salvar pedidos:', err);
        mostrarMensagem('Erro ao salvar pedidos. Por favor, tente novamente.');
    }
}

// Adicionar eventos aos formulários
// Função para mostrar mensagem (evita duplicação)
function mostrarMensagem(mensagem) {
  if (!window.ultimaMensagem || window.ultimaMensagem !== mensagem) {
    alert(mensagem);
    window.ultimaMensagem = mensagem;
    setTimeout(() => {
      window.ultimaMensagem = null;
    }, 100);
  }
}

const formCliente = document.getElementById('form-cliente');
if (formCliente) {
  formCliente.addEventListener('submit', async function(event) {
    event.preventDefault();
    if (await salvarPedidoCliente()) {
      mostrarMensagem('Pedido de cliente salvo com sucesso!');
    } else {
      mostrarMensagem('Por favor, preencha todos os campos obrigatórios!');
    }
  });
  formCliente.addEventListener('reset', function() {
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('data').value = hoje;
    const prazo = calcularDiasUteis(hoje, 10).toISOString().split('T')[0];
    document.getElementById('prazo').value = prazo;
  });
}

const formProducao = document.getElementById('form-producao');
if (formProducao) {
  formProducao.addEventListener('submit', async function(event) {
    event.preventDefault();
    if (await salvarPedidoProducao()) {
      mostrarMensagem('Pedido de produção salvo com sucesso!');
    } else {
      mostrarMensagem('Por favor, preencha todos os campos obrigatórios!');
    }
  });
  formProducao.addEventListener('reset', function() {
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('data-prod').value = hoje;
    const prazoProd = calcularDiasUteis(hoje, 10).toISOString().split('T')[0];
    document.getElementById('prazo-prod').value = prazoProd;
  });
}

const btnSalvarCliente = document.getElementById('btnSalvarCliente');
if (btnSalvarCliente) {
  btnSalvarCliente.addEventListener('click', async function() {
    formCliente.dispatchEvent(new Event('submit'));
  });
}

const btnSalvarProducao = document.getElementById('btnSalvarProducao');
if (btnSalvarProducao) {
  btnSalvarProducao.addEventListener('click', async function () {
    formProducao.dispatchEvent(new Event('submit'));
  });
}

const btnCancelarCliente = document.getElementById('btn-cancelar-cliente');
if (btnCancelarCliente) {
  btnCancelarCliente.addEventListener('click', cancelarEdicaoCliente);
}

// Função para calcular 10 dias úteis a partir de uma data
function calcularDiasUteis(data, dias) {
  let dataAtual = new Date(data);
  let diasAdicionados = 0;
  
  while (diasAdicionados < dias) {
    dataAtual.setDate(dataAtual.getDate() + 1);
    // Verifica se é dia útil (não é sábado nem domingo)
    if (dataAtual.getDay() !== 0 && dataAtual.getDay() !== 6) {
      diasAdicionados++;
    }
  }
  
  return dataAtual;
}

// Função para obter o próximo número de pedido
function obterProximoNumeroPedido(tipo) {
  const pedidos = tipo === 'cliente' ? pedidosClientesArray : pedidosProducaoArray;
  if (pedidos.length === 0) return 1;
  
  const numeros = pedidos.map(p => parseInt(p.numero) || 0);
  return Math.max(...numeros) + 1;
}

// Função para salvar pedido de cliente
async function salvarPedidoCliente() {
  const numero = document.getElementById('pedido-num').value || obterProximoNumeroPedido('cliente');
  const data = document.getElementById('data').value;
  const cliente = document.getElementById('cliente').value;
  const material = document.getElementById('material').value;
  const espessura = document.getElementById('espessura').value;
  const modelo = document.getElementById('modelo').value;
  const cor = document.getElementById('cor').value;
  const quantidade = document.getElementById('quantidade').value;
  const tamanho = document.getElementById('tamanho').value;
  const vendedor = document.getElementById('vendedor').value;
  const status = document.getElementById('status').value;
  const prazo = document.getElementById('prazo').value;

  // Verificar campos obrigatórios
  if (!data || !cliente || !material || !espessura || !cor || !quantidade) {
    return false;
  }

  const pedido = { 
    numero, 
    data: formatarData(data), 
    cliente, 
    material, 
    espessura, 
    modelo, 
    cor, 
    quantidade, 
    tamanho, 
    vendedor, 
    status, 
    prazo: formatarData(prazo) 
  };

  const index = document.getElementById('editandoIndexCliente').value;
  
  if (index !== '') {
    // Atualiza o pedido existente
    pedido.id = pedidosClientesArray[index].id;
    pedidosClientesArray[index] = pedido;
  } else {
    // Verifica se já existe um pedido igual (opcional, para evitar duplicidade)
    const existe = pedidosClientesArray.some(p =>
      p.numero == pedido.numero &&
      p.data == pedido.data &&
      p.cliente == pedido.cliente
    );
    if (!existe) {
      pedidosClientesArray.push(pedido);
    }
  }

  await salvarPedidos();
  renderizarTabelaClientes();
  cancelarEdicaoCliente();
  document.getElementById('form-cliente').reset();
  
  // Restaurar data atual e prazo padrão
  const hoje = new Date().toISOString().split('T')[0];
  document.getElementById('data').value = hoje;
  const prazoDefault = calcularDiasUteis(hoje, 10).toISOString().split('T')[0];
  document.getElementById('prazo').value = prazoDefault;
  
  return true;
}

// Função para cancelar edição
function cancelarEdicaoCliente() {
  document.getElementById('editandoIndexCliente').value = '';
  document.getElementById('btnSalvarCliente').textContent = 'Adicionar Pedido';
  document.getElementById('btnCancelarEdicaoCliente').style.display = 'none';
  document.getElementById('form-cliente').reset();
}

// Função para atualizar a tabela de clientes
function atualizarTabelaClientes() {
const tbody = document.querySelector('#tab-clientes .data-table tbody');
tbody.innerHTML = '';

pedidosClientesArray.forEach((pedido, index) => {
  const tr = document.createElement('tr');
  
  tr.innerHTML = `
    <td>${pedido.pedidoNum}</td>
    <td>${pedido.data}</td>
    <td>${pedido.cliente}</td>
    <td>${pedido.material}</td>
    <td>${pedido.espessura}</td>
    <td>${pedido.modelo}</td>
    <td>${pedido.cor}</td>
    <td>${pedido.quantidade}</td>
    <td>${pedido.tamanho}</td>
    <td>${pedido.vendedor}</td>
    <td>${pedido.status}</td>
    <td>${pedido.prazo}</td>
    <td>
      <button class="btn btn-edit" onclick="editarPedidoCliente(${index})">Editar</button>
      <button class="btn btn-delete" onclick="excluirPedidoCliente(${index})">Excluir</button>
    </td>
  `;
  
  tbody.appendChild(tr);
});
}

// Adicionar eventos aos botões de edição e exclusão
function adicionarEventosBotoes() {
  document.querySelectorAll('.btn-editar').forEach((botao, index) => {
      botao.addEventListener('click', async () => await editarPedidoCliente(index));
  });

  document.querySelectorAll('.btn-danger').forEach((botao, index) => {
      botao.addEventListener('click', async () => await excluirPedidoCliente(index));
  });
}

// Filtrar cores
function filterCores(query) {
  const dropdown = document.getElementById('corDropdown');
  const items = dropdown.getElementsByClassName('color-list-item');
  
  for (let i = 0; i < items.length; i++) {
    const txtValue = items[i].textContent || items[i].innerText;
    if (txtValue.toUpperCase().indexOf(query.toUpperCase()) > -1) {
      items[i].classList.remove('hide');
    } else {
      items[i].classList.add('hide');
    }
  }
}

// Filtrar cores para produção
function filterCoresProd(value) {
  const dropdown = document.getElementById('corProdDropdown');
  const items = dropdown.getElementsByClassName('color-list-item');
  const searchValue = value.toLowerCase();

  for (let item of items) {
    const text = item.textContent.toLowerCase();
    if (text.includes(searchValue)) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  }
  dropdown.style.display = 'block';
}

// Selecionar cor
function selectCor(nome, cor) {
  document.getElementById('cor').value = nome;
  document.getElementById('corDropdown').style.display = 'none';
}

// Selecionar cor para produção
function selectCorProd(nome, cor) {
  document.getElementById('cor-prod').value = nome;
  document.getElementById('corProdDropdown').style.display = 'none';
}

// Formatar data DD/MM/AAAA
function formatarData(dataString) {
  if (!dataString) return '';
  
  // Se já estiver no formato DD/MM/AAAA, retorna como está
  if (dataString.includes('/')) {
    return dataString;
  }
  
  const data = new Date(dataString);
  if (isNaN(data.getTime())) return dataString;
  
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  
  return `${dia}/${mes}/${ano}`;
}

// Converter data do formato DD/MM/AAAA para YYYY-MM-DD (formato do input date)
function converterDataParaInput(dataString) {
  if (!dataString) return '';
  
  // Se já estiver no formato YYYY-MM-DD, retorna como está
  if (dataString.includes('-')) {
    return dataString;
  }
  
  if (dataString.includes('/')) {
    const [dia, mes, ano] = dataString.split('/');
    return `${ano}-${mes}-${dia}`;
  }
  
  return dataString;
}

// Função para salvar pedido de produção
async function salvarPedidoProducao() {
  const numero = document.getElementById('numero-prod').value || obterProximoNumeroPedido('producao');
  const data = document.getElementById('data-prod').value;
  const material = document.getElementById('material-prod').value;
  const espessura = document.getElementById('espessura-prod').value;
  const modelo = document.getElementById('modelo-prod').value;
  const cor = document.getElementById('cor-prod').value;
  const quantidade = document.getElementById('quantidade-prod').value;
  const tamanho = document.getElementById('tamanho-prod').value;
  const responsavel = document.getElementById('responsavel-prod').value;
  const status = document.getElementById('status-prod').value;
  const prazo = document.getElementById('prazo-prod').value;

  // Verificar campos obrigatórios
  if (!data || !material || !espessura || !cor || !quantidade || !responsavel) {
    return false;
  }

  const pedido = {
    numero,
    data: formatarData(data),
    material,
    espessura,
    modelo,
    cor,
    quantidade,
    tamanho,
    responsavel,
    status,
    prazo: formatarData(prazo)
  };

  // Verificar se está editando um pedido existente
  const editandoIndex = document.getElementById('editandoIndexProducao')?.value;
  if (editandoIndex !== undefined && editandoIndex !== '') {
    pedido.id = pedidosProducaoArray[editandoIndex].id;
    pedidosProducaoArray[editandoIndex] = pedido;
  } else {
    // Verifica se já existe um pedido igual para evitar duplicidade
    const existe = pedidosProducaoArray.some(p =>
      p.numero == pedido.numero &&
      p.data == pedido.data &&
      p.material == pedido.material &&
      p.espessura == pedido.espessura &&
      p.cor == pedido.cor &&
      p.quantidade == pedido.quantidade
    );
    if (!existe) {
      pedidosProducaoArray.push(pedido);
    } else {
      mostrarMensagem('Este pedido já existe na lista de produção!');
      return false;
    }
  }

  await salvarPedidos();
  renderizarTabelaProducao();
  
  // Limpar o formulário
  document.getElementById('form-producao').reset();
  
  // Restaurar data atual e prazo padrão
  const hoje = new Date().toISOString().split('T')[0];
  document.getElementById('data-prod').value = hoje;
  const prazoDefault = calcularDiasUteis(hoje, 10).toISOString().split('T')[0];
  document.getElementById('prazo-prod').value = prazoDefault;
  
  // Resetar o estado de edição
  if (document.getElementById('editandoIndexProducao')) {
    document.getElementById('editandoIndexProducao').value = '';
  }
  document.getElementById('btn-salvar-prod').textContent = 'Adicionar Pedido';
  document.getElementById('btn-cancelar-prod').style.display = 'none';

  return true;
}

// Função para cancelar edição de produção
function cancelarEdicaoProducao() {
  document.getElementById('form-producao').reset();
  if (document.getElementById('editandoIndexProducao')) {
    document.getElementById('editandoIndexProducao').value = '';
  }
  document.getElementById('btn-salvar-prod').textContent = 'Adicionar Pedido';
  document.getElementById('btn-cancelar-prod').style.display = 'none';
}

// Função para obter o código hexadecimal da cor
function obterCorHex(nomeCor) {
  const cores = {
    'AZUL BEBÊ': '#89CFF0',
    'AZUL TURQUESA': '#40E0D0',
    'AZUL ROYAL': '#4169E1',
    'AZUL ANIL': '#4B0082',
    'AZUL MARINHO': '#000080',
    'VERDE BEBÊ': '#CCFFCC',
    'VERDE LIMÃO': '#32CD32',
    'VERDE NEON': '#39FF14',
    'VERDE ÁGUA': '#7FFFD4',
    'VERDE CABARET': '#00FF7F',
    'VERDE BANDEIRA': '#008000',
    'VERDE MILITAR': '#4B5320',
    'VERDE JADE': '#00A86B',
    'AMARELO': '#efd109',
    'AMARELO MANTEIGA': '#F3E5AB',
    'MOSTARDA': '#FFDB58',
    'CHAMPAGNE': '#F7E7CE',
    'CHAMPAGNE ESCURO': '#E8C39E',
    'LARANJA': '#FFA500',
    'VERMELHO': '#db0e0e',
    'VERMELHO FIGO': '#932a2a',
    'ROSA BEBÊ': '#FFC0CB',
    'ROSA NEON': '#FF69B4',
    'ROSA PINK': '#FF1493',
    'LILÁS': '#C8A2C8',
    'ROXO': '#800080',
    'BORDÔ': '#800020',
    'VINHO': '#722F37',
    'AREIA': '#F5DEB3',
    'RAMI': '#D3CBBA',
    'BEGE': '#F5F5DC',
    'BRONZE': '#CD7F32',
    'TERRACOTA': '#E2725B',
    'CARAMELO': '#C67C48',
    'MARROM CAFÉ': '#6F4E37',
    'MARROM ESCURO': '#3C1414',
    'BRANCO': '#ffffff',
    'PRATA': '#C0C0C0',
    'PRATA GRAY': '#BBBBBB',
    'CINZA': '#808080',
    'CHUMBO': '#2F4F4F',
    'PRETA': '#000000',
    'CRU': '#F5DEB3',
    'JUTA': '#C67C48'
  };
  
  return cores[nomeCor?.toUpperCase()] || '#ffffff';
}

// Função para concluir pedido de produção
async function concluirPedidoProducao(index) {
  const pedido = pedidosProducaoArray.splice(index, 1)[0];
  if (pedido) {
    pedidosConcluidosArray.push(pedido);
    await salvarPedidos();
    renderizarTabelaProducao();
    renderizarTabelaConcluidos();
  }
}

// Função para renderizar tabela de pedidos concluídos
function renderizarTabelaConcluidos() {
  const tbody = document.querySelector('#tabela-concluidos tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  // Agrupar por material
  const grupos = {};
  pedidosConcluidosArray.forEach((pedido, index) => {
    if (!grupos[pedido.material]) grupos[pedido.material] = [];
    grupos[pedido.material].push({ ...pedido, _concluidoIndex: index });
  });

  // Para cada material, ordenar por espessura (numérica, se possível)
  Object.keys(grupos).forEach(material => {
    grupos[material].sort((a, b) => {
      const numA = parseFloat((a.espessura||'').replace(/[^\d.]/g, ''));
      const numB = parseFloat((b.espessura||'').replace(/[^\d.]/g, ''));
      return numA - numB;
    });
    grupos[material].forEach(pedido => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${pedido.material || ''}</td>
        <td>${pedido.espessura || ''}</td>
        <td>${pedido.modelo || ''}</td>
        <td><span class="color-indicator" style="background-color: ${obterCorHex(pedido.cor)}"></span> ${pedido.cor || ''}</td>
        <td>${pedido.quantidade || ''}</td>
        <td>${pedido.tamanho || ''}</td>
        <td style="vertical-align: middle;">
          <button class="btn btn-edit" onclick="editarPedidoConcluido(${pedido._concluidoIndex})">Editar</button>
          <button class="btn btn-delete" onclick="excluirPedidoConcluido(${pedido._concluidoIndex})">Excluir</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  });
}

// Função para editar pedido concluído (preenche o formulário de produção)
async function editarPedidoConcluido(index) {
  const pedido = pedidosConcluidosArray[index];
  if (!pedido) return;
  // Remover da lista de concluídos
  pedidosConcluidosArray.splice(index, 1);
  await salvarPedidos();
  renderizarTabelaConcluidos();
  // Preencher o formulário de produção
  document.getElementById('numero-prod').value = pedido.numero || '';
  // Corrigir data: se não houver, usar data de hoje
  let dataValue = converterDataParaInput(pedido.data) || '';
  if (!dataValue) {
    dataValue = new Date().toISOString().split('T')[0];
  }
  document.getElementById('data-prod').value = dataValue;
  document.getElementById('material-prod').value = pedido.material || '';
  document.getElementById('espessura-prod').value = pedido.espessura || '';
  document.getElementById('modelo-prod').value = pedido.modelo || '';
  document.getElementById('cor-prod').value = pedido.cor || '';
  document.getElementById('quantidade-prod').value = pedido.quantidade || '';
  document.getElementById('tamanho-prod').value = pedido.tamanho || '';
  // Não preenche responsável, status e prazo para o usuário completar
  document.getElementById('responsavel-prod').value = '';
  document.getElementById('status-prod').value = 'aguardando';
  document.getElementById('prazo-prod').value = '';
  // Rola até o formulário
  document.getElementById('form-producao').scrollIntoView({ behavior: 'smooth' });
}




