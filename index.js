const fs = require('fs');
const youtubedl = require('youtube-dl');
const express = require('express');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');

const port = process.env.PORT || 4000;
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.engine('.hbs', expressHandlebars({
    defaultLayout: 'main',
    extname: '.hbs',
}));
app.set('view engine', '.hbs');


app.get('/', (req, res) => {
    res.render('index');
});
// class="display-none"
app.post('/download', (req, res) => {
    let url = req.body.url;
    let video = youtubedl(url, ['--format=18'], {cwd: __dirname});
    video.on('info', function (info) {
        console.log('Download started');
        let stream = fs.createWriteStream(`./public/videos/${info._filename}`);
        video.pipe(stream);
        console.log('filename: ' + info._filename);
        console.log('size: ' + info.size);

        stream.on('finish', () => {
            res.render("index", {file: `${info._filename}`});
        });
    });
});
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});