import { io } from 'socket.io-client'

/* Init Socket connexion */

// import * as dotenv from 'dotenv'
// dotenv.config()

export const socket = io('http://localhost:3000')
// socket.on('connect', init)

/* Imports go here */

// ...

/* Render users */

// const users = []

// users.map(renderUser)

// function renderUser() {}