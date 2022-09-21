/**définit le middleware permettant de parser les données envoyées par la méthode post */
const express = require('express')
const path = require('path')
const pgClient = require('pg')

const bodyParser = require('body-parser')
const https = require('https')
const fs = require('fs')    // définit module fs (gestion des fichiers)

const app = express();

/**Charge le middleware bodyParser dans la pile pour lire les données au format HTML (&, =, %) */
app.use(bodyParser.urlencoded({ extended: true }))

const options = {
    key: fs.readFileSync('key.pem'),    // lecture clé privée et certificat
    cert: fs.readFileSync('cert.pem')
}

/**lancement du serveur https avec clé et certificat associé */
let server = https.createServer(options, app).listen(3231, () => {
    console.log('HTTPS => listening on 3231')
})

/**Route racine('/') du server */
app.get('/', (req, res) => {
    console.log('listening on 3231')
    res.sendFile(path.join(__dirname, './index.htm'))   // Renvoyer la fichier ./index.htm
})

/**Route '/login' */
app.post('/login', (req, res) => {
    console.log("username: ", req.body.username)
    console.log("password: ", req.body.password)
    res.send("Hello World!")
})