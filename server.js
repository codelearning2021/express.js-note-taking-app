const express = require('express');
const app = express();
const fs = require('fs');
const {v4: uuidv4} = require("uuid")

const path = require('path');

const PORT = process.env.PORT || 3001;



// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


// route to index.html 
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

// route to notes.html 
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './db/db.json'));
});

// post notes to db.json folder
app.post('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      const newNote = {
        title: req.body.title,
        text:req.body.text,
        id: uuidv4()
      }
      parsedData.push(newNote);

      fs.writeFile('./db/db.json', JSON.stringify(parsedData), (err) =>
        err ? console.error(err) : console.info(`\n Data written to db.json`)
      )
    }
  })
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

// delete function
app.delete('/api/notes:id', (req, res) => {const id = req.params.id;
  let note;

  notes.map((element, index) => {
    if (element.id == id){
      note = element
      notes.splice(index, 1)
      return res.json(note);
    } 
  })
});

// save notes (repeat of top, modified)
// app.save('/api/notes', (req, res) => {
//   fs.readFile('./db/db.json', 'utf8', (err, data) => {
//     if (err) {
//       console.error(err);
//     } else {
//       const parsedData = JSON.parse(data);
//       req.body.id = parsedData.length + 1;
//       parsedData.push(req.body);

//       fs.writeFile('./db/db.json', JSON.stringify(parsedData), (err) =>
//         err ? console.error(err) : console.info(`\n Data saved to db.json`)
//       )
//     }
//   })
// });

// const saveMiddleware: RequestHandler = (req, res, next) => {
//  notifyProgress(req.params.channelId, { status: 'save', message: PROGRESS_SAVING });
//  save(req, res, (err) => {
//   if (err) next(err);
//   closeHandler(req, res);
//   next();
//  });
// }

// chain listen() method onto our servers
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT} 🚀`);
});
