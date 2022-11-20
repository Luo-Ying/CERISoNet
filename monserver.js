/**importer middleware dotenv pour que l'application puisse récupérer les infos de la fichier .env */
require('dotenv').config()

/**définit le middleware permettant de parser les données envoyées par la méthode post */
const express = require('express')
const path = require('path')
const pgClient = require('pg') /**définit le middleware pg à charger */
const MongoClient = require('mongodb').MongoClient  /**définit le middleware mongodb à charger et crée l’instance MongoClient */

console.log(("b" + "a" + +"123154418a" + "a").toLocaleLowerCase())
console.log(+"a")

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
const server = https.createServer(options, app).listen(3231, () => {
    console.log('HTTPS => listening on 3231')
})

/**
 * 
 * 
 * 
 * 
 * 
 * 
 */

/** Gestion des websockets côté serveur */
const io = require('socket.io')(server, {
    cors: {
        origin: true,
    },
})

/** Gestion de la connection et des messages reçus de la part d'un client */
io.on('connection', socketClient => {
    /** Envoie d'un message à tous les client connectés */
    io.emit('notification', 'le serveur communique avec l\'ensemble des clients connectés')

    /** Envoie d'un message à tous les clients connectés excepté le client émetteur */
    socketClient.broadcast.emit('notification', 'le serveur communique avec l\'ensemble des clients connectés excepté l\'émetteur de l\'événement <<notification>>')

    /** Réception d'un message d'un client (event: 'messageClient', données: data) et renvoie d'une réponse */
    // socketClient.on('messageClient', data => {
    //     console.log('messageClient')
    //     socketClient.emit('messageClient', 'serveur => socketClient emettrice : demande bien reçue ' + data)
    // })

    /** Réception d'un message d'un clien(event: 'login', données: data) et renvoie d'une réponse */
    // socketClient.on('login', data => {
    //     socketClient.emit('login', 'serveur => socketClient emettrice : demande bien reçu ' + data)
    // })

    socketClient.on('updateLike', data => {
        const id_post = data.id_post;
        const id_user = data.id_user;
        const nbLike = data.nbLike;
        const isLiked = data.isLiked;
        /**Connexion MongoDB */
        MongoClient.connect(dsn_dbmongo, { useNewUrlParser: true, useUnifiedTopology: true }, (err, mongoClient) => {
            if (err) {
                return console.log('erreur connexion base de données');
            }
            if (mongoClient) {
                /**Exécution des requêtes - findAll*/
                mongoClient.db().collection('CERISoNet').updateOne({ "_id": id_post }, { $set: { "likes": nbLike } })
                if (isLiked) {
                    mongoClient.db().collection('CERISoNet').updateOne({ "_id": id_post }, { $addToSet: { "likedby": id_user } }, (err, data) => {

                        if (err) {
                            return console.log('erreur base de données')
                        }
                        if (data) {
                            mongoClient.db().collection('CERISoNet').findOne({ "_id": id_post }, (err, data) => {
                                if (err) {
                                    return console.log('erreur base de données')
                                }
                                if (data) {
                                    mongoClient.close() /**Fermeture de la connexion */
                                    io.emit('updateLike', data)
                                }
                            })
                        }
                    })
                } else {
                    mongoClient.db().collection('CERISoNet').updateOne({ "_id": id_post }, { $pull: { "likedby": id_user } }, (err, data) => {

                        if (err) {
                            return console.log('erreur base de données')
                        }
                        if (data) {
                            // mongoClient.close() /**Fermeture de la connexion */
                            mongoClient.db().collection('CERISoNet').findOne({ "_id": id_post }, (err, data) => {
                                if (err) {
                                    return console.log('erreur base de données')
                                }
                                if (data) {
                                    mongoClient.close() /**Fermeture de la connexion */
                                    io.emit('updateLike', data)
                                }
                            })
                            // socketClient.broadcast.emit('updateLike', data)
                        }
                    })
                }
            }
        })
    })

    socketClient.on('addComment', data => {
        const id_post = data.id_post
        const comment = data.comment;
        // console.log(typeof nbLike);
        console.log(comment.commentedBy);
        /**Connexion MongoDB */
        MongoClient.connect(dsn_dbmongo, { useNewUrlParser: true, useUnifiedTopology: true }, (err, mongoClient) => {
            if (err) {
                return console.log('erreur connexion base de données');
            }
            if (mongoClient) {
                const objComment = {
                    "text": comment.text,
                    "commentedBy": comment.commentedBy,
                    "date": comment.date,
                    "hour": comment.hour
                }
                /**Exécution des requêtes - findAll*/
                mongoClient.db().collection('CERISoNet').updateOne({ "_id": id_post }, { $addToSet: { "comments": objComment } }, (err, data) => {

                    if (err) {
                        return console.log('erreur base de données')
                    }
                    if (data) {
                        mongoClient.db().collection('CERISoNet').findOne({ "_id": id_post }, (err, data) => {
                            if (err) {
                                return console.log('erreur base de données')
                            }
                            if (data) {
                                mongoClient.close() /**Fermeture de la connexion */
                                // console.log("coucou");
                                io.emit('updateComments', data)
                            }
                        })
                    }
                })
            }
        })
    })

    socketClient.on('deleteComment', data => {
        const id_post = data.id_post
        const text = data.commentText;
        MongoClient.connect(dsn_dbmongo, { useNewUrlParser: true, useUnifiedTopology: true }, (err, mongoClient) => {
            if (err) {
                return console.log('erreur connexion base de données');
            }
            if (mongoClient) {
                /**Exécution des requêtes - findAll*/
                mongoClient.db().collection('CERISoNet').updateOne({ "_id": id_post }, { $pull: { "comments": { "text": text } } }, (err, data) => {

                    if (err) {
                        return console.log('erreur base de données')
                    }
                    if (data) {
                        mongoClient.db().collection('CERISoNet').findOne({ "_id": id_post }, (err, data) => {
                            if (err) {
                                return console.log('erreur base de données')
                            }
                            if (data) {
                                // console.log(data);
                                mongoClient.close() /**Fermeture de la connexion */
                                io.emit('updateComments', data)
                                // TODO: le socket brocast updateComments ne marche pas sur le page current mais il marche sur l'autre page de l'autre user
                            }
                        })
                    }
                })
            }
        })
    })

    socketClient.on('getMaxPostId', data => {
        MongoClient.connect(dsn_dbmongo, { useNewUrlParser: true, useUnifiedTopology: true }, (err, mongoClient) => {
            if (err) {
                return console.log('erreur connexion base de données');
            }
            if (mongoClient) {
                mongoClient.db().collection('CERISoNet').find().sort({ "_id": -1 }).toArray((err, data) => {
                    if (err) {
                        return console.log('erreur base de données')
                    }
                    if (data) {
                        socketClient.emit('sendMaxId', data)
                    }
                })
            }
        })

    })

    // TODO: 
    socketClient.on('sharePost', data => {
        // console.log(data);
        const objPost = data.objPost
        MongoClient.connect(dsn_dbmongo, { useNewUrlParser: true, useUnifiedTopology: true }, (err, mongoClient) => {
            if (err) {
                return console.log('erreur connexion base de données');
            }
            if (mongoClient) {
                // console.log("coucou??");
                //TODO: construire l'objet postToShared
                /**Exécution des requêtes - findAll*/
                console.log("data reçu du post:  ");
                console.log(objPost);
                const objSharePost = {
                    "_id": objPost._id,
                    "date": objPost.date,
                    "hour": objPost.hour,
                    "createdBy": objPost.createdBy,
                    "Shared": objPost.Shared,
                    "likes": objPost.likes,
                    "comments": []
                }
                console.log(objSharePost);
                mongoClient.db().collection('CERISoNet').insertOne(objSharePost, (err, data) => {
                    if (err) {
                        return console.log('erreur base de données')
                    }
                    if (data) {
                        mongoClient.db().collection('CERISoNet').find().project({}).toArray((err, data) => {
                            if (err) {
                                return console.log('erreur base de données')
                            }
                            if (data) {
                                mongoClient.close() /**Fermeture de la connexion */
                                io.broadcast.emit('updatePosts', data)
                            }
                        })
                    }
                })
            }
        })

    })

})

