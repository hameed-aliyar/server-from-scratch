async function routeHandler(req, res, todos, nextId, saveDataToFile) {
    if (req.url === '/todos' && req.method  === 'GET') {
        res.writeHead(200, {'content-type': 'application/json'});
        res.end(JSON.stringify(todos));
    } else if (req.url === '/todos' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                console.log('Received body string before parsing:', body);
                const newTodo = JSON.parse(body.trim());
                if (!newTodo.text || typeof newTodo.text !== 'string' || newTodo.text.trim() === '') {
                    res.writeHead(400, {'content-type': 'application/json'});
                    res.end(JSON.stringify({message: 'Validation Error: The "text" field is required and must be a non-empty string.'}));
                    return;
                }
                newTodo.completed = newTodo.completed === true;;
                newTodo.id = nextId++;
                todos.push(newTodo);
                await saveDataToFile();
                res.writeHead(201, {'content-type': 'application/json'});
                res.end(JSON.stringify(newTodo));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid JSON in request body' }));
            }
        })
    }  else if (req.url.startsWith('/todos/') && req.method === 'PUT') {
        const parts = req.url.split('/');
        const id = parseInt(parts[2]);
        let body = '';
        req.on('data', chunk => { 
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
    } else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
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
                res.writeHead(44, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Todo not found' }));
            }
        } catch (error) {
            console.error('Error in DELETE handler:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Server Error' }));
        }
    } else {
        res.writeHead(404, {'content-type': 'application/json'});
        res.end(JSON.stringify({message: 'Route Note Found'}));
    }
}

module.exports = routeHandler;