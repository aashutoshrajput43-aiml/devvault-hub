const defaultResources = [
    { id: 1, title: "MDN Web Docs", category: "Web Dev", description: "Best documentation for HTML, CSS, and JS.", link: "https://developer.mozilla.org", votes: 12 },
    { id: 2, title: "W3Schools", category: "Web Dev", description: "Easy tutorials to learn web development step by step.", link: "https://www.w3schools.com", votes: 9 },
    { id: 3, title: "Flutter Docs", category: "App Dev", description: "Official documentation for Flutter framework.", link: "https://flutter.dev", votes: 8 },
    { id: 4, title: "Android Developers", category: "App Dev", description: "Official guides to build Android apps.", link: "https://developer.android.com", votes: 6 },
    { id: 5, title: "Hugging Face", category: "AI/ML", description: "Platform for AI models and datasets.", link: "https://huggingface.co", votes: 15 },
    { id: 6, title: "Kaggle", category: "AI/ML", description: "Datasets and practice for machine learning.", link: "https://www.kaggle.com", votes: 11 },
    { id: 7, title: "Canva", category: "Tools", description: "Graphic design platform for quick UI assets.", link: "https://canva.com", votes: 5 },
    { id: 8, title: "GitHub", category: "Tools", description: "Store your code and work with your team.", link: "https://github.com", votes: 14 }
];

let resources = JSON.parse(localStorage.getItem('hubResources')) || defaultResources;
let votedIds = JSON.parse(localStorage.getItem('hubVoted')) || [];
let selectedCategory = 'All';

if (localStorage.getItem('hubTheme') === 'dark') {
    document.body.classList.add('dark-mode');
    document.getElementById('themeToggleBtn').innerText = '☀️ Light Mode';
}

displayResources(resources);

function displayResources(data) {
    const grid = document.getElementById('resourceGrid');
    grid.innerHTML = '';

    if (data.length === 0) {
        grid.innerHTML = '<p>No resources found!</p>';
        return;
    }

    data.forEach(item => {
        let voteBtn = '';
        if (votedIds.includes(item.id)) {
            voteBtn = `<button class="upvote-btn voted" disabled>✅ Voted ${item.votes}</button>`;
        } else {
            voteBtn = `<button class="upvote-btn" onclick="upvote(${item.id})">👍 ${item.votes}</button>`;
        }

        const domain = new URL(item.link).hostname;
        const logo = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

        grid.innerHTML += `
            <div class="card">
                <div>
                    <div class="card-top">
                        <img class="card-logo" src="${logo}" alt="logo" onerror="this.style.display='none'">
                        <span class="card-tag">${item.category}</span>
                    </div>
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                </div>
                <div class="card-footer">
                    <a href="${item.link}" target="_blank">Visit Site ↗</a>
                    ${voteBtn}
                </div>
            </div>`;
    });
}

function filterResources() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const filtered = resources.filter(item => {
        const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const matchSearch = item.title.toLowerCase().includes(searchText) || item.description.toLowerCase().includes(searchText);
        return matchCategory && matchSearch;
    });
    displayResources(filtered);
}

function filterCategory(category, button) {
    selectedCategory = category;
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    filterResources();
}

function addResource(event) {
    event.preventDefault();
    const newResource = {
        id: Date.now(),
        title: document.getElementById('title').value,
        category: document.getElementById('category').value,
        description: document.getElementById('description').value,
        link: document.getElementById('link').value,
        votes: 0
    };
    resources.unshift(newResource);
    saveAndRender();
    document.getElementById('resourceForm').reset();
}

function upvote(id) {
    if (votedIds.includes(id)) return;
    const item = resources.find(r => r.id === id);
    if (item) {
        item.votes++;
        votedIds.push(id);
        localStorage.setItem('hubVoted', JSON.stringify(votedIds));
        saveAndRender();
    }
}

function saveAndRender() {
    localStorage.setItem('hubResources', JSON.stringify(resources));
    filterResources();
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    document.getElementById('themeToggleBtn').innerText = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    localStorage.setItem('hubTheme', isDark ? 'dark' : 'light');
}