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
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    
    let response = await a.text()

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    let songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }

    }

    return songs;

}

const playMusic = ((track, pause = false) => {
    // let audio = new Audio("/songs/" + track)

    currentSong.src = `/${currentFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

})
async function main() {






    //getting the list of all the songs
    songs = await getSongs("songs/mysongs");

    playMusic(songs[0], true)

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> 
        
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Shardul</div>
                            </div>
                            <div class="playnow">
                                <span>Play now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div> </li>`;

    }

    //attach an event listener to each song

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(element => {

        element.addEventListener("click", e => {
            console.log(element.querySelector(".info").firstElementChild.innerHTML)

            playMusic(element.querySelector(".info").firstElementChild.innerHTML.trim());

        });


    });



    //play the first song

    //attch event listener to play next and previous

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause();
            play.src = "play.svg"

        }
    })

    //listen for the time update event

    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutes(currentSong.currentTime)}/ ${secondsToMinutes(currentSong.duration)}`
        document.querySelector(".circle").style.left = currentSong.currentTime / currentSong.duration * 100 + "%";
    })

    //add an event listener to seekbar

    document.querySelector(".seekbar").addEventListener("click", e=>{
        // console.log(e.target.getBoundingClientRect());
        document.querySelector(".circle").style.left = e.offsetX / e.target.getBoundingClientRect().width * 100 + "%";
        let percent = e.offsetX / e.target.getBoundingClientRect().width * 100;
         
        currentSong.currentTime = currentSong.duration * percent / 100;
    })

//add an event listener for the hamburger

document.querySelector(".hamburger").addEventListener("click", e=>{
    document.querySelector(".left").style.left = 0;
})

document.querySelector(".close").addEventListener("click", e=>{
    document.querySelector(".left").style.left = "-120%";
})

//add an event listener to previous and next
next.addEventListener("click", e=>{
    // console.log("next");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    // console.log(index);
    // console.log(songs);
    currentSong.pause();
    if((index+1) < songs.length)
        {
            playMusic(songs[index+1])

        }
    
    
    
})

previous.addEventListener("click", e=>{
    // console.log("pre");

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    currentSong.pause();
    if((index-1) >= 0)
        {
            playMusic(songs[index-1])

        }
   

})


//add an event to volume

document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", e=>{
    // console.log(e.target.value);
    currentSong.volume = parseInt(e.target.value) / 100;
})


//load the playlist when the card is clicked

Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click", async item=>{
        console.log(item.currentTarget.dataset);
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);

         
    })
})

}

main();
