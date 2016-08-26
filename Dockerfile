FROM centos:7
MAINTAINER Juan Marin Otero <juan.marin.otero@gmail.com>

ARG GRASSHOPPER_PORT=31010

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
COPY nginx/nginx.conf /etc/nginx/nginx.conf

RUN npm cache clean; npm install && \
    npm rebuild node-sass && \
    grunt build && \
    sed -i.bak s/{{GRASSHOPPER_PORT}}/${GRASSHOPPER_PORT}/ /etc/nginx/nginx.conf && \
    rm /etc/nginx/nginx.conf.bak && \
    echo "grasshopper port set to ${GRASSHOPPER_PORT}"

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
