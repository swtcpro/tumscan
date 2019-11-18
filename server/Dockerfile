#制定node镜像的版本
FROM node:8.9-alpine
#声明作者
MAINTAINER tracy4262
RUN rm -f /etc/localtime \
&& ln -sv /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
&& echo "Asia/Shanghai" > /etc/timezone
#移动当前目录下面的文件到app目录下
ADD . /app/
#进入到app目录下面，类似cd
WORKDIR /app
#对外暴露的端口
EXPOSE 8080
#程序启动脚本
CMD npm run start
