document.addEventListener('DOMContentLoaded', () => {
    const addButton        = document.querySelector('.add-button');
    const beverageTemplate = document.querySelector('.beverage');
    const templateClone    = beverageTemplate.cloneNode(true);
    let nextNumber         = document.querySelectorAll('.beverage').length + 1;

    // Присваивает радиогруппе «milk» внутри данного fieldset уникальное имя
    function assignMilkName(fieldset, id) {
        fieldset
            .querySelectorAll('input[type="radio"][name="milk"]')
            .forEach(radio => {
                radio.name = `milk_${id}`;
            });
    }

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

    // Инициализируем уже существующие формы
    document.querySelectorAll('.beverage').forEach((fs, idx) => {
        insertRemoveButton(fs);
        attachRemoveHandler(fs);
        assignMilkName(fs, idx + 1);
    });
    updateRemoveButtons();

    // Добавление новой формы
    addButton.addEventListener('click', () => {
        const newFieldset = templateClone.cloneNode(true);
        newFieldset.removeAttribute('id');

        // Нумерация
        const number = nextNumber++;
        newFieldset.querySelector('.beverage-count')
            .textContent = `Напиток №${number}`;

        // Уникальная радиогруппа milk
        assignMilkName(newFieldset, number);

        insertRemoveButton(newFieldset);
        attachRemoveHandler(newFieldset);

        const wrapper = addButton.parentNode;
        wrapper.parentNode.insertBefore(newFieldset, wrapper);
        updateRemoveButtons();
    });

    // Склонение "напиток"
    function getDrinkForm(n) {
        n = Math.abs(n) % 100;
        const last = n % 10;
        if (n > 10 && n < 20) return 'напитков';
        if (last === 1)              return 'напиток';
        if (last >= 2 && last <= 4)  return 'напитка';
        return 'напитков';
    }

    // Модальное окно
    const form        = document.querySelector('form');
    const modal       = document.getElementById('orderModal');
    const closeCross  = modal.querySelector('.modal-close');
    const overlay     = modal.querySelector('.modal-overlay');
    const orderCount  = modal.querySelector('#orderCount');
    const orderDetails= modal.querySelector('#orderDetails');

    form.addEventListener('submit', e => {
        e.preventDefault();

        const count = document.querySelectorAll('.beverage').length;
        orderCount.textContent = `Вы заказали ${count} ${getDrinkForm(count)}`;

        // Заполняем таблицу
        let html = '<table><thead><tr>'
            + '<th>Напиток</th><th>Молоко</th><th>Дополнительно</th>'
            + '</tr></thead><tbody>';

        document.querySelectorAll('.beverage').forEach(fs => {
            const drinkName = fs.querySelector('select').selectedOptions[0].textContent;
            const milkName  = fs.querySelector(`input[name="milk_${fs.querySelector('.beverage-count').textContent.split('№')[1]}"]:checked`)
                .parentNode.querySelector('span').textContent;
            const opts = Array.from(fs.querySelectorAll('input[name="options"]:checked'))
                .map(ch => ch.parentNode.querySelector('span').textContent);

            html += '<tr>'
                + `<td>${drinkName}</td>`
                + `<td>${milkName}</td>`
                + `<td>${opts.join(', ')}</td>`
                + '</tr>';
        });

        html += '</tbody></table>';
        orderDetails.innerHTML = html;

        modal.classList.remove('hidden');
    });

    function hideModal() {
        modal.classList.add('hidden');
    }
    closeCross.addEventListener('click', hideModal);
    overlay.addEventListener('click', hideModal);
});
