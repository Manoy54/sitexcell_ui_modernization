const exitFlag = 'sitexcell-cositer-demo-exit';
const formSessionKeys = [
    'proposed-laan-form-session-v1',
    'proposed-laan-form-explicit-draft-v1',
    'sitexcell-access-request-prototype-v1',
];

if (document.querySelector('.demo-login') && sessionStorage.getItem(exitFlag) === '1') {
    formSessionKeys.forEach((key) => sessionStorage.removeItem(key));
    sessionStorage.removeItem(exitFlag);
}

document.querySelector('[data-demo-exit]')?.addEventListener('click', () => {
    // Clear after navigation so a cancelled LAAN leave warning cannot erase the open form.
    sessionStorage.setItem(exitFlag, '1');
});

const requestRows = [...document.querySelectorAll('[data-demo-request]')];
const requestSearch = document.querySelector('[data-demo-request-search]');
const statusFilter = document.querySelector('[data-demo-status-filter]');
const typeFilter = document.querySelector('[data-demo-type-filter]');

function filterRequests() {
    const query = requestSearch.value.trim().toLowerCase();
    let visibleCount = 0;

    requestRows.forEach((row) => {
        const visible = row.dataset.search.includes(query)
            && (!statusFilter.value || row.dataset.status === statusFilter.value)
            && (!typeFilter.value || row.dataset.type === typeFilter.value);
        row.hidden = !visible;
        if (visible) visibleCount += 1;
    });

    document.querySelector('[data-demo-request-count]').textContent = `Showing ${visibleCount} of ${requestRows.length} fictional requests`;
    document.querySelector('[data-demo-request-empty]').hidden = visibleCount !== 0;
}

if (requestRows.length) {
    [requestSearch, statusFilter, typeFilter].forEach((control) => {
        control.addEventListener('input', filterRequests);
        control.addEventListener('change', filterRequests);
    });
    filterRequests();
}

const userRows = [...document.querySelectorAll('[data-demo-user]')];
const userSearch = document.querySelector('[data-demo-user-search]');

if (userRows.length) {
    const filterUsers = () => {
        const query = userSearch.value.trim().toLowerCase();
        let visibleCount = 0;
        userRows.forEach((row) => {
            row.hidden = !row.dataset.search.includes(query);
            if (!row.hidden) visibleCount += 1;
        });
        document.querySelector('[data-demo-user-count]').textContent = `Showing ${visibleCount} of ${userRows.length} fictional users`;
        document.querySelector('[data-demo-user-empty]').hidden = visibleCount !== 0;
    };
    userSearch.addEventListener('input', filterUsers);
    filterUsers();
}

document.querySelector('[data-demo-contact-preview]')?.addEventListener('click', (event) => {
    const fields = event.currentTarget.closest('[data-demo-contact-form]');
    const invalidControl = [...fields.querySelectorAll('input, textarea')].find((control) => !control.checkValidity());
    if (invalidControl) {
        invalidControl.reportValidity();
        return;
    }
    fields.querySelector('[data-demo-contact-status]').textContent = 'Preview complete. No message was sent or stored.';
});
