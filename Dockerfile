FROM nginx:alpine

LABEL author="ditegym"

# 로컬에서 빌드된 dist만 복사
COPY dist /usr/share/nginx/html

# nginx 설정
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
