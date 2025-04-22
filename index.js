document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.querySelector('.add-button');
    const beverageTemplate = document.querySelector('.beverage');
    const templateClone = beverageTemplate.cloneNode(true);
    let nextNumber = document.querySelectorAll('.beverage').length + 1;

    const milkMap = {
        usual: 'обычное молоко',
        'no-fat': 'обезжиренное молоко',
        soy: 'соевое молоко',
        coconut: 'кокосовое молоко'
    };

    const optionsMap = {
        'whipped cream': 'взбитые сливки',
        marshmallow: 'зефирки',
        chocolate: 'шоколад',
        cinnamon: 'корица'
    };

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

    document.querySelectorAll('.beverage').forEach((fs, idx) => {
        insertRemoveButton(fs);
        attachRemoveHandler(fs);
        fs.querySelectorAll('input[type="radio"][name="milk"]').forEach(r => {
            r.name = `milk_${idx+1}`;
        });
    });
    updateRemoveButtons();

    addButton.addEventListener('click', () => {
        const id = nextNumber++;
        const newFs = templateClone.cloneNode(true);
        newFs.removeAttribute('id');
        newFs.querySelector('.beverage-count').textContent = `Напиток №${id}`;
        newFs.querySelectorAll('input[type="radio"][name="milk"]').forEach(r => {
            r.name = `milk_${id}`;
        });
        insertRemoveButton(newFs);
        attachRemoveHandler(newFs);
        const wrapper = addButton.parentNode;
        wrapper.parentNode.insertBefore(newFs, wrapper);
        updateRemoveButtons();
    });

    const pluralRules = new Intl.PluralRules('ru', { type: 'cardinal' });
    const drinkForms = { one: 'напиток', few: 'напитка', many: 'напитков', other: 'напитка' };
    function getDrinkForm(n) {
        return drinkForms[pluralRules.select(n)];
    }

    const form= document.querySelector('form');
    const modal= document.getElementById('orderModal');
    const closeCross= modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    const orderCount= modal.querySelector('#orderCount');
    const orderDetails = modal.querySelector('#orderDetails');

    form.addEventListener('submit', e => {
        e.preventDefault();
        const beverages = document.querySelectorAll('.beverage');
        const count     = beverages.length;
        orderCount.textContent = `Вы заказали ${count} ${getDrinkForm(count)}`;

        let html = '<table><thead><tr>'
            + '<th>Напиток</th><th>Молоко</th><th>Дополнительно</th>'
            + '</tr></thead><tbody>';
        beverages.forEach(fs => {
            const drink = fs.querySelector('select').selectedOptions[0].textContent;
            const milkValue = fs.querySelector(`input[name^="milk_"]:checked`).value;
            const milk = milkMap[milkValue] || '';
            const opts = Array.from(fs.querySelectorAll('input[name="options"]:checked'))
                .map(ch => optionsMap[ch.value] || '')
                .filter(Boolean)
                .join(', ');
            html += '<tr>'
                + `<td>${drink}</td>`
                + `<td>${milk}</td>`
                + `<td>${opts}</td>`
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
