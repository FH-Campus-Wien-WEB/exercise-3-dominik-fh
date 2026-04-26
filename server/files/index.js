const renderValuesAsList = (values) => {
    const items = Array.isArray(values) ? values : [values]

    return `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`
}

const formatReleaseDate = (released) => {
    const releasedDate = new Date(released)

    return releasedDate.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
}

function formatRuntime(runtime) {
    const hours = Math.trunc(runtime / 60);
    const minutes = runtime % 60;
    return hours + "h " + minutes + "m";
}

function appendMovie(movie, element) {
    const article = document.createElement("article")
    article.className = 'article'
    article.innerHTML = `
                            <article class="movieArticle" id="${movie.imdbID}">
                                <header>
                                <h1>${movie.Title}</h1>
                                <button type="button" onClick="location.href='edit.html?imdbID=${movie.imdbID}'">Edit</button>
                                </header>
                                <img class="poster" src="${movie.Poster}" alt="Poster for ${movie.Title}">
                                <p>${movie.Plot}</p>
                                <ul>
                                    <li><strong>Runtime:</strong> ${formatRuntime(movie.Runtime)}</li>
                                    <li><strong>imdbRating:</strong> ${movie.imdbRating}</li>
                                    <li><strong>Metascore:</strong> ${movie.Metascore}</li>
                                    <li>
                                        <strong>Genres:</strong>
                                        ${renderValuesAsList(movie.Genres)}
                                    </li>
                                    <li>
                                        <strong>Directors:</strong>
                                        ${renderValuesAsList(movie.Directors)}
                                    </li>
                                    <li>
                                        <strong>Writers:</strong>
                                        ${renderValuesAsList(movie.Writers)}
                                    </li>
                                    <li>
                                        <strong>Actors:</strong>
                                        ${renderValuesAsList(movie.Actors)}
                                    </li>
                                    <li><strong>Released:</strong> ${formatReleaseDate(movie.Released)}</li>
                                </ul>
                            </article>
                        `
    element.append(article);
}

function createGenreButton(label, genre) {
    const listItem = document.createElement("li")
    const button = document.createElement("button")

    button.type = "button"
    button.textContent = label
    button.addEventListener("click", () => {
        document.querySelectorAll("nav button").forEach(navButton => {
            // toggles class is-active only for button that got clicked
            navButton.classList.toggle("is-active", navButton === button)
        })

        loadMovies(genre)
    })

    listItem.append(button)
    return listItem
}

function loadMovies(genre) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const mainElement = document.querySelector("main");

        while (mainElement.childElementCount > 0) {
            mainElement.firstChild.remove()
        }

        if (xhr.status === 200) {
            const movies = JSON.parse(xhr.responseText)
            for (const movie of movies) {
                appendMovie(movie, mainElement)
            }
        } else {
            mainElement.append(`Daten konnten nicht geladen werden, Status ${xhr.status} - ${xhr.statusText}`);
        }
    }

    const url = new URL("/movies", location.href)
    if (genre) {
        url.searchParams.set("genre", genre)
    }

    xhr.open("GET", url)
    xhr.send()
}

window.onload = function () {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const listElement = document.querySelector("nav>ul");

        if (xhr.status === 200) {
            /* Task 1.3. Add the genre buttons to the listElement and
               initialize them with a click handler that calls the
               loadMovies(...) function above. */
            const genres = JSON.parse(xhr.responseText);
            listElement.replaceChildren(createGenreButton("All movies", ""))

            for (const genre of genres) {
                listElement.append(createGenreButton(genre, genre))
            }

            /* When a first button exists, we click it to load all movies. */
            const firstButton = document.querySelector("nav button");
            if (firstButton) {
                firstButton.click();
            }
        } else {
            document.querySelector("body").append(`Daten konnten nicht geladen werden, Status ${xhr.status} - ${xhr.statusText}`);
        }
    };
    xhr.open("GET", "/genres");
    xhr.send();
};