io.emit('notification', 'le serveur communique avec l\'ensemble des clients connectés')

/**
 * 
 * 
 * 
 * 
 */

/**Route racine('/') du server */
app.get('/', (req, res) => {
    console.log('listening on 3231')
    // res.sendFile(path.join(__dirname, './index.htm'))   /**Renvoyer la fichier ./index.htm */
    res.send({ "text": "coucou" })
})

/**Récupérer les valeur des paramètres obligés pour connecter les BDs */
const user_dbpsql = process.env.DBPSQL_USER
const password_dbpsql = process.env.DBPSQL_PASSWORD
const database_dbpsql = process.env.DBPSQL_DATABASE
const host_dbpsql = process.env.DBPSQL_HOST
const port_dbpsql = process.env.DBPSQL_PORT
const dsn_dbmongo = process.env.DSN_MONGODB

/**instance de connexion avec toutes les informations de la BD */
let pgClientPool = new pgClient.Pool({
    user: user_dbpsql,
    host: host_dbpsql,
    database: database_dbpsql,
    password: password_dbpsql,
    port: port_dbpsql
});

/**Route '/login' */
app.post('/login', (req, res) => {
    /**spécification du Data Source Name (DSN) de mongoDB => BD://host:port/db */
    let responseData = {}
    const shacode = crypto.createHash('sha1')
    const username = req.body.username
    /**Chiffrer mot de passe en sha1 */
    shacode.update(req.body.password)
    const password = shacode.digest('hex')
    /**vérification des informations de login auprès de la base postgresql */
    const sql_verify = `SELECT * FROM fredouil.users WHERE identifiant='${username}';`
    const sql_changeStatus = `UPDATE fredouil.users SET statut_connexion=1 WHERE identifiant='${username}';`
    /**
     * Connexion à la base => objet de connexion : client
     * fonctionne également en promesse avec then et catch ! */
    pgClientPool.connect((err, client, done) => {
        if (err) { console.log(`Error connecting to pg server ${err.stack}`) }
        else {
            console.log('Connection established with pg db server')
            /**Exécution de la requête SQL et traitement du résultat */
            client.query(sql_verify, (err, result) => {
                if (err) {
                    responseData.status = 204
                    responseData.statusMsg = 'Connexion échouée'
                }
                /**requête réussie => traitement du résultat stocké dans l’objet result */
                else if (result.rows[0] && (result.rows[0].motpasse === password)) {
                    client.query(sql_changeStatus, (e, rslt) => {
                        if (e) {
                            responseData.statusMsg = 'Une érreur du serveur est produit, veuillez réessayer plus tard.'
                        }
                    })
                    req.session.isConnected = true
                    responseData.status = 200
                    responseData.id = result.rows[0].id
                    responseData.lastName = result.rows[0].nom
                    responseData.firstName = result.rows[0].prenom
                    responseData.urlAvatar = result.rows[0].avatar
                    responseData.statusMsg = `connexion réussie : bonjour ${result.rows[0].prenom}`
                }
                else {
                    responseData.status = 204
                    responseData.statusMsg = 'Connexion échouée : informations de connexion incorrecte';
                }
                res.send(responseData)  /** renvoi du résultat (ou des messages d’erreur) */
            })
            client.release()    /**connexion libérée */
        }

    })
})

