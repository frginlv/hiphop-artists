document.addEventListener("DOMContentLoaded", () => {
  fetch("sources/data/artists.json")
    .then(response => response.json())
    .then(artists => {
      const artistList = document.getElementById("artists-list");
      if (!artistList) return;

      artists.forEach(artist => {
        const card = document.createElement("div");
        card.classList.add("artists-card");
        card.innerHTML = `
          ${artist.image ? `<img src="${artist.image}" alt="${artist.name}">` : ""}
          <h3>${artist.name}</h3>
          ${artist.genre ? `<p class="genre">${artist.genre}</p>` : ""}
          ${artist.bio ? `<p class="bio">${artist.bio}</p>` : ""}
          <div class="links">
              ${artist.spotify ? `<a href="${artist.spotify}" target="_blank">Spotify</a>` : ""}
          </div>
        `;

        card.addEventListener("click", () => {
          localStorage.setItem("selectedArtist", artist.name);
          window.location.href = "artists/artist.html";
        });


        artistList.appendChild(card);
      });
    })
    .catch(err => console.error("Error loading artists:", err));

  // Search bar
  const search = document.getElementById("search");
  if (search) {
    search.addEventListener("input", () => {
      const term = search.value.toLowerCase();
      const cards = document.querySelectorAll(".artists-card");
      cards.forEach(card => {
        const name = card.querySelector("h3").textContent.toLowerCase();
        card.style.display = name.includes(term) ? "block" : "none";
      });
    });
  }

});
