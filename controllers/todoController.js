function getTodos(req, res, db) {
    try {
        res.writeHead(200, {'content-type': 'application/json'});
        res.end(JSON.stringify(db.todos));
    } catch (error) {
        res.writeHead(500, {'content-type': 'application/json'});
        res.end(JSON.stringify({message: 'Server Error'}));
    }
}

async function createTodo(req, res, db, saveDataToFile) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        try {
            const newData = JSON.parse(body.trim());
            if (!newData.text || typeof newData.text !== 'string' || newData.text.trim() === '') {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Validation Error: The "text" field is required and must be a non-empty string.' }));
                return;
            }
            newData.completed = newData.completed === true;
            newData.id = db.nextId++; 
            db.todos.push(newData);
            await saveDataToFile(db.todos); 
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newData));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid JSON in request body' }));
        }
    });
}

async function updateTodo(req, res, db, saveDataToFile) {
    const parts = req.url.split('/');
    const id = parseInt(parts[2]);
    let body = '';
    req.on('data', chunk => { 
        body += chunk.toString(); 
    });
    req.on('end', async () => {
        try {
            console.log('Received body string before parsing:', body);
            const newData = JSON.parse(body.trim());
            if (
                (newData.text !== undefined && (typeof newData.text !== 'string' || newData.text.trim() === '')) || 
                (newData.completed !== undefined && typeof newData.completed !== 'boolean')
            ) {
                res.writeHead(400, { 'content-type': 'application/json' });
                res.end(JSON.stringify({ message: 'Validation Error: "text" must be a string and "completed" must be a boolean.'}));
                return;
            }
            const indexToUpdate = db.todos.findIndex(todo => todo.id === id);
            if (indexToUpdate === -1) {
                res.writeHead(404, { 'content-type': 'application/json' });
                res.end(JSON.stringify({message: 'Todo not found'}));
                return;
            }
            const updatedTodo = {
                ...db.todos[indexToUpdate],
                ...newData
            }
            db.todos[indexToUpdate] = updatedTodo;
            await saveDataToFile(db.todos);
            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify(updatedTodo));
        } catch (error) {
            console.error("Error parsing JSON:", error);
            res.writeHead(400, { 'content-type': 'application/json' });
            res.end(JSON.stringify({message: "Invalid JSON"}));
        }
    });
}

async function deleteTodo(req, res, db, saveDataToFile) {
    try {
        const parts = req.url.split('/');
        const id = parseInt(parts[2]);
        const indexToRemove = db.todos.findIndex(todo => todo.id === id);
        if (indexToRemove !== -1) {
            db.todos.splice(indexToRemove, 1);
            await saveDataToFile(db.todos);
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
}

module.exports = {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo
};