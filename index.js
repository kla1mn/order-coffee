document.addEventListener('DOMContentLoaded', () => {
    const addButton        = document.querySelector('.add-button');
    const beverageTemplate = document.querySelector('.beverage');
    const templateClone    = beverageTemplate.cloneNode(true);
    let nextNumber         = document.querySelectorAll('.beverage').length + 1;

    const milkMap = {
        usual: 'обычное молоко',
        'no-fat': 'обезжиренное молоко',
        soy: 'соевое молоко',
        coconut: 'кокосовое молоко'
    };
    const optionsMap = {
        'whipped cream': 'взбитые сливки',
        marshmallow:     'зефирки',
        chocolate:       'шоколад',
        cinnamon:        'корица'
    };

    const keywords = ['срочно','быстрее','побыстрее','скорее','поскорее','очень нужно'];
    const wishRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
    function processWish(text) {
        return text
            .replace(wishRegex, match => `<b>${match}</b>`)
            .replace(/\n/g, '<br/>');
    }

    function updateRemoveButtons() {
        const all = document.querySelectorAll('.beverage');
        all.forEach(fs => {
            const btn = fs.querySelector('.remove-button');
            btn.disabled = all.length <= 1;
        });
    }
    function insertRemoveButton(fs) {
        if (!fs.querySelector('.remove-button')) {
            const btn = document.createElement('button');
            btn.type = 'button'; btn.className = 'remove-button';
            btn.innerHTML = '&times;';
            btn.setAttribute('aria-label','Удалить напиток');
            fs.insertBefore(btn, fs.firstElementChild);
        }
    }
    function attachRemoveHandler(fs) {
        const btn = fs.querySelector('.remove-button');
        btn.addEventListener('click', () => {
            if (document.querySelectorAll('.beverage').length > 1) {
                fs.remove(); updateRemoveButtons();
            }
        });
    }
    function assignMilkName(fs,id) {
        fs.dataset.index = id;
        fs.querySelectorAll('input[type="radio"][name="milk"]')
            .forEach(r => r.name = `milk_${id}`);
    }
    function attachWishHandler(fs) {
        const ta = fs.querySelector('textarea.wish');
        const pv = fs.querySelector('.wish-preview');
        ta.addEventListener('input', () => {
            pv.innerHTML = processWish(ta.value);
        });
        pv.innerHTML = processWish(ta.value);
    }

    document.querySelectorAll('.beverage').forEach((fs,idx) => {
        const id = idx+1;
        assignMilkName(fs,id);
        insertRemoveButton(fs);
        attachRemoveHandler(fs);
        attachWishHandler(fs);
    });
    updateRemoveButtons();

    addButton.addEventListener('click', () => {
        const id    = nextNumber++;
        const newFs = templateClone.cloneNode(true);
        newFs.removeAttribute('id');
        newFs.querySelector('.beverage-count').textContent = `Напиток №${id}`;
        assignMilkName(newFs,id);
        insertRemoveButton(newFs);
        attachRemoveHandler(newFs);
        attachWishHandler(newFs);
        const wr = addButton.parentNode;
        wr.parentNode.insertBefore(newFs,wr);
        updateRemoveButtons();
    });

    const pluralRules = new Intl.PluralRules('ru',{type:'cardinal'});
    const drinkForms  = { one:'напиток', few:'напитка', many:'напитков', other:'напитка' };
    function getDrinkForm(n) { return drinkForms[pluralRules.select(n)]; }

    const form         = document.querySelector('form');
    const modal        = document.getElementById('orderModal');
    const closeCross   = modal.querySelector('.modal-close');
    const overlay      = modal.querySelector('.modal-overlay');
    const orderCount   = modal.querySelector('#orderCount');
    const orderDetails = modal.querySelector('#orderDetails');

    form.addEventListener('submit', e => {
        e.preventDefault();
        const bev = document.querySelectorAll('.beverage');
        const cnt = bev.length;
        orderCount.textContent = `Вы заказали ${cnt} ${getDrinkForm(cnt)}`;

        let html = '<table><thead><tr>'
            + '<th>Напиток</th><th>Молоко</th><th>Дополнительно</th><th>Пожелания</th>'
            + '</tr></thead><tbody>';
        bev.forEach(fs => {
            const drinkName = fs.querySelector('select').selectedOptions[0].textContent;
            const id = fs.dataset.index;
            const milkVal   = fs.querySelector(`input[name="milk_${id}"]:checked`).value;
            const milkName  = milkMap[milkVal]||'';
            const opts      = Array.from(fs.querySelectorAll('input[name="options"]:checked'))
                .map(ch=>optionsMap[ch.value]||'')
                .filter(Boolean).join(', ');
            const wishText  = processWish(fs.querySelector('textarea.wish').value);

            html += '<tr>'
                + `<td>${drinkName}</td>`
                + `<td>${milkName}</td>`
                + `<td>${opts}</td>`
                + `<td>${wishText}</td>`
                + '</tr>';
        });
        html += '</tbody></table>';
        orderDetails.innerHTML = html;
        modal.classList.remove('hidden');
    });

    function hideModal() { modal.classList.add('hidden'); }
    closeCross.addEventListener('click', hideModal);
    overlay.addEventListener('click', hideModal);
});
