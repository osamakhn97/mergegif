const express = require("express");

const ffmpeg = require("fluent-ffmpeg");

const bodyParser = require("body-parser");

const fs = require("fs");

const fileUpload = require("express-fileupload");

const app = express();

const PORT = process.env.PORT || 5000
const cors = require('cors');
app.use(cors({
    origin: '*'
}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname))
// parse application/json
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);

ffmpeg.setFfmpegPath("C:\\ffmpeg\\bin\\ffmpeg.exe");

ffmpeg.setFfprobePath("C:\\ffmpeg\\bin");


console.log(ffmpeg);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/convert", (req, res) => {
    //res.contentType(`video/${to}`);
    //res.attachment(`output.${to}`

    let to = 'gif';
    let file = req.files.video;
    let fileName = `output.${to}`;
    console.log(to);
    console.log(file);

    file.mv("tmp/" + `${file.name}.webm`, function (err) {
        if (err) return res.sendStatus(500).send(err);
        console.log("File Uploaded successfully");
    });

    ffmpeg("tmp/" + `${file.name}.webm`)
        .output('outputfile.gif')
        .on('end', function() {
            console.log('Finished processing');
        })
        .run()

    res.send('http://localhost:5000/outputfile.gif')
    // .output(stream);

    // ffmpeg('temp/to/file.avi')
    //     // You may pass a pipe() options object when using a stream
    //     .output(stream, { end:true });
    // ffmpeg("tmp/" + `${file.name}.webm`)
    //   .withOutputFormat(to)
    //   .on("end", function (stdout, stderr) {
    //     console.log("Finished e3");
    //     res.download(__dirname, function (err) {
    //       if (err) throw err;
    //
    //       fs.unlink(__dirname, function (err) {
    //         if (err) throw err;
    //         console.log("File deleted e1");
    //       });
    //     });
    //     fs.unlink("tmp/" + `${file.name}.webm`, function (err) {
    //       if (err) throw err;
    //       console.log("File deleted e2");
    //     });
    //   })
    //   .on("error", function (err) {
    //     console.log("an error happened: " + err.message);
    //     fs.unlink("tmp/" + `${file.name}.webm`, function (err) {
    //       if (err) throw err;
    //       console.log("File deleted");
    //     });
    //   })
    //   .saveToFile(__dirname);
    //.pipe(res, { end: true });
});

app.listen(PORT);

// oReq.open("POST", 'http://localhost:5000/convert', true);
// // oReq.setRequestHeader("Content-Type", "multipart/form-data")
// oReq.onload = function (oEvent) {
//     // Uploaded.
//     if (oEvent.target.status == 200) {
//         const url = JSON.parse(oEvent.target.response).file
//         let fileName = url.split('/')
//         a.href = url;
//         a.download = fileName[fileName.length - 1];
//         document.body.appendChild(a);
//         a.click();
//         setTimeout(() => {
//             document.body.removeChild(a);
//             window.URL.revokeObjectURL(url);
//         }, 100);
//     }
// };
// oReq.onerror = function(e){
//     console.log('error')
// };
// data.append('video', blob);
// oReq.send(data);