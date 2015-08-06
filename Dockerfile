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

# Get node-sass to work
RUN node ./node_modules/grunt-sass/node_modules/node-sass/scripts/install.js;

RUN grunt build

RUN rm -v /etc/nginx/nginx.conf
ADD nginx/nginx.conf /etc/nginx/nginx.conf

# Append "daemon off" to the beginning of the configuration
RUN echo "daemon off;" >> /etc/nginx/nginx.conf

EXPOSE 80

CMD /usr/sbin/nginx