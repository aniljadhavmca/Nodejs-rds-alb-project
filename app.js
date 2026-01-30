const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// RDS Connection
const db = mysql.createConnection({
  host: 'devdb.cc5ggsic2so9.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'DatabaseAnil',
  database: 'testdb',
  port: 3306
});

// Connect to RDS
db.connect(err => {
  if (err) {
    console.error('❌  RDS connection failed:', err);
    return;
  }
  console.log('✅  Connected to AWS RDS');
});

// Insert data
app.post('/add-user', (req, res) => {
  const { name, email } = req.body;

  const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
  db.query(sql, [name, email], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Fetch data
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) throw err;

    let html = `
      <h2>Users List</h2>
      <table border="1" cellpadding="10">
        <tr><th>ID</th><th>Name</th><th>Email</th></tr>
    `;

    results.forEach(row => {
      html += `<tr><td>${row.id}</td><td>${row.name}</td><td>${row.email}</td></tr>`;
    });

    html += '</table><br><a href="/">Back</a>';
    res.send(html);
  });
});

app.listen(80, '0.0.0.0', () => {
  console.log('🚀  Server running on port 80');
});
