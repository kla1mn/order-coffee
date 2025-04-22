document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.querySelector('.add-button');
    const beverageTemplate = document.querySelector('.beverage');
    const templateClone = beverageTemplate.cloneNode(true);
    let nextNumber = document.querySelectorAll('.beverage').length + 1;

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
        const hdr = newFieldset.querySelector('.beverage-count');
        hdr.textContent = `Напиток №${nextNumber}`;
        nextNumber++;

        insertRemoveButton(newFieldset);
        attachRemoveHandler(newFieldset);

        const wrapper = addButton.parentNode;
        wrapper.parentNode.insertBefore(newFieldset, wrapper);

        updateRemoveButtons();
    });
});
