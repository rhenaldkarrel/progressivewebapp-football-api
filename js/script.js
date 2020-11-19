document.addEventListener('DOMContentLoaded', async function () {
    loadNav()
    route()
})

// * home page
async function klasemen() {
    const tbody = document.querySelector('tbody')
    let rowTable = ''
    const data = await getKlasemen()
    await data.standings[0].table.forEach(dTeam => {
        rowTable += `<tr>
                <td>${dTeam.position}</td>
                    <td><a href="#team?id=${dTeam.team.id}" class="link-to-team valign-wrapper"><img src="${dTeam.team.crestUrl.replace(/^http:\/\//i, 'https://')}"class="responsive-img cres" alt=""> ${dTeam.team.name}</a> </td>
                    <td>${dTeam.playedGames}</td><td>${dTeam.won}</td><td>${dTeam.draw}</td><td>${dTeam.lost}</td><td>${dTeam.goalsFor}</td><td>${dTeam.goalsAgainst}</td><td>${dTeam.goalDifference}</td><td>${dTeam.points}</td>
                </tr>`
    })
    tbody.innerHTML = rowTable

    document.querySelectorAll('.link-to-team').forEach(link => {
        link.addEventListener('click', async click => {
            route(click.target.getAttribute('href'))
        })
    })
}

