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
  host: '127.0.0.1',
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
      res.status(500).json({ error: '查询失败' });
      return;
    }
    res.json(results);
  });
});

// 插入用户数据
app.post('/api/users', (req, res) => {
  const { id, name, password } = req.body;
  if (!id || !name || !password) {
    res.status(400).json({ error: '缺少必要参数' });
    return;
  }
  const sql = 'INSERT INTO student (id, name, password) VALUES (?, ?, ?)';
  connection.query(sql, [id, name, password], (err, results) => {
    if (err) {
      console.error('插入数据失败:', err.message);
      res.status(500).json({ error: '插入失败' });
      return;
    }
    res.status(201).json({ id, name, password });
  });
});

// 登录
app.post('/api/ulogin', (req, res) => {
  const { uid, password } = req.body;
  if (!uid || !password) {
    res.status(400).json({ error: '缺少必要参数' });
    return;
  }
  const sql = 'SELECT name FROM student WHERE uid = ? AND password = ?';
  connection.query(sql, [uid, password], (err, results) => {
    if (err) {
      console.error('登录失败:', err.message);
      res.status(500).json({ error: '登录失败' });
      return;
    }
    if (results.length === 0) {
      res.status(401).json({ error: '用户名或密码错误' });
      return;
    }
    res.json({ success: true, name: results[0].name });
  });
});

// 删除用户
app.delete('/api/users/:uid', (req, res) => {
  const { uid } = req.params;
  if (!uid) {
    res.status(400).json({ error: '缺少必要参数' });
    return;
  }
  const sql = 'DELETE FROM student WHERE uid = ?';
  connection.query(sql, [uid], (err, results) => {
    if (err) {
      console.error('删除用户失败:', err.message);
      res.status(500).json({ error: '删除失败' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: '用户不存在' });
      return;
    }
    res.json({ success: true, message: '用户删除成功' });
  });
});

// 修改密码
app.put('/api/users/:uid', (req, res) => {
  const { uid } = req.params;
  const { password } = req.body;
  if (!uid || !password) {
    res.status(400).json({ error: '缺少必要参数' });
    return;
  }
  const sql = 'UPDATE student SET password = ? WHERE uid = ?';
  connection.query(sql, [password, uid], (err, results) => {
    if (err) {
      console.error('修改密码失败:', err.message);
      res.status(500).json({ error: '修改失败' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: '用户不存在' });
      return;
    }
    res.json({ success: true, message: '密码修改成功' });
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
