const allPlayersTBody = document.querySelector("#allPlayers tbody")
const searchPlayer = document.getElementById("searchPlayer")
const btnAdd = document.getElementById("btnAdd")
const closeDialog = document.getElementById("closeDialog")
const playersName = document.getElementById("playerName")
const jersey = document.getElementById("jersey")
const position = document.getElementById("position")
const error = document.getElementById("player-name-error")

const tbody = document.getElementById("tbody")
const allSortLinks = document.getElementsByClassName('bi')
const pager = document.getElementById('pager')
const pageNo = document.getElementById('pageNo')

let currentSortCol = ""
let currentSortOrder = ""
let currentQ = ""
let currentPageNo = 1
let currentPageSize = 10
let players = []
function Player(id, name, jersey, position) {
    this.id = id
    this.name = name
    this.jersey = jersey
    this.position = position
    this.visible = true
    this.matches = function (searchFor) {
        if (this.name.toLowerCase().includes(searchFor) ||
            this.position.toLowerCase().includes(searchFor) ||
            this.team.toLowerCase().includes(searchFor)) {
            return true;
        }
    }
}

const onClickPlayer = function (event) {
    const htmlElementetSomViHarKlickatPa = event.target
    const playerId = parseInt(htmlElementetSomViHarKlickatPa.dataset.stefansplayerid);
    const player = players.result.find(p => p.id == playerId)
    playerName.value = player.name
    jersey.value = player.jersey
    position.value = player.position
    editingPlayer = player
    MicroModal.show('modal-1');
}

pageNo.addEventListener("input", () => {
    currentPageNo = Number(pageNo.value)
    refresh()
})

Object.values(allSortLinks).forEach(link => {
    link.addEventListener("click", () => {
        currentSortCol = link.dataset.sortcol
        currentSortOrder = link.dataset.sortorder
        refresh()
    })
})

function debounce(cb, delay = 250) {
    let timeout

    return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            cb(...args)
        }, delay)
    }
}

const updateQuery = debounce(query => {
    currentQ = query
    refresh()
}, 500)

searchPlayer.addEventListener("input", (e) => {
    updateQuery(e.target.value)
})

function createPager(count, pageNo, currentPageSize) {
    pager.innerHTML = ""
    let totalPages = Math.ceil(count / currentPageSize)
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li')
        li.classList.add("page-item")
        if (i == pageNo) {
            li.classList.add("active")
        }
        const a = document.createElement('a')
        a.href = "#"
        a.innerText = i
        a.classList.add("page-link")
        li.appendChild(a)
        a.addEventListener("click", () => {

            currentPageNo = i
            refresh()
        })
        pager.appendChild(li)
    }
}

function createTd(data) {
    let element = document.createElement("td")
    element.innerText = data
    return element
}

async function refresh() {
    let offset = (currentPageNo - 1) * currentPageSize

    let url = `http://localhost:3000/api/players?sortCol=${currentSortCol}&sortOrder=${currentSortOrder}&limit=${currentPageSize}&offset=${offset}&q=${currentQ}`;

    const response = await fetch(url, {
        headers: {
            'Accept': 'application/json'
        }
    });

    players = await response.json()
    tbody.innerHTML = ""
    players.result.forEach(player => {
        const tr = document.createElement("tr")

        tr.appendChild(createTd(player.name))
        tr.appendChild(createTd(player.jersey))
        tr.appendChild(createTd(player.position))

        let td = document.createElement("td")
        let btn = document.createElement("button")
        btn.textContent = "EDIT"
        btn.dataset.stefansplayerid = player.id
        td.appendChild(btn)
        tr.appendChild(td)

        btn.addEventListener("click", onClickPlayer);
        tbody.appendChild(tr)
    })
    createPager(players.total, currentPageNo, currentPageSize)
}

await refresh()

async function fetchPlayers() {
    return await ((await fetch("http://localhost:3000/api/players")).json())
}

searchPlayer.addEventListener("input", function () {
    const searchFor = searchPlayer.value.toLowerCase()

    for (let i = 0; i < players.length; i++) {
        if (players[i].matches(searchFor)) {
            players[i].visible = true
        } else {
            players[i].visible = false
        }
    }
    refresh()

});

const createTableTdOrTh = function (elementType, innerText) {
    let element = document.createElement(elementType)
    element.textContent = innerText
    return element
}

let editingPlayer = null

closeDialog.addEventListener("click", async (ev) => {
    ev.preventDefault()
    let url = ""
    let method = ""
    let o = {
        "name": playersName.value,
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

    refresh()
    MicroModal.close('modal-1');
})

btnAdd.addEventListener("click", () => {
    playersName.value = ""
    jersey.value = 0
    position.value = ""
    editingPlayer = null
    MicroModal.show('modal-1');
})

MicroModal.init({
    onShow: modal => console.info(`${modal.id} is shown`),
    onClose: modal => console.info(`${modal.id} is hidden`),

    openTrigger: 'data-custom-open',
    closeTrigger: 'data-custom-close',
    openClass: 'is-open',
    disableScroll: true,
    disableFocus: false,
    awaitOpenAnimation: false,
    awaitCloseAnimation: false,
    debugMode: true
});

playersName.addEventListener("input", () => {
    if (validator.isAlphanumeric(playersName.value, 'sv-SE') && validator.isLength(playersName.value, { min: 3, max: 25 })) {
        error.style.display = "none";
    } else {
        error.style.display = "block";
    }
})




