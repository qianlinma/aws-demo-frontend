# Demo Frontend

最小前端页面，只调用后端 `/api/getAllProducts` 并展示返回的 `products`。

当前 Dockerfile 使用 Nginx 托管静态页面，并通过 nginx.conf 把 `/api/` 请求代理到后端 ALB。
