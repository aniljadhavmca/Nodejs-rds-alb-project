const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const db = mysql.createConnection({
  host: 'YOUR-RDS-ENDPOINT',
  user: 'admin',
  password: 'YOUR_PASSWORD',
  database: 'testdb',
  port: 3306
});

db.connect(err => {
  if (err) {
    console.error('RDS connection failed:', err);
    return;
  }
  console.log('Connected to AWS RDS');
});

app.post('/add-user', (req, res) => {
  const { name, email } = req.body;
  db.query(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [name, email],
    () => res.redirect('/')
  );
});

app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    let html = '<h2>Users</h2><table border="1"><tr><th>ID</th><th>Name</th><th>Email</th></tr>';
    results.forEach(r => {
      html += `<tr><td>${r.id}</td><td>${r.name}</td><td>${r.email}</td></tr>`;
    });
    html += '</table><br><a href="/">Back</a>';
    res.send(html);
  });
});

app.listen(80, '0.0.0.0', () => {
  console.log('Server running on port 80');
});
