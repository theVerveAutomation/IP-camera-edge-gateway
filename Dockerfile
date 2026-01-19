FROM node:22-alpine

WORKDIR /usr/src/app

# Install ffmpeg (alpine package) and then install node deps
RUN apk add --no-cache ffmpeg

COPY package*.json ./
RUN npm install 

COPY . .

CMD ["node", "src/index.js"]