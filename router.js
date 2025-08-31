const todoController = require('./controllers/todoController.js');

async function routeHandler(req, res, db, saveDataToFile) {
    if (req.url === '/todos' && req.method  === 'GET') {
        todoController.getTodos(req, res, db);
    } else if (req.url === '/todos' && req.method === 'POST') {
        todoController.createTodo(req, res, db, saveDataToFile);
    }  else if (req.url.startsWith('/todos/') && req.method === 'PUT') {
        todoController.updateTodo(req, res, db, saveDataToFile);
    } else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
        todoController.deleteTodo(req, res, db, saveDataToFile);
    } else {
        res.writeHead(404, {'content-type': 'application/json'});
        res.end(JSON.stringify({message: 'Route Note Found'}));
    }
}

module.exports = routeHandler;