//importing .env
require('dotenv').config();

//importing http module
const http = require('http')

//importing router
const routeHandler = require('./router.js');

//importing errorHandler
const errorHandler = require('./utils/errorHandler.js');

//importing logger middleware
const logger = require('./middleware/logger.js');

//importing the fs module
const fs = require('fs');

//init necessary variables 
let todos;
let nextId;

//load the db from db.json and init the nextId according to the contents in db.json
try {
    const data = fs.readFileSync('db.json', 'utf8');
    todos = JSON.parse(data);
    if (todos.length > 0) {
        nextId = Math.max(...todos.map(t => t.id)) + 1;
    } else {
        nextId = 1;
    }
    console.log('Database loaded successfully from db.json.');
} catch (error) {
    console.error("Error reading database file: ", error);
    todos = [];
    nextId = 1;
}

//creating a container for db
const db = {
    todos: todos,
    nextId: nextId
};

//write to db.json
async function saveDataToFile(todos) {
    try {
        const data = JSON.stringify(todos, null, 2);
        await fs.promises.writeFile('db.json', data, 'utf8');
    } catch (error) {
        console.error("Error writing to database file: ", error);
    }
}

//creating the server
const server = http.createServer( async (req, res) => {
    logger(req, res, async () => {
        try {
            await routeHandler(req, res, db, saveDataToFile);
        } catch (error) {
            errorHandler(res, error);
        }   
    });
});

//init port
const PORT = process.env.PORT || 4000;

//running the server 
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});