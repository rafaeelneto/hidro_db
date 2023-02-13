FROM node:12-alpine

WORKDIR /usr/src/app

RUN npm install -g nodemon

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]