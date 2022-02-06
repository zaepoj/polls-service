FROM mhart/alpine-node:11

WORKDIR /usr/src/app

COPY package.json package.json

RUN npm install

COPY . .

ENV NODE_ENV production

RUN npm run build

CMD ["node", "dist/index.js"]