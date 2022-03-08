FROM node:16

ENV NODE_VERSION 16.14.0


# Install dependencies 

RUN apt-get update && apt-get install --assume-yes git python make g++

RUN mkdir -p /app
WORKDIR /app