// * team page
async function displayTeam(id) {
    const data = await getTeam(id)
    const matchdata = await getMatchTeam(id)

    let squadLeft = '',
        squadRight = '',
        league = '',
        match = ''

    data.activeCompetitions.forEach(v => {
        league += `<a href="">${v.name}</a> ,`
    })
    data.squad.forEach((v, i) => {
        if (i < (data.squad.length / 2)) {
            squadLeft += `
                    <li>
                    <div class="collapsible-header">${v.name}</div>
                    <div class="collapsible-body p-0">
                        <ul class="collection">
                            <li class="collection-item">Position : ${v.position}</li>
                            <li class="collection-item">Date of birth : ${v.dateOfBirth}</li>
                            <li class="collection-item">Country of birth : ${v.countryOfBirth}</li>
                            <li class="collection-item">Nationality : ${v.nationality}</li>
                            <li class="collection-item">Shirt number : ${v.shirtNumber == null ? 'none' : v.shirtNumber}</li>
                            <li class="collection-item">Role : ${(v.role).toLowerCase()}</li>
                        </ul>
                    </div>
                </li>
                    `
        } else {
            squadRight += `
                    <li>
                    <div class="collapsible-header">${v.name}</div>
                    <div class="collapsible-body p-0">
                        <ul class="collection">
                            <li class="collection-item">Position : ${v.position}</li>
                            <li class="collection-item">Date of birth : ${v.dateOfBirth}</li>
                            <li class="collection-item">Country of birth : ${v.countryOfBirth}</li>
                            <li class="collection-item">Nationality : ${v.nationality}</li>
                            <li class="collection-item">Shirt number : ${v.shirtNumber == null ? 'none' : v.shirtNumber}</li>
                            <li class="collection-item">Role : ${(v.role).toLowerCase()}</li>
                        </ul>
                    </div>
                </li>
                    `
        }
    })
    matchdata.matches.forEach(v => {
        match += `
        <li class="collection-item">
        <div class="row">
            <div class="col s12 m12 l12 justify-center">
                <p class=" text-darken-3">${new Date(v.utcDate).toLocaleDateString('en-ID',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
        </div>
        <div class="row mb-0">
            <div class="col s5 m5 l5">
                <h5>Home</h5> 
                <a href="#team?id=${v.homeTeam.id}">${v.homeTeam.name}</a> 
            </div>
            <div class="col s2 m2 l2">
                <h3>VS</h3>
            </div>
            <div class="col s5 m5 l5">
                <h5>Away</h5> 
                <a href="#team?id=${v.awayTeam.id}">${v.awayTeam.name}</a>   
            </div>
        </div>
    </li>
    `
    })

    loadPage('team').then(function () {
        initCollapsable()

        let dataFav = {
            id: data.id,
            name: data.name,
            address: data.address,
            phone: data.phone,
            website: data.website,
            founded: data.founded,
            clubColors: data.clubColors,
            vanue: data.vanue,
            crestUrl: data.crestUrl,
            league,
            squadLeft,
            squadRight,
            match,
        }

        document.querySelector('#league').innerHTML = `liga : ${league}`
        document.querySelector('.team-name b').innerHTML = data.name
        document.querySelector('#squadLeft').innerHTML = squadLeft
        document.querySelector('#squadRight').innerHTML = squadRight

        document.querySelector('#information').innerHTML = `
            <p class="collection-item">Address : ${data.address}</p>
            <p class="collection-item">Phone : ${data.phone}</p>
            <p class="collection-item">Website : <a href="${data.website}" target="_blank">${data.website}</a></p>
            <p class="collection-item">Email : ${data.email}</p>
            <p class="collection-item">Founded : ${data.founded}</p>
            <p class="collection-item">Club colors : ${data.clubColors}</p>
            <p class="collection-item">Venue : ${data.vanue}</p>
        `
        crestImage = document.querySelector('.team-wraper-top img')
        crestImage.setAttribute('src', data.crestUrl.replace(/^http:\/\//i, 'https://'))
        crestImage.setAttribute('alt', data.name)

        document.querySelector('#upCommingTeamMatch').innerHTML = match

        document.querySelectorAll('#upCommingTeamMatch a').forEach(link => {
            link.addEventListener('click', click => {
                route(click.target.getAttribute('href'))
            })
        })

        const showMore = document.querySelector('#matchByTeam')
        showMore.setAttribute('href', `#match?teamId=${id}`)
        showMore.addEventListener('click', function (v) {
            route(v.target.getAttribute('href'))
        })

        checkFav(data.id)
        const teamFavButton = document.querySelector('.fav-btn')
        teamFavButton.addEventListener('click', click => {
            click.preventDefault()
            checkFav(data.id, true)
        })


        function checkFav(id, event = false) {
            isFav(id).then(v => {
                if (v) {
                    teamFavButton.style.backgroundColor = '#a20a0a'
                    if (event) {
                        M.toast({html: data.name+' removed from favorites'})
                        deleteTeamFav(id);
                        teamFavButton.style.backgroundColor = '#a20a0a'
                        teamFavButton.innerHTML = '<i class="large material-icons">favorite</i>'
                    }
                } else {
                    teamFavButton.style.backgroundColor = '#a20a0a'

                    if (event) {
                        M.toast({html: data.name + ' added to favorite'})
                        addTeamFav(dataFav);
                        teamFavButton.style.backgroundColor = '#a20a0a'
                        teamFavButton.innerHTML = '<i class="large material-icons">delete</i>'
                    }
                }
            })
        }
    })
}

// * match page 
async function displayMatch(id = null) {
    const data = await getMatch(id)
    let match = ''

    data.matches.forEach(v => {
        match += `
        <div class="col s12 m6 l6">
        <div class="card horizontal d-flex f-width-100 align-item-center">
            <div class="card-content">
            <div class="row">
            <div class="col s12 m12 l12 justify-center">
                <p class=" text-darken-3">${new Date(v.utcDate).toLocaleDateString('en-ID',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
        </div>
        <div class="row mb-0">
            <div class="col s5 m5 l5">
                <h6>home</h6> 
                <a id="home-team-link" href="#team?id=${v.homeTeam.id}">${v.homeTeam.name}</a> 
            </div>
            <div class="col s2 m2 l2">
                <h5>VS</h5>
            </div>
            <div class="col s5 m5 l5">
                <h6>away</h6> 
                <a id="away-team-link" href="#team?id=${v.awayTeam.id}">${v.awayTeam.name}</a>   
            </div>
        </div>
            </div>
        </div>
    </div>
        `
    })

    loadPage('match').then(function () {
        document.querySelector('#match').innerHTML = match

        document.querySelectorAll('#home-team-link , #away-team-link').forEach(link => {
            link.addEventListener('click', click => {
                route(click.target.getAttribute('href'))
            })
        })
    })
}

// * page favorite team
function disolayFavTeam() {
    let data = ''

    getAllTeamFav().then(favs => {
        for (const f of favs) {
            data += `
                    <li class="collection-item left-align" id="unfav-id-${f.id}">
                    <div class="d-flex space-betwen align-item-center">
                        <a href="#team?id=${f.id}" class="left-align link-team">${f.name}</a>
                        <a href="#unfav-me" class="waves-effect waves-light btn red unfav" data-id="${f.id}">unfavorite</a>
                    </div>
                        </li>
                            `
            
        }
        if(favs.length == 0) data += '<h5 class="center-align red-text">Data team favorite kosong !</h5>'
    })

    
    loadPage('fav-team').then(function () {
        const ulTeamFav = document.querySelector('#ul-team-fav')
        ulTeamFav.innerHTML = data

        document.querySelectorAll('.unfav').forEach( btn => {
            btn.addEventListener('click',click => {
                click.preventDefault()
                deleteTeamFav(parseInt(click.target.getAttribute('data-id')))
                ulTeamFav.querySelector('#unfav-id-'+click.target.getAttribute('data-id')).style.display = 'none'
            })
        })

        ulTeamFav.querySelectorAll('.link-team').forEach( link => {
            link.addEventListener('click', click => {
                route(click.target.getAttribute('href'))
            })
        })
    })
    
}

const route = function (id = null) {
    parseUrl(id).then(url => {
        switch (url.page) {
            case 'team':
                displayTeam(url.query.id)
                break
            case 'match':
                if (url.query.teamId != undefined) {
                    displayMatch(url.query.teamId)
                } else {
                    displayMatch()
                }
                break
            case 'fav-team':
                disolayFavTeam()
                break
            default:
                loadPage(url.page).then(page => {
                    if (page == 'home') klasemen()
                })
                break
        }
    })
}
