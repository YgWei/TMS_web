###############################################################################
# Step 1 : Builder image
#
FROM node:10.14.2-alpine AS base
RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++ \
    && apk del build-dependencies

FROM base AS src
# Define working directory and copy source
WORKDIR /home/node/app
COPY ./package* ./
COPY ./yarn* ./
RUN yarn upgrade \
 && yarn install
 
COPY . .

RUN yarn run build

###############################################################################
# Step 2 : Run image
#
FROM base
ENV NODE_ENV=production
WORKDIR /home/node/app

COPY ./package* ./
RUN npm update \
 && npm install
 
# Copy builded source from the upper builder stage
COPY --from=src /home/node/app/dist ./dist
COPY .env .

# Start the app
CMD npm start
