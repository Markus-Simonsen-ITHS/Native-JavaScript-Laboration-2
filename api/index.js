const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
const ip = require('ip')
const { json } = require('express')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require("dotenv").config();

app.use(cors())

app.get('/', (req, res) => {
    res.send('Welcome!')
});

app.get('/fakeCallback', async (req, res) => {
    const request = await fetch('https://github.com/login/oauth/access_token', {
        body: `{ "client_id": "${process.env.CLIENT_ID}", "client_secret": "${process.env.SECRET}", "code": "${req.query.code}" }`,
        headers: {
            'Content-Type': 'application/json',
            'accept': "application/json"
        },
        method: 'POST'
    })

    // console.log(await request.json())

    const authResponse = await request.text();

    console.log(authResponse)

    res.send(JSON.parse(authResponse)['access_token'])
})

app.listen(port, () => {
    console.log(`\nApp running at:\n- Local: \x1b[36mhttp://localhost:${port}/\x1b[0m\n- Network \x1b[36mhttp://${ip.address()}:${port}/\x1b[0m\n\nTo run for production, run \x1b[36mnpm run start\x1b[0m`)
});