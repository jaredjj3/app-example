FROM node:16

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn

COPY tsconfig.json .
COPY src src

CMD [ "yarn", "jest", "--watchAll" ]