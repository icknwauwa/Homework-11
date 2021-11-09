
import { createRequire } from 'module';
const require = createRequire(import.meta.url);




import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'
import { application } from 'express';




const __dirname = dirname(fileURLToPath(import.meta.url));

// Use JSON file for storage
const file = join(__dirname, 'db/db1.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)
// Read data from JSON file, this will set db.data content


// console.log(posts);





const express = require('express');
const bodyParser = require('body-parser');
let app = express();
app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(bodyParser.json())

app.use(express.static(__dirname+'/public'));
app.set('view engine','ejs');



app.get('/',function(req,res){
    res.render('index',{});
});

app.get('/notes',function(req,res){
    res.render('notes',{});
});




// api
app.get('/api/notes',async function(req,res){
    // console.log(notes);
    await db.read()
    const { posts } = db.data
    res.send(posts);
});

app.post('/api/notes',async function(req,res){
    await db.read()
    const { posts } = db.data
    console.log(req.body)

    posts.push(    {
        "id": Math.round(Math.random()*10000,5),
        "title": req.body.title,
        "text": req.body.text
    })

    await db.write()
    res.send('success');
   
});


app.delete('/api/notes/:id',async function(req,res){
    var postID = req.params.id
    // console.log(postID);

    await db.read()
    var { posts } = db.data
    
    // console.log(posts)
    posts = posts.filter(p => {
        return p.id != postID
    })
    console.log(posts)
   
    db.data.posts = posts
    await db.write()
    res.send({'success':true});
});






app.listen(3000,function(){
    console.log('server is running on port 3000');
})