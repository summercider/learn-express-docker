const express = require('express');
const router = express.Router();
const connection = require('../config/mysql.js');

// post 요청 create
router.post('/user', (req, res) => {
  const { name, age, comment } = req.body; //nodejs_db의 테이블 구조대로
  console.log(name);
  console.log(req.body);
  // 필수값 체크//nodejs_db 에 notnull name,age0
  if (!name || !age) {
    return res.status(400).send('name, age필수값 확인함? 똑바로 보내');
  }

  const query = 'INSERT INTO user (name, age, comment) VALUES (?, ? ,?)';
  const values = [name, age, comment || null]; //undefined 는 falsy니까 => null로 바꿔줌

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('post 에러남' + err.message);
      return res.status(500).send('DB ERROR');
    }
    return res.json(result);
  });
});

// get 요청 read
router.get('/user', (req, res) => {
  connection.query('SELECT * FROM user;', (err, result) => {
    if (err) {
      console.error('sql get 에러' + err.message);
      return res.status(500).send('데이터베이스에서 못가져옴ㅋ');
    } else {
      return res.json(result);
    }
  });
});

// user/search .  user/:id 보다 위에 작성해야함. get

router.get('/user/search', (req, res) => {
  const { search } = req.query;

  if (!search) {
    return res.status(400).send('search값 없음 다시검색하세요');
  }

  const query = 'SELECT * FROM user WHERE name LIKE ?';
  const searchValue = `%${search}%`;

  connection.query(query, [searchValue], (err, result) => {
    if (err) {
      console.error('사용자검색 에러', err.message);
      return res.status(500).send('DB ERROR');
    }

    if (result.length === 0) {
      return res.status(404).send('검색 사용자가 없습니다');
    }
    console.warn(result);
    return res.json(result);
  });
});

// user/:id 패스파라미터로 특정사용자 검색  get
router.get('/user/:id', (req, res) => {
  const { id } = req.params;
  console.log(id);

  const query = 'SELECT * FROM user WHERE user_id = ?';

  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('사용자가져오기 에러', err.message);
      return res.status(500).send('DB ERROR');
    }
    if (result.length === 0) {
      return req.status(404).send('검색사용자 없음');
    }
    return res.json(result[0]);
  });
});

// user/:id 일부수정 patch
router.patch('/user/:id', (req, res) => {
  const { id } = req.params;
  const { name, age, comment } = req.body;
  // 수정내용이 전부 없음
  if (!name && !age && !comment) {
    return res.status(400).send('수정할 내용없음');
  }

  //수정할 내용을 모르니 빈배열로 처리
  const updates = [];
  const values = [];

  if (name) {
    updates.push('name = ?');
    values.push(name);
  }
  if (age) {
    updates.push('age = ?');
    values.push(age);
  }
  if (comment) {
    updates.push('comment = ?');
    values.push(comment);
  }

  values.push(id);
  //`UPDATE user SET name = ? , age = ? , commnet = ? WHERE user_id = ?`
  const query = `UPDATE user SET ${updates.join(', ')} WHERE user_id = ?`;
  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('사용자 수정 에러:', err.message);
      return res.status(500).send('Database error');
    }
    res.json(result);
  });
});

// DELETE /user/:id - 특정 사용자 삭제
router.delete('/user/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM user WHERE user_id = ?';

  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('삭제에러', err.message);
      return res.status(500).send('DB ERROR');
    }

    //affectedRows 삭제된 행의 개수 (mysql에서 보내줌)
    if (result.affectedRows === 0) {
      return res.status(404).send('사용자가 없음');
    }

    return res.json(result);
  });
});

// //패스파라미터 늘리려면 경로에 더 늘려주면됨 *필수
// router.get('/user/:id', (req, res) => {
//   const { limit, skip, type } = req.query; //쿼리파라미터는 객체로 들어옴 쿼리파라미터 선언 *옵션
//   console.log(req.params, limit, skip, type, '=====================');

//   const { id, detailId } = req.params;

//   res.send(
//     'Hellllllll  , User' +
//       req.params.id +
//       `패스파라미터 받아서 구조분해하여 사용 ${id}`
//   );
// });

module.exports = router;
