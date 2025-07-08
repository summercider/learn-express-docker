# Dockerfile
# nodejs같은 os의 설치프로그램도 도커이미지에 포함
#도커이미지에 포함할 내용, 라이브러리 등

# Node.js 공식 이미지 사용
FROM node:20-alpine
# 컨테이너 내부 작업 디렉토리 설정
WORKDIR /app

# package.json 및 package-lock.json 작업 디렉토리로 복사 후 의존성 설치
COPY package.json package-lock.json ./

# 빌드시 dev디펜던시 제외 최소 구성만 설치
ENV NODE_ENV=production
RUN npm install --omit=dev

# 현재 폴더의 모든 파일, 폴더를 /app으로 복사
COPY . . 

# 컨테이너 실행 시 실행할 명령어
CMD ["npm", "start"]

# 컨테이너 내부에서 사용할 포트 지정
EXPOSE 3001



#
# dockerfile 기본구조
# FROM <베이스이미지>
# WORKDIR /app
# COPY . .
# RUN <설치 명령어>
# EXPOSE <포트번호>
# CMD ["실행", "명령어", "옵션"]

# FROM : 어떤 OS/언어나 환경 베이스로 할지
# WORKDIR : 작업 디렉토리 설정 (컨테이너 안의 위치)
# COPY : 내 소스 코드를 컨테이너에 복사
# RUN : 컨테이너 빌드 중 실행할 명령어 (설치 등)
# EXPOSE : 컨테이너 외부에 열 포트 지정 (문서용)
# CMD : 컨테이너 실행 시 기본 명령어 (한 번만 실행)
