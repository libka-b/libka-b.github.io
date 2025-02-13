FROM femtopixel/eleventy

WORKDIR /app

COPY . /app

RUN npm install -y

EXPOSE 8080
