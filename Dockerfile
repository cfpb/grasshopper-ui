FROM centos:7
MAINTAINER Juan Marin Otero <juan.marin.otero@gmail.com>

RUN yum -y install epel-release
RUN yum -y install nginx

# Install npm
RUN curl --silent --location https://rpm.nodesource.com/setup | bash -
RUN yum -y install nodejs

RUN mkdir -p /usr/src/app

# Install grunt-cli
RUN npm install -g grunt-cli

WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm cache clean; npm install
RUN npm rebuild node-sass

RUN grunt build

COPY nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]