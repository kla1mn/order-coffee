document.addEventListener('DOMContentLoaded', () => {
    const addButton       = document.querySelector('.add-button');
    const beverageTemplate= document.querySelector('.beverage');
    const templateClone   = beverageTemplate.cloneNode(true);
    let nextNumber        = document.querySelectorAll('.beverage').length + 1;

    // === функции для добавления/удаления напитков (без изменений) ===
    function updateRemoveButtons() {
        const all = document.querySelectorAll('.beverage');
        all.forEach(fs => {
            const btn = fs.querySelector('.remove-button');
            btn.disabled = all.length <= 1;
        });
    }
    function insertRemoveButton(fieldset) {
        if (!fieldset.querySelector('.remove-button')) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'remove-button';
            btn.innerHTML = '&times;';
            btn.setAttribute('aria-label', 'Удалить напиток');
            fieldset.insertBefore(btn, fieldset.firstElementChild);
        }
    }
    function attachRemoveHandler(fieldset) {
        const btn = fieldset.querySelector('.remove-button');
        btn.addEventListener('click', () => {
            if (document.querySelectorAll('.beverage').length > 1) {
                fieldset.remove();
                updateRemoveButtons();
            }
        });
    }
    document.querySelectorAll('.beverage').forEach(fs => {
        insertRemoveButton(fs);
        attachRemoveHandler(fs);
    });
    updateRemoveButtons();
    addButton.addEventListener('click', () => {
        const newFieldset = templateClone.cloneNode(true);
        newFieldset.removeAttribute('id');
        newFieldset.querySelector('.beverage-count')
            .textContent = `Напиток №${nextNumber++}`;
        insertRemoveButton(newFieldset);
        attachRemoveHandler(newFieldset);
        addButton.parentNode.parentNode.insertBefore(newFieldset, addButton.parentNode);
        updateRemoveButtons();
    });
    // === /end добавление/удаление ===

    // Функция склонения «напиток»
    function getDrinkForm(n) {
        n = Math.abs(n) % 100;
        const last = n % 10;
        if (n > 10 && n < 20) return 'напитков';
        if (last === 1)              return 'напиток';
        if (last >= 2 && last <= 4)  return 'напитка';
        return 'напитков';
    }

    // Модальное окно
    const form         = document.querySelector('form');
    const modal        = document.getElementById('orderModal');
    const closeCross   = modal.querySelector('.modal-close');
    const overlay      = modal.querySelector('.modal-overlay');
    const orderMessage = modal.querySelector('#orderMessage');

    form.addEventListener('submit', e => {
        e.preventDefault();
        const count = document.querySelectorAll('.beverage').length;
        const formWord = getDrinkForm(count);
        orderMessage.textContent = `Заказ принят! Вы заказали ${count} ${formWord}`;
        modal.classList.remove('hidden');
    });

    function hideModal() {
        modal.classList.add('hidden');
    }
    closeCross.addEventListener('click', hideModal);
    overlay.addEventListener('click', hideModal);
});
