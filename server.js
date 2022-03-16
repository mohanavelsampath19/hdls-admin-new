function requireHTTPS(req, res, next) {
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}
const express = require('express');
const app = express();

// app.use(requireHTTPS);

app.use(express.static('./dist/hdls-admin-ui'));

app.get('*', function (req, res) {
    const index = path.join(__dirname, 'build', 'index.html');
    res.sendFile(index);
  });
app.listen(process.env.PORT || 8080,()=>{
    console.log("Server listening on Port",process.env.PORT || 8080);
});