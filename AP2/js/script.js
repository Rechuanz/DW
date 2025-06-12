// Exemplo: Busca cotação do dólar na AwesomeAPI e exibe em dados-economicos.html
async function carregarCotacaoDolar() {
    const el = document.getElementById('cotacao-dolar');
    if (el) {
        try {
            const resp = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL');
            const data = await resp.json();
            el.textContent = `Dólar hoje: R$ ${parseFloat(data.USDBRL.bid).toFixed(2)}`;
        } catch (err) {
            el.textContent = "Erro ao carregar cotação.";
        }
    }
}
// Só chama em dados-economicos.html
carregarCotacaoDolar();

// Perguntas do questionário (agora com tempo de investimento)
const perguntas = [
    {
        texto: "Qual seu objetivo principal?",
        opcoes: ["Aposentadoria", "Comprar imóvel", "Viagem", "Outro"]
    },
    {
        texto: "Qual seu perfil de risco?",
        opcoes: ["Conservador", "Moderado", "Agressivo"]
    },
    {
        texto: "Quanto tempo pretende deixar o dinheiro investido?",
        opcoes: ["Menos de 1 ano", "1 a 3 anos", "3 a 5 anos", "Mais de 5 anos"]
    },
    {
        texto: "Qual valor inicial para investir?",
        opcoes: ["R$ 1.000", "R$ 5.000", "R$ 10.000", "Outro"]
    }
];

let respostas = [];
let indice = 0;

// Mostra cada pergunta do questionário
function mostrarPergunta() {
    const secao = document.getElementById('questionario-section');
    if (indice >= perguntas.length) {
        secao.innerHTML = '';
        mostrarRelatorio();
        return;
    }
    const p = perguntas[indice];
    secao.innerHTML = `
        <h2>${p.texto}</h2>
        <div class="opcoes">
            ${p.opcoes.map((op, i) => `
                <button class="opcao" data-i="${i}" type="button">${op}</button>
                ${op === "Outro" ? `<input type="${indice === 3 ? 'number' : 'text'}" class="input-outro" style="display:none;margin-top:8px;" placeholder="Digite sua opção${indice === 3 ? ' (apenas números)' : ''}">` : ''}
            `).join('')}
        </div>
    `;

    document.querySelectorAll('.opcao').forEach((btn, idx) => {
        btn.onclick = () => {
            // Se for "Outro", mostrar input
            if (btn.textContent === "Outro") {
                const inputOutro = btn.nextElementSibling;
                inputOutro.style.display = "block";
                inputOutro.focus();

                // Permitir apenas números se for a pergunta de valor inicial
                if (indice === 3) {
                    inputOutro.type = "number";
                    inputOutro.min = "1";
                    inputOutro.oninput = function () {
                        this.value = this.value.replace(/[^0-9]/g, '');
                    };
                } else {
                    inputOutro.type = "text";
                }

                inputOutro.onkeydown = (e) => {
                    if (e.key === "Enter" && inputOutro.value.trim() !== "") {
                        respostas.push(inputOutro.value.trim());
                        indice++;
                        mostrarPergunta();
                    }
                };
            } else {
                respostas.push(btn.textContent);
                indice++;
                mostrarPergunta();
            }
        };
    });
}

// Relatório final e gráfico (gráfico só aparece no final)
function mostrarRelatorio() {
    document.getElementById('relatorio-section').classList.remove('hidden');
    // Exibe cada pergunta e resposta
    let html = '<ul style="list-style: disc; padding-left: 1.2em">';
    perguntas.forEach((p, i) => {
        html += `<li><strong>${p.texto}</strong> <br>Resposta: ${respostas[i]}</li>`;
    });
    html += '</ul>';
    document.getElementById('perfil-resultado').innerHTML = html;

    // Mostra o gráfico só agora (deixa visível)
    document.querySelector('.grafico-container').style.display = 'block';

    // Consumo de API para comparar investimentos e gerar o gráfico
    compararInvestimentos();
}

// Simulação de investimentos baseada nas respostas
async function compararInvestimentos() {
    // Busca cotações reais para criptomoeda
    const url = "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BTC-BRL";
    const resp = await fetch(url);
    const data = await resp.json();

    // respostas[1] = perfil de risco, respostas[2] = tempo, respostas[3] = valor inicial
    let perfil = respostas[1];
    let tempo = respostas[2];
    let valorInicial = respostas[3];

    // Extrai número do valor inicial
    let valor = 1000;
    if (valorInicial) {
        let v = valorInicial.replace(/[^\d]/g, '');
        valor = parseFloat(v) || 1000;
    }

    // Fatores de tempo para simulação (quanto mais tempo, maior o retorno simulado)
    let fatorTempo = 1;
    switch (tempo) {
        case "Menos de 1 ano":
            fatorTempo = 1;
            break;
        case "1 a 3 anos":
            fatorTempo = 1.2;
            break;
        case "3 a 5 anos":
            fatorTempo = 1.5;
            break;
        case "Mais de 5 anos":
            fatorTempo = 2;
            break;
        default:
            fatorTempo = 1;
    }

    // Simulação de rendimento conforme perfil e tempo
    let rendimentoFixa = valor * (perfil === "Conservador" ? 1.06 : perfil === "Moderado" ? 1.09 : 1.12) * fatorTempo;
    let rendimentoVariavel = valor * (perfil === "Conservador" ? 1.03 : perfil === "Moderado" ? 1.15 : 1.30) * (fatorTempo + 0.2);
    let rendimentoCripto = valor * (perfil === "Conservador" ? 0.95 : perfil === "Moderado" ? 1.25 : 1.7) * (fatorTempo + 0.5);

    // Evita valores negativos
    rendimentoCripto = Math.max(rendimentoCripto, 0);

    const labels = ["Renda Fixa", "Renda Variável", "Criptomoeda"];
    const valores = [
        rendimentoFixa.toFixed(2),
        rendimentoVariavel.toFixed(2),
        rendimentoCripto.toFixed(2)
    ];

    // Gráfico com Chart.js
    const ctx = document.getElementById('grafico-perfil').getContext('2d');
    if (window.graficoInvest) window.graficoInvest.destroy();
    window.graficoInvest = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Retorno Simulado (R$)',
                data: valores,
                backgroundColor: ['#1a4d2e', '#f7c873', '#f7931a']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Comparativo de Investimentos' }
            }
        }
    });
}

// Só chama mostrarPergunta quando a página carrega
document.addEventListener('DOMContentLoaded', mostrarPergunta);
