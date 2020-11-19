const config = {
    url: 'https://api.football-data.org/v2',
    key: 'a6d9d49f35c244369601afb5d03f9ab5',
    liga_id: '2014',
    get endPoint() {
        return {
            url: this.url,
            klasemen: `${this.url}/competitions/${this.liga_id}/standings/`,
            tim: `${this.url}/teams/`,
            upComing: `${this.url}/competitions/${this.liga_id}/matches?status=SCHEDULED`,
            matchDetail: `${this.url}/matches`,
        }
    }
}

const {
    key,
    endPoint,
} = config

function fetchData(url) {
    return fetch(url, {
        method: "GET",
        headers: {
            'X-Auth-Token': key
        }
    })
}

async function getTeam(id) {
    try {
        if ('caches' in window) {
            let res = await caches.match(endPoint.tim + '/' + id)
            if (res !== undefined) {
                return await res.json()
            }
            throw 'err'
        }

    } catch (error) {
        try {
            const res = await fetchData(endPoint.tim + '/' + id)
            return await res.json()
        } catch (error) {
            console.log(error);
        }
    }
}

async function getKlasemen() {
    try {
        if ('caches' in window) {
            let res = await caches.match(endPoint.klasemen)
            return await res.json()
        }
    } catch (error) {
        try {
            const res = await fetchData(endPoint.klasemen)
            return await res.json()
        } catch (error) {
            console.log(error);
        }
    }


}

async function getMatchTeam(id, limit = 3) {
    try {
        if ('caches' in window) {
            let res = await caches.match(endPoint.url + `/teams/${id}/matches/?status=SCHEDULED${limit == 3 ? '&limit=3' : ''}`)
            return await res.json()
        }
    } catch (error) {
        try {
            const res = await fetchData(endPoint.url + `/teams/${id}/matches/?status=SCHEDULED${limit == 3 ? '&limit=3' : ''}`)
            return await res.json()
        } catch (error) {
            console.log(error);
        }
    }

}

async function getMatch(id) {
    if (id !== null) {
        return await getMatchTeam(id, false)
    } else {
        try {
            if ('caches' in window) {
                let res = await caches.match(endPoint.upComing)
                return await res.json()
            }
        } catch (error) {
            try {
                const res = await fetchData(endPoint.upComing)
                return await res.json()
            } catch (error) {
                console.log(error);
            }
        }
    }
}