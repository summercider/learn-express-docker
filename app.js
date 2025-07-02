// express 모듈 importing
const express = require('express');
const path = require('path');

const cors = require('cors');

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');

const indexRouter = require('./routes/index.js');
const userRouter = require('./routes/user.js');
const authRouter = require('./routes/auth.js');
const profileRouter = require('./routes/profile.js');
// *--------------------------------------------------------------------------------
dotenv.config(); // dotenv 활성화
// console.log(process.env.ENCODE_API_KEY);
// *--------------------------------------------------------------------------------
const app = express(); // express객체생성
app.set('port', process.env.PORT || 3001); // .env에 port설정or3000(nextjs랑 충돌피하려고 3001줌)
// *--------------------------------------------------------------------------------
app.use(cors());
// *--------------------------------------------------------------------------------
// 미들웨어 설정 - 각 미들웨어 내부에서 next()를 호출하므로 다음 미들웨어로 넘어감
app.use(morgan('dev'));

app.use('/', express.static(path.join(__dirname, 'public'))); // public 폴더를 정적 폴더(html,image,css,video,js...)로 지정 + 데이터 img를 /public/images에 넣고 경로를 db에 저장후 프론트로 보내줌
app.use(express.json()); // 전송된 JSON 형식의 요청 본문(Body)을 파싱하여 req.body 객체에 담아줌
app.use(express.urlencoded({ extended: false })); //url 인코딩

app.use(cookieParser(process.env.COOKIE_SECRET)); //쿠키 설정- 파싱해서 req.cookies객체에 담아줌
// *--------------------------------------------------------------------------------
//세션 설정
//-세션쿠키
app.use(
  session({
    resave: false, // 세션 데이터 수정사항 없을 경우 저장하지 않음
    saveUninitialized: false, // 세션에 저장할 내용이 없을 경우 세션을 저장하지 않음
    secret: process.env.COOKIE_SECRET, // 세션쿠키의 비밀키
    cookie: {
      httpOnly: true, // 자바스크립트로 쿠키 접근 방지
      secure: false, // https가 아닌 환경에서도 사용할 수 있도록
    },
    name: 'session-cookie',
  })
);

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});

// *--------------------------------------------------------------------------------
// -
// // *--------------------------------------------------------------------------------

// //미들웨어는 전부 익명함수이기떄문에 순서가 중요함 위에서 아래로 순차적처리

// //모든요청에대한실행
// // app.use((request, response, next) => {
// //   console.log('모든 요청에대한 실행');
// //   next();
// // });

// //라우터 미들웨어(RouterMiddleWare) - 네트워크 요청reques과 응답response 사이에 실행되는 함수
// // -백엔드에서 사용함( 프론트 요청작업 거르기,가로채기,파싱,로그,오류 )
// app.get(
//   '/',
//   (request, response, next) =>
//     //get에대한 응답을 send로 보내줌
//     {
//       // app.get(경로)
//       //get, post, put, delete 전부 응답만들수잇음
//       //* response.send(`${app.get('port')}포트로 app.get(경로)에대한 응답`);

//       console.log('get / 요청에서만실행');
//       next();
//     },
//   // 필요시 next()로 여러개 가능
//   (request, response) => {
//     throw new Error('에러는 에러처리 미들웨어로 감');
//   }
// );

// 라우터 설정
app.use(indexRouter);
app.use(userRouter);
app.use(authRouter);
app.use(profileRouter);

// 에러처리 미들웨어는 항상 맨아래에
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});
// -
// 서버실행 (포트3001   app.get('port'))  // app.get(포트)
app.listen(app.get('port'), () => {
  console.log(
    app.get('port'),
    `app.get(포트) ${app.get('port')}번 포트에서 대기중`
  );
});
