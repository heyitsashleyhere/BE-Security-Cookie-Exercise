import cookieParser from 'cookie-parser'
import express from 'express'
import { hash } from './lib/crypto.js'

const app = express()

const sessions = []

app.use(express.json()) // read json req
app.use(cookieParser("thisIsASceret"))

// Endpoint:
// 1. GET /token/:number
app.get("/token/:number", async (req, res) => {
    const hashedNum = await hash(req.params.number)
    const session = { id: hashedNum, timeStamp: Date.now() }
    sessions.push(session)
    res.cookie(
        "id", // keyName
        session.id, // Value
        { httpOnly: false, signed: true } //Cookie Options
    )
    res.cookie(
        "timeStamp", // keyName
        session.timeStamp, // Value
        { httpOnly: false } //Cookie Options
    )
    res.send({ success: "ok" })
})

// Every request you send will have the cookie there `req.signedCookies`
// 2. POST /message
app.post("/message", (req, res) => {
    // console.log('req.body :>> ', req.body);
    // console.log('req.cookies :>> ', req.cookies);
    // console.log('req.signedCookies :>> ', req.signedCookies); 
    // the signedCookies checks automatically: req.signedCookies :>>  [Object: null prototype] { id: false }
    const currentTime = Date.now()
    if(!req.signedCookies.id) {
        res.status(400).send({ error: "Hash not found or incorrect hash"})
    } else if ( currentTime - req.cookies.timeStamp > (60 * 1000) ) {
        res.status(400).send({ error: "More than 1 min ago"})
    } else {
        res.status(200).send({ success: "Thanks for the message" })
    }
})

// this is accessing the files from the directory you created
app.use(express.static('public'))

app.listen(7000, () => console.log(`Up at: http://localhost:7000/`))

// the 6000s port: Internet Relay Chat
// https://en.wikipedia.org/wiki/Internet_Relay_Chat