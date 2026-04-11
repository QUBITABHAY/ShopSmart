FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.js ./
RUN npm install

COPY . ./

RUN npx prisma generate

ENV NODE_ENV=production
EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
