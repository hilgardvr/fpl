from node:16-alpine3.14

workdir /usr/src/app

copy . .

cmd ["node", "app.js"]
