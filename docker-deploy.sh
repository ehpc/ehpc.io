#!/bin/sh

git pull
docker build -t ehpc.io .
docker kill ehpc.io.run
docker rm ehpc.io.run
docker run --restart=always -d -p 8081:3000 --name ehpc.io.run ehpc.io

