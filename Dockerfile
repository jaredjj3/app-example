FROM node:16

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn

COPY tsconfig.json .
COPY jest.config.js .
COPY src src

CMD [ "yarn", "test" ]