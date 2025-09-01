function errorHandler(res, error) {
  console.error('[errorHandler] An unexpected error occurred:', error);
  if (res.headersSent) {
    console.log('[errorHandler] Headers were already sent. Ending the request.');
    res.end();
  } else {
    console.log('[errorHandler] Headers not sent yet. Sending 500 response.');
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal Server Error' }));
  }
}

module.exports = errorHandler;