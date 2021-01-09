import express from 'express';
import mongodb from 'mongodb';

let app = express();
let db;
let port = process.env.PORT;
if (port == null || port == '') {
	port = 3000;
}
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
let connectionString =
	'mongodb+srv://kunaguero:mancity10@cluster0.zeuul.mongodb.net/HabitApp?retryWrites=true&w=majority';

mongodb.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
	db = client.db();
	app.listen(port);
});

app.get('/', function(req, res) {
	db.collection('habits').find().toArray(function(err, items) {
		res.send(`<!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Simple Habit Tracking</title>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
        </head>
        <body>
          <div class="container">
            <h1 class="display-4 text-center py-1">To-Do App</h1>
        
            <div class="jumbotron p-3 shadow-sm">
              <form id="create-form" action="/create-item" method="POST">
                <div class="d-flex align-items-center">
                  <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                  <button class="btn btn-primary">Add New Item</button>
                </div>
              </form>
            </div>
        
            <ul id="item-list" class="list-group pb-5">
            

            </ul>
        
        </div>     
        <script>
            let items = ${JSON.stringify(items)}
        </script>           
        <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
        <script src="/browser.js"></script>
        </body>
    </html>`);
	});
});

app.post('/add-habit', function(req, res) {
	db.collection('habits').insertOne({
		habit: req.body.habit,
		status: 'Pending'
	}, function(err, info) {
		res.json(info.ops[0]);
	});
});

app.post('/delete-habit', function(req, res) {
	console.log(req.body.id);
	db.collection('habits').deleteOne({ _id: new mongodb.ObjectID(req.body.id) }, function() {
		res.send('success');
	});
});

app.post('/update-habit', function(req, res) {
	db.collection('habits').findOneAndUpdate({ _id: new mongodb.ObjectID(req.body.id) }, {
		$set: { status: 'done' }
	}, function() {
		res.send('success');
	});
});
