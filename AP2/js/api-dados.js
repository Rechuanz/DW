// Comentário: Busca na API e construção da interface da tabela.
async function buscarDadosEconomicos() {
    const url = 'https://economia.awesomeapi.com.br/json/all/USD-BRL,EUR-BRL,BTC-BRL';
    const tabelaCorpo = document.getElementById('tabela-corpo');
    tabelaCorpo.innerHTML = '<tr><td colspan="4">Carregando...</td></tr>';

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erro ao buscar dados.');
        
        const dados = await response.json();
        tabelaCorpo.innerHTML = ''; // Limpa o "Carregando..."

        // Comentário: Construção das linhas da tabela dinamicamente com os dados da API.
        for (const moeda in dados) {
            const item = dados[moeda];
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>${item.code}</td>
                <td>${item.name}</td>
                <td>${parseFloat(item.bid).toFixed(2)}</td>
                <td style="color: ${item.pctChange < 0 ? 'red' : 'green'}">${item.pctChange}%</td>
            `;
            
            tabelaCorpo.appendChild(tr);
        }
    } catch (error) {
        tabelaCorpo.innerHTML = `<tr><td colspan="4">${error.message}</td></tr>`;
        console.error("Falha na API: ", error);
    }
}

document.addEventListener('DOMContentLoaded', buscarDadosEconomicos);