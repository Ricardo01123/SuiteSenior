FROM centos:latest

MAINTAINER Name Here <username@localhost>

RUN rpm -Uvh http://mirror.pnl.gov/epel/7/x86_64/e/epel-release-7-5.noarch.rpm

RUN yum install nodejs npm -y 

COPY ./src /opt/src

RUN cd /opt/src; npm install

EXPOSE 8080

CMD ["node", "/opt/src/index.js"]