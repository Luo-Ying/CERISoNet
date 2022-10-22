/**importer middleware dotenv pour que l'application puisse récupérer les infos de la fichier .env */
require('dotenv').config()

/**définit le middleware permettant de parser les données envoyées par la méthode post */
const express = require('express')
const path = require('path')
const pgClient = require('pg')

const bodyParser = require('body-parser')
const https = require('https')
const fs = require('fs')    /**définit module fs (gestion des fichiers) */
const crypto = require('crypto')

const { response } = require('express')
const session = require('express-session')
/**définit le middleware connect-mongodb-session pour gérer le stockage des
informations de sessions gérées par express-session */
const MongoDBStore = require('connect-mongodb-session')(session)

const cors = require('cors')

const app = express();

app.use(cors())
app.use(express.urlencoded())
app.use(express.json())

const secret_sessionMongoDB = process.env.DBMONGO_SESSION_SECRET
const storURI_sessionMongoDB = process.env.DBMONGO_SESSION_STORE_URI
const storeCollection_sessionMongoDB = process.env.DBMONGO_SESSION_STORE_COLLECTION

app.use(session({   /** charge le middleware express-session dans la pile */
    secret: secret_sessionMongoDB,
    saveUninitialized: false,   /**Session créée uniquement à la première sauvegarde de données */
    resave: false,  /** pas de session sauvegardée si pas de modif */
    store: new MongoDBStore({   /**instance de connect-mongodb-session */
        uri: storURI_sessionMongoDB,    /**BD dans MongoDb */
        collection: storeCollection_sessionMongoDB,/**nom collection dans MongoDb */
        touchAfter: 24 * 3600   /** 1 sauvegarde toutes les 24h hormis si données MAJ */
    }),
    cookie: { maxAge: 24 * 3600 * 1000 }    /**millisecond valeur par défaut */
}))

/**Charge le middleware bodyParser dans la pile pour lire les données au format HTML (&, =, %) */
app.use(bodyParser.urlencoded({ extended: true }))

const options = {
    key: fs.readFileSync('key.pem'),    /**lecture clé privée et certificat */
    cert: fs.readFileSync('cert.pem')
}

/**lancement du serveur https avec clé et certificat associé */
let server = https.createServer(options, app).listen(3231, () => {
    console.log('HTTPS => listening on 3231')
})

/**Route racine('/') du server */
app.get('/', (req, res) => {
    console.log('listening on 3231')
    // res.sendFile(path.join(__dirname, './index.htm'))   /**Renvoyer la fichier ./index.htm */
    res.send({ "text": "coucou" })
})

/**Récupérer les infos de compte dans le fichier .env pour connecter db psql */
const user_dbpsql = process.env.DBPSQL_USER
const password_dbpsql = process.env.DBPSQL_PASSWORD
const database_dbpsql = process.env.DBPSQL_DATABASE
const host_dbpsql = process.env.DBPSQL_HOST
const port_dbpsql = process.env.DBPSQL_PORT

/**Route '/login' */
app.post('/login', (req, res) => {
    console.log(req.body);
    const shacode = crypto.createHash('sha1')
    const username = req.body.username
    /**Chiffrer mot de passe en sha1 */
    shacode.update(req.body.password)
    const password = shacode.digest('hex')
    /**vérification des informations de login auprès de la base postgresql */
    const sql = `SELECT * FROM fredouil.users where identifiant='${username}';`
    /**instance de connexion avec toutes les informations de la BD */
    let pool = new pgClient.Pool({
        user: user_dbpsql,
        host: host_dbpsql,
        database: database_dbpsql,
        password: password_dbpsql,
        port: port_dbpsql
    });
    let responseData = {}
    /**
     * Connexion à la base => objet de connexion : client
     * fonctionne également en promesse avec then et catch ! */
    pool.connect((err, client, done) => {
        if (err) { console.log(`Error connecting to pg server ${err.stack}`) }
        else {
            console.log('Connection established with pg db server')
            /**Exécution de la requête SQL et traitement du résultat */
            client.query(sql, (err, result) => {
                if (err) {
                    responseData.status = 204
                    console.log('Erreur d\'exécution de la requete' + err.stack)
                    responseData.statusMsg = 'Connexion échouée'
                }
                /**requête réussie => traitement du résultat stocké dans l’objet result */
                else if ((result.rows[0] !== null) && (result.rows[0].motpasse === password)) {
                    req.session.isConnected = true
                    responseData.status = 200
                    responseData.data = result.rows[0].nom
                    responseData.statusMsg = `connexion réussie : bonjour ${result.rows[0].prenom}`
                }
                else {
                    responseData.status = 204
                    responseData.statusMsg = 'Connexion échouée : informations de connexion incorrecte';
                }
                console.log(responseData)
                res.send(responseData)  /** renvoi du résultat (ou des messages d’erreur) */
                console.log("ok");
            })
            client.release()    /**connexion libérée */
        }

    })
})