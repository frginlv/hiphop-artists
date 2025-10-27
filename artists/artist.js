console.log("artist.js loaded");

document.addEventListener("DOMContentLoaded", async () => {
  const artists = await fetch("../sources/data/artists.json").then(r => r.json());
  const selectedName = localStorage.getItem("selectedArtist");
  const artist = artists.find(a => a.name === selectedName);

  if (!artist) {
    console.error("Artist not found!");
    return;
  }

  const nameEl = document.getElementById("artist-name");
  const coverEl = document.getElementById("artist-cover");
  const bioEl = document.getElementById("artist-bio");
  const genreEl = document.getElementById("artist-genre");
  const albumsList = document.getElementById("albums-list");
  const songsList = document.getElementById("songs-list");
  const playlist = document.getElementById("playlist");
  const favoriteAlbumEl = document.getElementById("favorite-album");

  const vinylArtistEl = document.getElementById("vinyl-artist");
  const vinylSongEl = document.getElementById("vinyl-song");

  if (vinylArtistEl) vinylArtistEl.textContent = "";
  if (vinylSongEl) vinylSongEl.textContent = "No song playing";

  nameEl.textContent = artist.name;
  coverEl.src = artist.image;
  bioEl.textContent = artist.bio;
  genreEl.textContent = artist.genre;

  let allsongs = [];

  artist.albums.forEach(album => {
    album.songs.forEach(song => {
      song.albumCover = album.cover;
      allsongs.push(song);

      const songDiv = document.createElement("div");
      songDiv.className = "song";
      songDiv.textContent = song.title;
      songsList.appendChild(songDiv);

      songDiv.addEventListener("click", () => {
        const index = allsongs.indexOf(song);
        playsong(index);
      });
    });

    // Favorite album
    if (favoriteAlbumEl && !favoriteAlbumEl.hasChildNodes()) {
      const img = document.createElement("img");
      img.src = album.cover;
      img.alt = album.title;
      favoriteAlbumEl.appendChild(img);
    }
  });

  const vinyl = document.getElementById("vinyl");
  const player = document.getElementById("vinyl-player");
  const closebutton = document.getElementById("close-button");
  const playbutton = document.getElementById("play-button");
  const music = document.getElementById("audio-player");

  if (vinyl && player && closebutton && music) {
    vinyl.addEventListener("click", () => {
      player.classList.add("active");
      document.body.classList.add("show-overlay");
    });
    closebutton.addEventListener("click", () => {
      player.classList.remove("active");
      document.body.classList.remove("show-overlay");
    });
  }

  const audio = document.getElementById("audio-player");
  const canvas = document.getElementById("visualizer");
  const ctx = canvas.getContext("2d");
  
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioCtx.createMediaElementSource(audio);
  const analyser = audioCtx.createAnalyser();
  
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  
  let hue = 0;

  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    
    ctx.fillStyle = 'rgba(10, 10, 10, 0.26)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      const barheight = dataArray[i] * 1.1;
      const color = `hsl(${(hue + i * 6) % 360}, 100%,55%)`;
      ctx.fillStyle = color;
      ctx.shadowBlur = 18;
      ctx.shadowColor = color;
      ctx.beginPath();
      ctx.roundRect(x,canvas.height - barheight, barWidth,barheight,8);
      ctx.fill();
      
      x += barWidth+1;
    }
    hue += 0.4;
  }
  audio.addEventListener("play", () => {
    if (audioCtx.state === "suspend") audioCtx.resume();
    draw();
  });

  const backbutton = document.getElementById("back-button");
  if (backbutton) backbutton.addEventListener("click", () => window.location.href = "../index.html");

  playbutton.addEventListener('click', () => {
    if (music.paused) {
      music.play();
      vinyl.classList.add('spinning');
      playbutton.textContent = "⏸";
    } else {
      music.pause();
      vinyl.classList.remove('spinning');
      playbutton.textContent = "▶️";
    }
  });

  const nextbutton = document.getElementById("next-button");
  const prevbutton = document.getElementById("previous-button");
  const shufflebutton = document.getElementById("shuffle-button");

  let currentsongindex = 0;

  function playsong(index) {
    currentsongindex = index;
    const song = allsongs[index];
    music.src = song.file;
    music.play();
    playbutton.textContent = "⏸";
    vinyl.src = song.albumCover;
    if (vinylArtistEl) vinylArtistEl.textContent = artist.name;
    if (vinylSongEl) vinylSongEl.textContent = song.title;
  }

  nextbutton.addEventListener("click", () => {
    currentsongindex = (currentsongindex + 1) % allsongs.length;
    playsong(currentsongindex);
  });

  prevbutton.addEventListener("click", () => {
    currentsongindex = (currentsongindex - 1 + allsongs.length) % allsongs.length;
    playsong(currentsongindex);
  });

  shufflebutton.addEventListener("click", () => {
    currentsongindex = Math.floor(Math.random() * allsongs.length);
    playsong(currentsongindex);
  });
  
