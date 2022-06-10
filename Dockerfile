FROM node:16.13.2

WORKDIR /app

ENV PORT=80
ENV NODE_ENV=production

COPY package*.json ./

RUN npm install


COPY . .

RUN npm run build
RUN npm run set-db

EXPOSE 80

CMD ["npm", "start"]