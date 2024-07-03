let currentSong = new Audio();
let songs;
let currentFolder;
function secondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currentFolder = folder;
    let a = await fetch(`${folder}/`);

    let response = await a.text()

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }

    }

    //play the first song



    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];

    songUL.innerHTML = "";

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> 
        
                            <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Shardul</div>
                            </div>
                            <div class="playnow">
                                <span>Play now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div> </li>`;

    }

    //attach an event listener to each song

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(element => {

        element.addEventListener("click", e => {
            console.log(element.querySelector(".info").firstElementChild.innerHTML)

            playMusic(element.querySelector(".info").firstElementChild.innerHTML.trim());

        });


    });

return songs;



}

const playMusic = ((track, pause = false) => {
    // let audio = new Audio("/songs/" + track)

    currentSong.src = `/${currentFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

})

async function displayAlbums() {
    let a = await fetch(`songs/`);

    let response = await a.text()

    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");
    let array = Array.from(anchors)

    for (let index = 0; index < array.length; index++) {
        const e = array[index];



        if (e.href.includes("/songs/")) {

            let folder = e.href.split("/").slice(-1)[0];
            let a = await fetch(`songs/${folder}/info.json`);

            let response = await a.json()
            cardContainer.innerHTML = cardContainer.innerHTML + `  <div data-folder="${folder}" class="card ">

                        <div class="play">

                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                style="width: 24px; height: 24px; color: black;">
                                <path
                                    d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                    stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                            </svg>

                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${folder}</h2>
                        <p>${response.Description}</p>
                    </div>`
        }
    }



    //load the playlist when the card is clicked

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log(item.currentTarget.dataset);
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0])

        })
    })

    // console.log(anchors);

}
async function main() {






    //getting the list of all the songs
    await getSongs("songs/mysongs");

    playMusic(songs[0], true)

    //display all the albums on the page

    displayAlbums();





    //play the first song

    //attch event listener to play next and previous

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause();
            play.src = "img/play.svg"

        }
    })

    //listen for the time update event

    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutes(currentSong.currentTime)}/ ${secondsToMinutes(currentSong.duration)}`
        document.querySelector(".circle").style.left = currentSong.currentTime / currentSong.duration * 100 + "%";
    })

    //add an event listener to seekbar

    document.querySelector(".seekbar").addEventListener("click", e => {
        // console.log(e.target.getBoundingClientRect());
        document.querySelector(".circle").style.left = e.offsetX / e.target.getBoundingClientRect().width * 100 + "%";
        let percent = e.offsetX / e.target.getBoundingClientRect().width * 100;

        currentSong.currentTime = currentSong.duration * percent / 100;
    })

    //add an event listener for the hamburger

    document.querySelector(".hamburger").addEventListener("click", e => {
        document.querySelector(".left").style.left = 0;
    })

    document.querySelector(".close").addEventListener("click", e => {
        document.querySelector(".left").style.left = "-120%";
    })

    //add an event listener to previous and next
    next.addEventListener("click", e => {
        // console.log("next");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        // console.log(index);
        // console.log(songs);
        currentSong.pause();
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])

        }



    })

    previous.addEventListener("click", e => {
        // console.log("pre");

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        currentSong.pause();
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])

        }


    })


    //add an event to volume

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", e => {
        // console.log(e.target.value);
        currentSong.volume = parseInt(e.target.value) / 100;
    })

    //add event listener to mute the track

    document.querySelector(".volume > img").addEventListener("click", e=>{
        // console.log(e.target);
        if(e.target.src.includes("img/volume.svg"))
            {
                e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg");
                currentSong.volume - 0;
                document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
            }
        else{
            e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg");
                currentSong.volume - 0;
            currentSong.volume = 0.5;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 30;
        }
    })



}

main();
