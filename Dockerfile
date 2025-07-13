# 예시: Node.js 앱
FROM node:20

# 앱 디렉터리 생성
WORKDIR /app

# 종속성 설치
COPY package*.json ./
RUN npm install

# 소스 복사
COPY . .

# 앱 실행
EXPOSE 3000
CMD ["npm", "start"]
