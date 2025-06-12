document.addEventListener('DOMContentLoaded', () => {
    // Dados simulados (mock) de investimentos
    const dados = [
        { tipo: "Renda Fixa", desc: "CDB, Tesouro Direto, LCI/LCA", rent: "8.5", risco: "Baixo" },
        { tipo: "Renda Variável", desc: "Ações, Fundos Imobiliários", rent: "15.2", risco: "Médio/Alto" },
        { tipo: "Criptomoedas", desc: "Bitcoin, Ethereum", rent: "35.0", risco: "Alto" }
    ];
    const tbody = document.querySelector('#tabela-investimentos tbody');
    tbody.innerHTML = dados.map(d => `
        <tr>
            <td>${d.tipo}</td>
            <td>${d.desc}</td>
            <td>${d.rent}</td>
            <td>${d.risco}</td>
        </tr>
    `).join('');
});