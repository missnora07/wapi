FROM quay.io/souravkl11/rgnk-v3:latest
RUN git clone https://github.com/souravkl11/raganork-md /railway/Raganork
WORKDIR /railway/Raganork
ENV TZ=Asia/Kolkata
RUN yarn install --network-concurrency 1
RUN yarn add express
CMD ["node", "index.js"]
WORKDIR /railway/Raganork/plugins
CMD ["node", "server.js"]
