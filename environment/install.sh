# Install CasperJS and PhantomJS
apt-get update -qq
apt-get install -y -qq libsqlite3-dev libfontconfig1-dev libicu-dev libfreetype6 libssl-dev \
      libpng-dev libjpeg-dev python libx11-dev libxext-dev clang libc++-dev libpq-dev

# Libpqxxx - PGSQL Client for C++
wget http://pqxx.org/download/software/libpqxx/libpqxx-4.0.tar.gz
tar xvfz libpqxx-4.0.tar.gz
cd libpqxx-4.0
./configure
make
make install
cd ..

npm install -g casperjs
npm install -g phantomjs

apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
