document.addEventListener('DOMContentLoaded', () => {
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const apiUrl = 'https://apkp.vercel.app/ap/data';

    // Fetching data and populating grid
    fetch(proxyUrl + encodeURIComponent(apiUrl))
        .then(response => response.json())
        .then(data => {
            const jsonData = JSON.parse(data.contents);  // Parse the JSON string from the proxy
            const gridContainer = document.getElementById('superheroes-grid');
            jsonData.forEach(hero => {
                const card = createCard(hero);
                gridContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching the data:', error);
        });

    // Function to create card for a hero
    function createCard(hero) {
        const card = document.createElement('div');
        card.classList.add('card');

        const cardHeader = document.createElement('div');
        cardHeader.classList.add('card-header');
        cardHeader.textContent = hero.name;
        card.appendChild(cardHeader);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const idPara = document.createElement('p');
        idPara.textContent = `ID: ${hero.id}`;
        cardBody.appendChild(idPara);

        const emailPara = document.createElement('p');
        emailPara.textContent = `Email: ${hero.email}`;
        cardBody.appendChild(emailPara);

        const contactPara = document.createElement('p');
        contactPara.textContent = `Contact: ${hero.contact}`;
        cardBody.appendChild(contactPara);

        const rolePara = document.createElement('p');
        rolePara.textContent = `Role: ${hero.role}`;
        cardBody.appendChild(rolePara);

        card.appendChild(cardBody);
        return card;
    }

    // Search functionality
    const searchInput = document.getElementById('hero-search');
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            const heroName = card.querySelector('.card-header').textContent.toLowerCase();
            if (heroName.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});
