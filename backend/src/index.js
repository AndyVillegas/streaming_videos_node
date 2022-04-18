const fs = require('fs');

const express = require('express');
const app = new express();
const port = 3000;

app.use(express.json())
app.get('/', (req, res) => {
    res.send('Hello World!');
})
app.get('/video', (req, res) => {
    const range = req.headers.range;
    const videoPath = './media/my_video.mp4';
    const videoSize = fs.statSync(videoPath).size;
    const CHUNK_SIZE = 1024 ** 2;
    const start = Number(range.replace(/\D/g,""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    console.log('start',start,'end',end);
    const headers = {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': 'video/webm',
    };
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
})
app.listen(port, () => {
    console.log(`listening on port ${port}`);
})