FROM node:22-alpine AS runner

WORKDIR brother

RUN corepack enable
RUN corepack prepare pnpm@10.24.0 --activate

RUN apk add --update --no-cache python3
RUN ln -sf python3 /usr/bin/python
RUN apk --no-cache add git
RUN apk --no-cache add curl

COPY ./package*.json ./
COPY ./pnpm-workspace.yaml ./
COPY ./pnpm-lock.yaml ./
COPY ./apps/backend/package.json ./apps/backend/package.json

RUN pnpm install --frozen-lockfile

COPY ./apps/backend ./apps/backend



WORKDIR /brother/apps/backend

RUN curl https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem -o rds-ca.pem

RUN pnpm build

EXPOSE 3000

ENTRYPOINT [ "node","dist/server.js" ]
