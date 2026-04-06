FROM node:22-alpine AS client-build

WORKDIR /build/client

COPY client/package*.json ./
RUN npm ci

COPY client/ ./
RUN npm run build

FROM node:22-alpine AS server-build

WORKDIR /build/server

COPY server/package*.json ./
RUN npm ci

COPY server/ ./

FROM node:22-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY --from=server-build /build/server/ ./
COPY --from=client-build /build/client/dist ./client-dist

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
