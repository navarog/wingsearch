FROM node:14.17.4 as build-stage
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "start", "--", "--port=8080", "--host=0.0.0.0", "--watch"]
