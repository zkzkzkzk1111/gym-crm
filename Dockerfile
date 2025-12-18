###### Build Stage #####
FROM node:22-alpine AS build
LABEL author="Harry Ho"
WORKDIR /app

# Alpine Linux에 빌드 도구 설치
RUN apk add --no-cache python3 make g++

# 의존성 설치를 위한 package 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install --legacy-peer-deps

# 소스 코드 복사
COPY . .

# 프로덕션 빌드
RUN npm run build


###### Production Stage #####
FROM nginx:alpine
LABEL author="ditegym"

# 빌드된 파일을 nginx로 복사
COPY --from=build /app/dist /usr/share/nginx/html

# nginx 설정 복사
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf

# nginx 실행
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# ########################
# 빌드: docker build -t vuejs-crm:latest .
# 실행: docker run --rm -d -p 8080:80 --name vuejs-crm vuejs-crm:latest
# 또는: docker-compose up -d


