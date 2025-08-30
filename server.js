//importing http module
const http = require('http');

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

//write to db.json
async function saveDataToFile() {
    try {
        const data = JSON.stringify(todos, null, 2);
        await fs.promises.writeFile('db.json', data, 'utf8');
    } catch (error) {
        console.error("Error writing to database file: ", error);
    }
}

//creating the server
const server = http.createServer( async (req, res) => {
    if (req.url === '/todos' && req.method === 'GET') { //the basic get method that fetches the list
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(todos));
    } else if (req.url === '/todos' && req.method === 'POST') { //the basic post method to add a note to list
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                console.log('Received body string before parsing:', body);
                const newTodo = JSON.parse(body.trim());
                if (!newTodo.text || typeof newTodo.text !== 'string' || newTodo.text.trim() === '') {
                    res.writeHead(400, { 'content-type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Validation Error: The "text" field is required and must be non-empty string.'}));
                    return;
                }
                newTodo.id = todos.length + 1;
                todos.push(newTodo);
                await saveDataToFile();
                res.writeHead(201, { 'content-type': 'application/json' });
                res.end(JSON.stringify(newTodo));
            } catch (error) {
                console.error("Error parsing JSON:", error);
                res.writeHead(400, { 'content-type': 'application/json' });
                res.end(JSON.stringify({message: "Invalid JSON"}));
            }
        });
    } else if (req.url.startsWith('/todos/') && req.method === 'DELETE') { //the basic delete method to remove a note from list
        try {
            const parts = req.url.split('/');
            const id = parseInt(parts[2]);
            const indexToRemove = todos.findIndex(todo => todo.id === id);
            if (indexToRemove !== -1) {
                todos.splice(indexToRemove, 1);
                await saveDataToFile();
                res.writeHead(204);
                res.end();
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Todo not found' }));
            }   
        } catch (error) {
            console.error('Error in DELETE handler:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Server Error' }));
        }
    } else if (req.url.startsWith('/todos/') && req.method === 'PUT') { //the basic put method to update a note in the list
        const parts = req.url.split('/');
        const id = parseInt(parts[2]);
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                console.log('Received body string before parsing:', body);
                const newTodo = JSON.parse(body.trim());
                if (
                    (newTodo.text !== undefined && (typeof newTodo.text !== 'string' || newTodo.text.trim() === '')) || 
                    (newTodo.completed !== undefined && typeof newTodo.completed !== 'boolean')
                ) {
                    res.writeHead(400, { 'content-type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Validation Error: "text" must be a string and "completed" must be a boolean.'}));
                    return;
                }
                const indexToUpdate = todos.findIndex(todo => todo.id === id);
                if (indexToUpdate === -1) {
                    res.writeHead(404, { 'content-type': 'application/json' });
                    res.end(JSON.stringify({message: 'Todo not found'}));
                    return;
                }
                const updatedTodo = {
                    ...todos[indexToUpdate],
                    ...newTodo
                }
                todos[indexToUpdate] = updatedTodo;
                await saveDataToFile();
                res.writeHead(200, { 'content-type': 'application/json' });
                res.end(JSON.stringify(updatedTodo));
            } catch (error) {
                console.error("Error parsing JSON:", error);
                res.writeHead(400, { 'content-type': 'application/json' });
                res.end(JSON.stringify({message: "Invalid JSON"}));
            }
        });
    } else { //error handling in case route not defined
        res.writeHead(404, { 'content-type' : 'application/json' });
        res.end(JSON.stringify({ message: 'Route Not Found.' }));
    }
});

//init port
const PORT = 3000;

//running the server 
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});