// poster feature 
  document.getElementById("poster").addEventListener("click", () => {
    createposter(artist);
  })

  function createposter(artist) {
    const poster = document.createElement("div");
    poster.id = "poster-layout";
    poster.style.position = "fixed";
    poster.style.left = "-9999px";
    poster.style.width = "1200px";
    poster.style.height = "1600px";
    poster.style.fontFamily = "'Industrial Sans',sans-serif";
    poster.style.display = "flex";
    poster.style.flexDirection = "column";
    poster.style.alignItems = "center";
    poster.style.background = "#FFDDA0";
    poster.style.color = "#000000";
    poster.style.padding = "50px";
    poster.style.boxShadow = "border-box";
//adding album cover
    const albumImg = document.createElement("img");
    albumImg.src = artist.albums[0].cover; 
    albumImg.style.width = "1000px";
    albumImg.style.height = "1000px";
    albumImg.style.objectFit = "cover";
    albumImg.style.borderRadius = "15px"; 
    albumImg.style.border = "5px solid #c68642";
    albumImg.style.marginBottom = "30px";
    albumImg.style.boxShadow = "0 10px 30px rgba(0,0,0,05)";

    poster.appendChild(albumImg);  
//horizontal line
    const line1 = document.createElement("hr");
    line1.style.width = "80%";
    line1.style.margin = "30px 0";
    line1.style.border = "2px solid #000";
    poster.appendChild(line1);   
//tracklist
  const trackContainer = document.createElement("div");
    trackContainer.style.display = "grid";
    trackContainer.style.gridTemplateColumns = "repeat(auto-fill, minmax(200px, 1fr))";
    trackContainer.style.gap = "5px";
    trackContainer.style.width = "80%";       
  
    const songs = artist.albums[0].songs;
    songs.forEach((song, index) => {
    const track = document.createElement("p");
    track.textContent = `${index + 1}. ${song.title}`;
    track.style.margin = "3px";
    track.style.fontSize = "25px";
    track.style.opacity = "0.9";
    track.style.fontFamily = "'Industrial Sans', sans-serif"; 
    track.style.fontWeight = "600"; 
    track.style.textShadow = "1px 1px 3px rgba(0,0,0,0.5)"; 
    trackContainer.appendChild(track);
  });
    poster.appendChild(trackContainer);

  //Horizontal line
    const line2 = document.createElement("hr");
    line2.style.width = "80%";
    line2.style.margin = "30px 0";
    line2.style.border = "2px solid #000";
    poster.appendChild(line2);

  //Artist name at bottom right
    const artistName = document.createElement("p");
    artistName.textContent = artist.name;
    artistName.style.alignSelf = "flex-end";
    artistName.style.fontSize = "20px";
    artistName.style.fontWeight = "bold";
    poster.appendChild(artistName);

    document.body.appendChild(poster);

//corner liness 
    const cornerline1 = document.createElement("div");
    cornerline1.style.position = "absolute";
    cornerline1.style.top = "20px";
    cornerline1.style.right = "20px";
    cornerline1.style.width = "50px"; //horizontal
    cornerline1.style.height = "4px";
    cornerline1.style.backgroundColor = "#b8860b";
    poster.appendChild(cornerline1);

        const cornerline2 = document.createElement("div");
    cornerline2.style.position = "absolute";
    cornerline2.style.top = "20px";
    cornerline2.style.right = "20px";
    cornerline2.style.width = "50px"; //vertical
    cornerline2.style.height = "120px";
    cornerline2.style.backgroundColor = "#b8860b";
    poster.appendChild(cornerline2);

//i'll use the html2canvas library//corner liness 
    html2canvas(poster, {
      scale: 4,
      backgroundColor: '#ffffff',
      logging: true,
    }).then(canvas => {
      const link = document.createElement("a");
      link.download = `${artist.name}_poster.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      document.body.removeChild(poster);
    });
  }



});
