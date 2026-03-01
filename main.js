console.log("This is fetch api ")

// fetch = Function used for making HTTP requests and fetch resources, (JSOn style data, images, files) Simplifies asynchoronous data fetching in javascript and used for interacting with APIs to retrive and send data asynchronously over the web. 
// Fetch Syntax: fetch ((url, {options})

// ---- AUTOCOMPLETE FEATURE ----

let allPokemonNames = [];

async function loadAllPokemon() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1500');
        const data = await response.json();
        allPokemonNames = data.results.map(p => p.name);
        console.log(`Loaded ${allPokemonNames.length} Pokémon names for suggestions`);
    } catch (err) {
        console.error("Could not load Pokémon list for suggestions", err);
    }
}

// Wait for HTML to fully load before grabbing elements
document.addEventListener('DOMContentLoaded', function () {

    const inputField = document.getElementById('pokemonName');
    const suggestionBox = document.getElementById('suggestion-box');

    inputField.addEventListener('input', function () {
        const typed = this.value.toLowerCase().trim();
        suggestionBox.innerHTML = '';

        if (typed.length === 0) {
            suggestionBox.style.display = 'none';
            return;
        }

        const matches = allPokemonNames.filter(name => name.startsWith(typed)).slice(0, 8);

        if (matches.length === 0) {
            suggestionBox.style.display = 'none';
            return;
        }

        matches.forEach(name => {
            const li = document.createElement('li');
            li.textContent = name;
            li.addEventListener('click', function () {
                inputField.value = name;
                suggestionBox.style.display = 'none';
                fetchData();
            });
            suggestionBox.appendChild(li);
        });

        suggestionBox.style.display = 'block';
    });

    document.addEventListener('click', function (e) {
        if (!inputField.contains(e.target) && !suggestionBox.contains(e.target)) {
            suggestionBox.style.display = 'none';
        }
    });

    // Load pokemon names on page ready
    loadAllPokemon();
});

// ---- YOUR ORIGINAL FETCH FUNCTION (unchanged) ----


async function fetchData() {

    try {

        const pokemonName = document.getElementById('pokemonName').value.toLowerCase();

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)

        if (!response.ok) {
            throw new Error('COuld not fetch resources')
        }

        const data = await response.json()
        console.log(data)
        const pokemonSprite = data.sprites.front_default;
        const imgElement = document.getElementById('Pokemon')
        const pokeInfo = document.getElementsByClassName('pokeInformation')
        // ...existing code...
        const pokeName = document.getElementById('Pokemon-name')
        const pokeKundali = document.getElementById("pokemon-kundali")
        const shinyVersion = document.getElementById("shiny-version");

        pokeName.textContent = data.name; // Display the Pokémon name
        imgElement.src = pokemonSprite;
        imgElement.style.display = "block";

        // displaying the shiny image if available
        shinyVersion.src = pokemonSprite
        
        
        if (data.sprites.front_shiny) {
            shinyVersion.src = data.sprites.front_shiny;
            shinyVersion.style.display = "block";
        } else {
            shinyVersion.src = "";
            shinyVersion.style.display = "none";
        }

        // Display Pokémon information
        pokeKundali.innerHTML = `
        <strong>ID:</strong> ${data.id}<br>
        <strong>Order:</strong> ${data.order}<br>
        <strong>Base Experience:</strong> ${data.base_experience}<br>
        <strong>Height:</strong> ${data.height}<br>
        <strong>Weight:</strong> ${data.weight}<br>
        <strong>Type:</strong> ${data.types.map(t => t.type.name).join(', ')}<br>
        <strong>Abilities:</strong> ${data.abilities.map(a => a.ability.name).join(', ')}<br>
        <strong>Base Stats:</strong>
        <ul>
            ${data.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
        </ul>
        <strong>Moves:</strong> ${data.moves.slice(0, 5).map(m => m.move.name).join(', ')}
    `;



    }
    catch (err) {
        console.error(err)
    }
}