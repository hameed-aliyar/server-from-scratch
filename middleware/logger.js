function logger(req, res, next) {
  console.log(`[LOG] ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
}

module.exports = logger;