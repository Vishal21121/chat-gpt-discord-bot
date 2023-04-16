FROM node:19-slim
WORKDIR /app
COPY . /app
ENV TOKEN = ""
ENV clientId = ""
ENV guildId = ""
ENV OPENAI_API_KEY = ""
RUN npm install 
EXPOSE 3000
CMD node deploy-commands.js && npm start 
