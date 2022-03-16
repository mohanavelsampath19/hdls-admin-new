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

// app.use(express.static('./dist/hdls-admin-ui'));
app.use(express.static(__dirname + '/dist/hdls-admin-ui'));

app.get('/*', function(req,res) {
res.sendFile(path.join(__dirname + '/dist/hdls-admin-ui/index.html'));
});

app.listen(process.env.PORT || 8080,()=>{
    console.log("Server listening on Port",process.env.PORT || 8080);
});