app.get('/disconnect', (req, res) => {
    /**spécification du Data Source Name (DSN) de mongoDB => BD://host:port/db */
    let responseData = {}
    const id = req.query.id
    console.log(id);
    const sql_changeStatus = `UPDATE fredouil.users SET statut_connexion=0 WHERE id='${id}';`
    pgClientPool.connect((err, client, done) => {
        if (err) { console.log(`Error connecting to pg server ${err.stack}`) }
        else {
            client.query(sql_changeStatus, (err, result) => {
                if (err) {
                    responseData.status = 204
                    responseData.statusMsg = 'Connexion échouée'
                }
                else {
                    req.session.isConnected = false
                    responseData.status = 200
                    responseData.statusMsg = `déonnexion réussie`
                }
                // console.log(result);
                // console.log(responseData);
                res.send(responseData)
            })
            client.release()
        }
    })
})

const getAllComments = (mongoClient, res) => {
    mongoClient.db().collection('CERISoNet').find().project({}).toArray((err, data) => {
        if (err) {
            return console.log('erreur base de données')
        }
        if (data) {
            mongoClient.close() /**Fermeture de la connexion */
            res.send(data) /**renvoi du résultat comme réponse de la requête */
        }
    })
}

const getCommentsFilterByHashtag = (mongoClient, hashtag, res) => {
    mongoClient.db().collection('CERISoNet').find({ "hashtags": hashtag }).project({}).toArray((err, data) => {
        if (err) {
            return console.log('erreur base de données')
        }
        if (data) {
            mongoClient.close() /**Fermeture de la connexion */
            res.send(data) /**renvoi du résultat comme réponse de la requête */
        }
    })
}

