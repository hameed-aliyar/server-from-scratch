//importing http
const http = require('http');

//init inline db
const todos = [
    { id: 1, text: 'Learn Node.js basics', completed: true },
    { id: 2, text: 'Build a no-framework server', completed: false },
    { id: 3, text: 'Relax this weekend', completed: false }
];

//creating the server
const server = http.createServer((req, res) => {
    if (req.url === '/todos' && req.method === 'GET') { //the basic get method that fetches the list
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(todos));
    } else if (req.url === '/todos' && req.method === 'POST') { //the basic post method to add a note to list
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const newTodo = JSON.parse(body);
            newTodo.id = todos.length + 1;
            todos.push(newTodo);
            res.writeHead(201, { 'content-type': 'application/json' });
            res.end(JSON.stringify(newTodo));
        });
    } else if (req.url.startsWith('/todos/') && req.method === 'DELETE') { //the basic delete method to remove a note from list
        const parts = req.url.split('/');
        const id = parseInt(parts[2]);
        const indexToRemove = todos.findIndex(todo => todo.id === id);
        if (indexToRemove !== -1) {
            todos.splice(indexToRemove, 1);
        }
        res.writeHead(204);
        res.end();
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