FROM centos:7

MAINTAINER Juan Marin Otero <juan.marin.otero@gmail.com>

RUN yum -y install epel-release
RUN yum -y install nginx

ADD dist /opt/grasshopper-ui/

RUN rm -v /etc/nginx/nginx.conf
ADD nginx/nginx.conf /etc/nginx/nginx.conf

# Append "daemon off" to the beginning of the configuration
RUN echo "daemon off;" >> /etc/nginx/nginx.conf

EXPOSE 80

CMD /usr/sbin/nginx


