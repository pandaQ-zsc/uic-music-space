const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;
const cors = require('cors');

// 使用 CORS 中间件
app.use(cors());

// 设置允许解析 JSON 数据
app.use(express.json());

// 创建数据库连接
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123',
  database: 'test'
});

// 测试数据库连接
connection.connect((err) => {
  if (err) {
    console.error('连接数据库失败:', err.message);
    return;
  }
  console.log('成功连接到 MySQL 数据库');
});

// 查询所有用户数据
app.get('/api/users', (req, res) => {
  const sql = 'SELECT * FROM student';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('查询数据失败:', err.message);
      res.status(500).send('查询失败');
      return;
    }
    res.json(results);
  });
});

// 插入用户数据
app.post('/api/users', (req, res) => {
  const { name, age } = req.body;
  const sql = 'INSERT INTO users (name, age) VALUES (?, ?)';
  connection.query(sql, [name, age], (err, results) => {
    if (err) {
      console.error('插入数据失败:', err.message);
      res.status(500).send('插入失败');
      return;
    }
    res.status(201).json({ id: results.insertId, name, age });
  });
});

// 登录
app.post('/api/ulogin', (req, res) => {
  const { uid, password } = req.body;
  const sql = 'SELECT name FROM student where uid = ? and password = ?';
  connection.query(sql, [uid, password], (err, results) => {
    if (err) {
      console.error('登录失败:', err.message);
      res.status(500).send('登录失败');
      return;
    }
    res.json(results);
  });
});

// 关闭数据库连接时的清理
process.on('SIGINT', () => {
  connection.end((err) => {
    if (err) {
      console.error('关闭数据库连接失败:', err.message);
    }
    console.log('数据库连接已关闭');
    process.exit();
  });
});

// 启动服务
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
