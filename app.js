const fs = require('fs'),
    path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser'),
    // Jimp = require("jimp"),
    gm = require("gm"),
    // Promise = require('bluebird'),
    rtlText = require('@mapbox/mapbox-gl-rtl-text');



const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render('index');
});



// fs.appendFile('names.txt', name + '\n', (err) => {
//     if (err) throw err;
// });



app.post('/', (req, res) => {
    let name = req.body.name;

    var arabicString = name;
    var shapedArabicText = rtlText.applyArabicShaping(arabicString);
    var readyForDisplay = rtlText.processBidirectionalText(shapedArabicText, []);
  
    mutateAndSave(readyForDisplay)
        .then( ()=> {
            res.download("600-edi.jpg")
        })
        .catch(err => {
            // console.log(err);
            res.status(500).send(err + " ************************");
        });

/*
    
        var filePath = path.join(__dirname, "600-edi.jpg");
        // var stat = fs.statSync(filePath);

        res.writeHead(200, {
            'Content-disposition': 'attachment;filename:edited.jpg'
            // 'Content-Type': 'image/jpg'
            // 'Content-Length': stat.size
        });

        var readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
    */

    // console.log("$$$$$$$$$$$$$$$$$$   After   $$$$$$$$$$$$$$$$$$");

});





app.use((req, res) => {
    res.render('err');
});

app.listen(process.env.PORT || 5000);








function mutateAndSave(text) {
    return new Promise(function (resolve, reject) {
        gm("600.jpg")
            .fill('#FF0066')
            .font("GE_SS_Two_Bold.otf", 42)
            .drawText(30, 200, text)
            .write("600-edi.jpg", function (err) {
                if (!err) resolve();
                else {
                    console.log(err);
                    reject()
                }

            });
    });
}
