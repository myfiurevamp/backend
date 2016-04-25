FROM abiskop/node-v4.2.x:master
MAINTAINER Alastair Paragas "alastairparagas@gmail.com"

ADD environment/install.sh /tmp/install.sh
RUN bash /tmp/install.sh

VOLUME /source
VOLUME /statEngine
EXPOSE 8000