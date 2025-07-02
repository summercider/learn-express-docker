const express = require('express');
const router = express.Router();

//사용자별 세션 생성시 post 인데 테스트목적으로 get함
router.get('/login', (req, res) => {
  const { username, password } = { username: 'admin', password: '1234' }; //프론트에서 발송한 사용자데이터

  //해당 데이터가 있다면, 작업 (sql>db조회/확인> )
  if (username === 'admin' && password === '1234') {
    req.session.user = { id: 1, name: '관리자' };
    res.send(
      'res.status=200 <<성공은  status안주기 가능. 로그인성공 !!! 세션설정완료!!!'
    );
  } else {
    res.status(401).send('로그인실패, 아디비번 틀림여');
  }
});

router.get('/logout', (req, res) => {
  //세션삭제
  req.session.destroy(() => {
    //쿠키삭제
    res.clearCookie('session-cookie');
    res.send('로그아웃완료, 세션삭제함');
  });
});

module.exports = router;
