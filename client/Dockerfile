FROM node:16.15.0-alpine3.14 AS development

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn add glob rimraf

RUN yarn install

COPY . .

EXPOSE 3002

CMD ["yarn", "dev"]

# FROM node:16.15.0-alpine3.14 as production


# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm install --only=production

# COPY . .

# RUN npm run build

# EXPOSE 3002
