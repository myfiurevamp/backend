# Install CasperJS and PhantomJS
apt-get update -qq
apt-get install -y -qq libsqlite3-dev libfontconfig1-dev libicu-dev libfreetype6 libssl-dev \
      libpng-dev libjpeg-dev python libx11-dev libxext-dev

npm install -g casperjs
npm install -g phantomjs

apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*