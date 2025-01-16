function loadPage(page) {
    const content = document.getElementById('content');
    fetch(`pages/${page}.html`)
        .then(response => {
            if (!response.ok) throw new Error('Page not found');
            return response.text();
        })
        .then(html => {
            content.innerHTML = html;
            history.pushState({}, '', page);
        })
        .catch(() => {
            content.innerHTML = '<h2>Page not found</h2>';
        });
}

window.onload = () => {
    const path = window.location.pathname.split('/').pop() || 'index/login';
    loadPage(path);
};

window.onpopstate = () => {
    const path = window.location.pathname.split('/').pop();
    loadPage(path);
};
