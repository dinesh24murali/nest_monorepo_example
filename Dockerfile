FROM node:20-alpine AS builder

RUN corepack enable

# Create app directory
WORKDIR /app

RUN mkdir -p ./packages/api
RUN mkdir -p ./packages/kafka-connect

# Since this project is a mono repo and the api project is using the kafka-connect project
# as a dependency we have to copy both the project's package.json files
COPY packages/api/package.json ./packages/api/

COPY packages/kafka-connect/package.json ./packages/kafka-connect/
COPY packages/kafka-connect/dist ./packages/kafka-connect/dist

# Copy only the Yarn configuration files and workspaces first
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ .yarn/
COPY .pnp.cjs .pnp.loader.mjs ./

# Install app dependencies
RUN yarn install --immutable

COPY . .

RUN yarn api build

FROM node:20-alpine

RUN corepack enable

RUN mkdir -p ./packages/api

COPY --from=builder /app/.yarn ./.yarn
COPY --from=builder /app/packages/api/package.json ./packages/api
COPY --from=builder /app/packages/api/dist ./packages/api/dist

COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD [ "yarn", "workspace", "@ct-pod/api", "start:prod" ]