app.get('/db-CERI/CERISoNet', (req, res) => {
    const hashtag = decodeURI(req.query.hashtag);
    /**Connexion MongoDB */
    MongoClient.connect(dsn_dbmongo, { useNewUrlParser: true, useUnifiedTopology: true }, (err, mongoClient) => {
        if (err) {
            return console.log('erreur connexion base de données');
        }
        if (mongoClient) {
            /**Exécution des requêtes - findAll*/
            if (hashtag != "all") {
                getCommentsFilterByHashtag(mongoClient, hashtag, res);
            }
            else {
                getAllComments(mongoClient, res);
            }
        }
    })
})

app.get('/CERISoNet/comments/user', (req, res) => {
    /**spécification du Data Source Name (DSN) de mongoDB => BD://host:port/db */
    let responseData = {}
    const id = req.query.id
    const sql = `SELECT * FROM fredouil.users WHERE id='${id}';`
    pgClientPool.connect((err, client, done) => {
        if (err) { console.log(`Error connecting to pg server ${err.stack}`) }
        else {
            client.query(sql, (err, result) => {
                if (err) {
                    responseData.status = 204
                }
                else {
                    responseData.status = 200
                    if (result.rows[0]) {
                        responseData.identifiant = result.rows[0].identifiant
                        responseData.nom = result.rows[0].nom
                        responseData.prenom = result.rows[0].prenom
                        responseData.avatar = result.rows[0].avatar
                        responseData.status_connexion = result.rows[0].statut_connexion
                    }
                    else {
                        responseData.identifiant = id
                        responseData.nom = "personne inconnu"
                        responseData.prenom = "personne inconnu"
                        responseData.avatar = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        responseData.status_connexion = 0
                    }
                }
                res.send(responseData)
            })
            client.release()
        }
    })
})

app.get('/db-CERI/CERISoNet/searchPost', (req, res) => {
    const id = Number(req.query.id);
    // console.log(typeof id);
    /**Connexion MongoDB */
    MongoClient.connect(dsn_dbmongo, { useNewUrlParser: true, useUnifiedTopology: true }, (err, mongoClient) => {
        if (err) {
            return console.log('erreur connexion base de données');
        }
        if (mongoClient) {
            /**Exécution des requêtes - findOne*/
            mongoClient.db().collection('CERISoNet').findOne({ "_id": id }, (err, data) => {
                if (err) {
                    return console.log('erreur base de données')
                }
                if (data) {
                    mongoClient.close() /**Fermeture de la connexion */
                    res.send(data) /**renvoi du résultat comme réponse de la requête */
                }
            })
        }
    })
})

// app.post('/db-CERI/CERISoNet/deleteComment', (req, res) => {
//     const id_post = req.body.id_post
//     const text = req.body.commentText;
//     // console.log(typeof nbLike);
//     // console.log(comment.commentedBy);
//     /**Connexion MongoDB */
//     MongoClient.connect(dsn_dbmongo, { useNewUrlParser: true, useUnifiedTopology: true }, (err, mongoClient) => {
//         if (err) {
//             return console.log('erreur connexion base de données');
//         }
//         if (mongoClient) {
//             /**Exécution des requêtes - findAll*/
//             mongoClient.db().collection('CERISoNet').updateOne({ "_id": id_post }, { $pull: { "comments": { "text": text } } }, (err, data) => {

//                 if (err) {
//                     return console.log('erreur base de données')
//                 }
//                 if (data) {
//                     // console.log("Commetnaire ajouter")
//                     mongoClient.close() /**Fermeture de la connexion */
//                     res.send(data) /**renvoi du résultat comme réponse de la requête */
//                 }
//             })
//         }
//     })
// })

// TODO: Gestion des notifications de connexion et de déconnexion des internautes par l'utilisation de WebSockets