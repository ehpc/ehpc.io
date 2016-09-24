#!/bin/sh

# Creating a shared volume for the "public" directory
docker volume create --name ehpc.io-public

# Building docker image
docker build -t ehpc.io .

# Killing old image
docker kill ehpc.io-run
docker rm ehpc.io-run

# Running
docker run -v ~/apps/volumes/ehpc.io-public:/usr/src/app/public -p 8081:3000 --restart=always -it -d --name ehpc.io-run ehpc.io
