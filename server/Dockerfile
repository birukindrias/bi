FROM node:16.15.0-alpine3.14 AS development

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn add glob rimraf

RUN yarn install

COPY . .

RUN yarn build

FROM node:16.15.0-alpine3.14 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install --prod

COPY . .

COPY ../wait-for-it.sh ./

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
#CMD ["./wait-for-it.sh", "postgres:5432", "--", "node", "dist/main"]
