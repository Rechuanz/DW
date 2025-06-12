// Validação do formulário de contato: apenas letras no nome
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-contato');
    const nomeInput = document.getElementById('nome-contato');
    const feedback = document.getElementById('feedback-contato');

    if (form) {
        nomeInput.addEventListener('input', function () {
            // Remove números e caracteres especiais
            this.value = this.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
        });

        form.addEventListener('submit', function (e) {
            if (!nomeInput.value.match(/^[A-Za-zÀ-ÿ\s]+$/)) {
                e.preventDefault();
                feedback.textContent = "Por favor, insira apenas letras no nome.";
                nomeInput.focus();
            } else {
                feedback.textContent = "Mensagem enviada com sucesso!";
            }
        });
    }
});