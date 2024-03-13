
const allPlayersTBody = document.querySelector("#allPlayers tbody")
const searchPlayer = document.getElementById("searchPlayer")
const btnAdd = document.getElementById("btnAdd")
const closeDialog = document.getElementById("closeDialog")
const playersName = document.getElementById("playerName")
const error = document.getElementById("player-name-error")


function Player(id, name, jersey, team, position) {
    this.id = id
    this.name = name
    this.jersey = jersey
    this.team = team
    this.position = position
    this.visible = true
    this.matches = function (searchFor) {
        if (this.name.toLowerCase().includes(searchFor) ||
            this.position.toLowerCase().includes(searchFor) ||
            this.team.toLowerCase().includes(searchFor)){
                return true;
            }
    }
}

async function fetchPlayers() {
    return await ((await fetch('http://localhost:3000/api/players')).json())
}

let players = await fetchPlayers()

searchPlayer.addEventListener("input", function () {
    const searchFor = searchPlayer.value.toLowerCase()
    console.log(searchPlayer.value.toLowerCase());
    for (let i = 0; i < players.length; i++) { // TODO add a matches function
        if (players[i].matches(searchFor)) {
            players[i].visible = true
        } else {
            players[i].visible = false
        }
    }
    updateTable()

});


const createTableTdOrTh = function (elementType, innerText) {
    let element = document.createElement(elementType)
    element.textContent = innerText
    return element
}


const playerName = document.getElementById("playerName")
const jersey = document.getElementById("jersey")
const position = document.getElementById("position")

let editingPlayer = null

const onClickPlayer = function (event) {
    const htmlElementetSomViHarKlickatPa = event.target
    console.log(htmlElementetSomViHarKlickatPa.dataset.stefansplayerid)
    const playerId = parseInt(htmlElementetSomViHarKlickatPa.dataset.stefansplayerid);
    const player = players.find(p => p.id == playerId)
    playerName.value = player.name
    jersey.value = player.jersey
    position.value = player.position
    editingPlayer = player

    MicroModal.show('modal-1');

}

closeDialog.addEventListener("click", async (ev) => {
    ev.preventDefault()
    let url = ""
    let method = ""
    console.log(url)
    let o = {
        "name": playerName.value,
        "jersey": jersey.value,
        "position": position.value
    }

    if (editingPlayer != null) {
        o.id = editingPlayer.id;
        url = "http://localhost:3000/api/players/" + o.id
        method = "PUT"
    } else {
        url = "http://localhost:3000/api/players"
        method = "POST"
    }

    let response = await fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: method,
        body: JSON.stringify(o)
    })
    console.log(response);

    // let json = await response.json()
    players = await fetchPlayers()
    updateTable()
    MicroModal.close('modal-1');
})

btnAdd.addEventListener("click", () => {
    playerName.value = ""
    jersey.value = 0
    position.value = ""
    editingPlayer = null

    MicroModal.show('modal-1');

})


const updateTable = function () {
    // while(allPlayersTBody.firstChild)
    //     allPlayersTBody.firstChild.remove()
    allPlayersTBody.innerHTML = ""

    // först ta bort alla children
    for (let i = 0; i < players.length; i++) { // hrmmm you do foreach if you'd like, much nicer! 
        if (players[i].visible == false) {
            continue
        }
        let tr = document.createElement("tr")

        tr.appendChild(createTableTdOrTh("th", players[i].name))
        tr.appendChild(createTableTdOrTh("td", players[i].jersey))
        tr.appendChild(createTableTdOrTh("td", players[i].position))
        tr.appendChild(createTableTdOrTh("td", players[i].team))

        let td = document.createElement("td")
        let btn = document.createElement("button")
        btn.textContent = "EDIT"
        btn.dataset.stefansplayerid = players[i].id
        td.appendChild(btn)
        tr.appendChild(td)


        btn.addEventListener("click", onClickPlayer);

        // btn.addEventListener("click",function(){
        //       alert(players[i].name)  
        //       //                      detta funkar fast med sk closures = magi vg
        // })


        allPlayersTBody.appendChild(tr)
    }

    // innerHTML och backticks `
    // Problem - aldrig bra att bygga strängar som innehåller/kan innehålla html
    //    injection
    // for(let i = 0; i < players.length;i++) { // hrmmm you do foreach if you'd like, much nicer! 
    //                                         // I will show you in two weeks
    //                                         //  or for p of players     
    //     let trText = `<tr><th scope="row">${players[i].name}</th><td>${players[i].jersey}</td><td>${players[i].position}</td><td>${players[i].team}</td></tr>`
    //     allPlayersTBody.innerHTML += trText
    // }
    // createElement
}


updateTable()



MicroModal.init({
    onShow: modal => console.info(`${modal.id} is shown`), // [1]
    onClose: modal => console.info(`${modal.id} is hidden`), // [2]

    openTrigger: 'data-custom-open', // [3]
    closeTrigger: 'data-custom-close', // [4]
    openClass: 'is-open', // [5]
    disableScroll: true, // [6]
    disableFocus: false, // [7]
    awaitOpenAnimation: false, // [8]
    awaitCloseAnimation: false, // [9]
    debugMode: true // [10]
});

playersName.addEventListener("input",()=>{
    if(validator.isAlphanumeric(playersName.value, 'sv-SE') && validator.isLength(playersName.value, {min:3, max:25})){
        error.style.display="none";
    }else{
        error.style.display="block";
    }
    })



