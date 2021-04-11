
//REACT_APP_API_URI is an enviroment variable defined in the file .env.development or .env.production
async function updateCoords() {
    const apiEndPoint = process.env.REACT_APP_API_URI || 'http://127.0.0.1:5000'
    
    let response = await fetch(apiEndPoint + '/coords/update', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            "webId": "usuario2",
            "userSessionId": 0,
            "coords": {
                "long": 36.25,
                "lat": -5.5421564,
                "alt": 10
            }
        })
      })
    return await response
}

export function getFriendsCoords() {
    const apiEndPoint = process.env.REACT_APP_API_URI || 'http://127.0.0.1:5000'
    
    let response = fetch(apiEndPoint + '/coords/friends/list', {
        method: "GET",
        headers: {
            'Content-Type':'application/json',
            "webid": "usuario1",
            "usersessionid": 0
        }
    })
    return [{coords:{lon:43.29725392940575,lat:-5.68647905562985}}]
}