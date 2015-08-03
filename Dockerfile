FROM centos:7

MAINTAINER Juan Marin Otero <juan.marin.otero@gmail.com>

RUN yum -y install epel-release
RUN yum -y install nginx

# Enable EPEL for Node.js
# RUN rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm

# Install npm
RUN yum install -y npm

# Install grunt-cli
RUN npm install -g grunt-cli

COPY . /

RUN npm install

# Get node-sass to work
RUN node ./node_modules/grunt-sass/node_modules/node-sass/scripts/install.js;

RUN grunt build

# grunt builds to dist
ADD dist /opt/grasshopper-ui/

RUN rm -v /etc/nginx/nginx.conf
ADD nginx/nginx.conf /etc/nginx/nginx.conf

# Append "daemon off" to the beginning of the configuration
RUN echo "daemon off;" >> /etc/nginx/nginx.conf

EXPOSE 80

CMD /usr/sbin/nginx