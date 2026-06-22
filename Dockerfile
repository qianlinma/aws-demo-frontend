FROM nginx:1.27-alpine

# 拷贝最小前端静态文件到 Nginx 默认站点目录。
COPY index.html /usr/share/nginx/html/index.html
COPY styles.css /usr/share/nginx/html/styles.css
COPY app.js /usr/share/nginx/html/app.js

# 使用自定义 Nginx 配置模板。
# 官方 Nginx image 启动时会把环境变量替换进 /etc/nginx/templates/*.template。
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 80
