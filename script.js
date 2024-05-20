document.addEventListener('DOMContentLoaded', () => {
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const apiUrl = 'https://apkp.vercel.app/ap/data';
    const itemsPerPage = 10;
    let currentPage = 1;
    let jsonData = [];
    let team = [];

    // Fetching data and populating grid
    fetch(proxyUrl + encodeURIComponent(apiUrl))
        .then(response => response.json())
        .then(data => {
            jsonData = JSON.parse(data.contents);  // Parse the JSON string from the proxy
            renderPage(currentPage);
            setupPagination();
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

        const addToTeamDiv = document.createElement('div');
        addToTeamDiv.classList.add('add-to-team');

        const addToTeamButton = document.createElement('button');
        addToTeamButton.textContent = 'Add to Team';
        addToTeamButton.addEventListener('click', () => addToTeam(hero));
        addToTeamDiv.appendChild(addToTeamButton);

        cardBody.appendChild(addToTeamDiv);
        card.appendChild(cardBody);
        return card;
    }

    // Function to render the current page
    function renderPage(page) {
        const gridContainer = document.getElementById('superheroes-grid');
        gridContainer.innerHTML = '';
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedItems = jsonData.slice(start, end);
        paginatedItems.forEach(hero => {
            const card = createCard(hero);
            gridContainer.appendChild(card);
        });
    }

    // Function to setup pagination
    function setupPagination() {
        const pagination = document.getElementById('pagination');
        const totalPages = Math.ceil(jsonData.length / itemsPerPage);
        pagination.innerHTML = '';

        const prevButton = document.createElement('li');
        prevButton.classList.add('page-item');
        prevButton.innerHTML = `<a class="page-link" href="#">Previous</a>`;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderPage(currentPage);
                updatePagination();
            }
        });
        pagination.appendChild(prevButton);

        for (let i = 1; i <= totalPages; i++) {
            const pageItem = document.createElement('li');
            pageItem.classList.add('page-item');
            if (i === currentPage) {
                pageItem.classList.add('active');
            }
            pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            pageItem.addEventListener('click', () => {
                currentPage = i;
                renderPage(currentPage);
                updatePagination();
            });
            pagination.appendChild(pageItem);
        }

        const nextButton = document.createElement('li');
        nextButton.classList.add('page-item');
        nextButton.innerHTML = `<a class="page-link" href="#">Next</a>`;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderPage(currentPage);
                updatePagination();
            }
        });
        pagination.appendChild(nextButton);
    }

    // Function to update pagination buttons
    function updatePagination() {
        const pagination = document.getElementById('pagination');
        const pageItems = pagination.querySelectorAll('.page-item');
        const totalPages = Math.ceil(jsonData.length / itemsPerPage);

        pageItems.forEach((item, index) => {
            item.classList.remove('active');
            if (index === currentPage) {
                item.classList.add('active');
            }
        });

        if (currentPage === 1) {
            pageItems[0].classList.add('disabled');
        } else {
            pageItems[0].classList.remove('disabled');
        }

        if (currentPage === totalPages) {
            pageItems[pageItems.length - 1].classList.add('disabled');
        } else {
            pageItems[pageItems.length - 1].classList.remove('disabled');
        }
    }

    // Function to add a hero to the team
    function addToTeam(hero) {
        if (!team.some(member => member.id === hero.id)) {
            team.push(hero);
            showAlert(`${hero.name} has been added to your team!`, 'success');
        } else {
            showAlert(`${hero.name} is already in your team!`, 'warning');
        }
        updateTeamView();
    }

    // Function to show alert
    function showAlert(message, type) {
        const alertContainer = document.createElement('div');
        alertContainer.className = `alert alert-${type} alert-dismissible fade show`;
        alertContainer.role = 'alert';
        alertContainer.innerHTML = `
            ${message}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        `;
        const gridContainer = document.getElementById('superheroes-grid');
        gridContainer.prepend(alertContainer); // Append the alert to the top of the grid container

        setTimeout(() => {
            alertContainer.classList.remove('show');
            alertContainer.addEventListener('transitionend', () => alertContainer.remove());
        }, 3000);
    }

    // Function to update team view in the modal
    function updateTeamView() {
        const teamContainer = document.getElementById('team-container');
        teamContainer.innerHTML = '';
        team.forEach(hero => {
            const card = createCard(hero);
            const removeFromTeamButton = document.createElement('button');
            removeFromTeamButton.textContent = 'Remove from Team';
            removeFromTeamButton.addEventListener('click', () => removeFromTeam(hero));
            card.querySelector('.card-body').appendChild(removeFromTeamButton);
            teamContainer.appendChild(card);
        });
    }

    // Function to remove a hero from the team
    function removeFromTeam(hero) {
        team = team.filter(member => member.id !== hero.id);
        updateTeamView();
    }

    // Search functionality
    const searchInput = document.getElementById('hero-search');
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredData = jsonData.filter(hero => 
            hero.name.toLowerCase().includes(searchTerm)
        );
        renderFilteredPage(filteredData);
        setupFilteredPagination(filteredData);
    });

    function renderFilteredPage(filteredData) {
        const gridContainer = document.getElementById('superheroes-grid');
        gridContainer.innerHTML = '';
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedItems = filteredData.slice(start, end);
        paginatedItems.forEach(hero => {
            const card = createCard(hero);
            gridContainer.appendChild(card);
        });
    }

    function setupFilteredPagination(filteredData) {
        const pagination = document.getElementById('pagination');
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        pagination.innerHTML = '';

        const prevButton = document.createElement('li');
        prevButton.classList.add('page-item');
        prevButton.innerHTML = `<a class="page-link" href="#">Previous</a>`;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderFilteredPage(filteredData);
                updateFilteredPagination(filteredData);
            }
        });
        pagination.appendChild(prevButton);

        for (let i = 1; i <= totalPages; i++) {
            const pageItem = document.createElement('li');
            pageItem.classList.add('page-item');
            if (i === currentPage) {
                pageItem.classList.add('active');
            }
            pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            pageItem.addEventListener('click', () => {
                currentPage = i;
                renderFilteredPage(filteredData);
                updateFilteredPagination(filteredData);
            });
            pagination.appendChild(pageItem);
        }

        const nextButton = document.createElement('li');
        nextButton.classList.add('page-item');
        nextButton.innerHTML = `<a class="page-link" href="#">Next</a>`;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderFilteredPage(filteredData);
                updateFilteredPagination(filteredData);
            }
        });
        pagination.appendChild(nextButton);
    }

    function updateFilteredPagination(filteredData) {
        const pagination = document.getElementById('pagination');
        const pageItems = pagination.querySelectorAll('.page-item');
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);

        pageItems.forEach((item, index) => {
            item.classList.remove('active');
            if (index === currentPage) {
                item.classList.add('active');
            }
        });

        if (currentPage === 1) {
            pageItems[0].classList.add('disabled');
        } else {
            pageItems[0].classList.remove('disabled');
        }

        if (currentPage === totalPages) {
            pageItems[pageItems.length - 1].classList.add('disabled');
        } else {
            pageItems[pageItems.length - 1].classList.remove('disabled');
        }
    }

    // Show team modal
    const viewTeamButton = document.getElementById('view-team');
    viewTeamButton.addEventListener('click', () => {
        const teamModal = new bootstrap.Modal(document.getElementById('teamModal'));
        teamModal.show();
    });
});
