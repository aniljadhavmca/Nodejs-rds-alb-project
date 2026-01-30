const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();

// =======================
// MIDDLEWARE
// =======================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// =======================
// RDS DATABASE CONNECTION
// =======================
const db = mysql.createConnection({
  host: 'devdb.cc5ggsic2so9.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'DatabaseAnil',
  database: 'testdb',
  port: 3306
});

// Connect to RDS
db.connect((err) => {
  if (err) {
    console.error('❌ RDS connection failed:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to AWS RDS');
});

// =======================
// ROUTES
// =======================

// Insert user data
app.post('/add-user', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.send('Name and Email are required');
  }

  const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
  db.query(sql, [name, email], (err) => {
    if (err) {
      console.error('Insert error:', err.message);
      return res.status(500).send('Database insert failed');
    }
    res.redirect('/');
  });
});

// =======================
// FETCH USERS (STYLED PAGE)
// =======================
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Fetch error:', err.message);
      return res.status(500).send('Failed to fetch users');
    }

    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Users List</title>
  <style>
    body {
      margin: 0;
      padding: 30px;
      font-family: Arial, Helvetica, sans-serif;
      background: linear-gradient(135deg, #141e30, #243b55);
    }

    .container {
      background: #ffffff;
      max-width: 800px;
      margin: auto;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.3);
    }

    h2 {
      text-align: center;
      margin-bottom: 25px;
      color: #333;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      background: #243b55;
      color: #ffffff;
      padding: 12px;
    }

    td {
      padding: 10px;
      text-align: center;
      border-bottom: 1px solid #ddd;
    }

    tr:hover {
      background: #f4f6f8;
    }

    .back {
      text-align: center;
      margin-top: 25px;
    }

    .back a {
      text-decoration: none;
      background: #243b55;
      color: white;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: bold;
    }

    .back a:hover {
      background: #141e30;
    }
  </style>
</head>
<body>

  <div class="container">
    <h2>Users Stored in AWS RDS</h2>

    <table>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
      </tr>`;

    results.forEach(user => {
      html += `
      <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
      </tr>`;
    });

    html += `
    </table>

    <div class="back">
      <a href="/">⬅ Back to Home</a>
    </div>
  </div>

</body>
</html>`;

    res.send(html);
  });
});

// =======================
// HEALTH CHECK (OPTIONAL)
// =======================
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// =======================
// START SERVER
// =======================
app.listen(80, '0.0.0.0', () => {
  console.log('🚀 Server running on port 80');
});
