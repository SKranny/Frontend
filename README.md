# Run without docker

Скачиваем NodeJs под свою машину:
```
https://nodejs.org/en/download/
```
После скачивания и установки у нас появляется менеджер пакетов npm.
Запускаем команду от него в корневой директории фронта
```
npm install --force
```
После загрузки зависимостей исполняем команду ниже, для того что бы запустить фронт в 
режиме разработки на 80 порту
```
npm run serve -- --port 80
```

# javapro-belov-front

```bash
docker run -d -p 8099:80 -p 8098:80 -p 8097:80 belov38/javapro-skillbox:$VERSION-arm
```

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### Docker Build
```
docker build -t skillgroup25/frontend .
```

### Docker push
```
docker push skillgroup25/frontend:latest

```### Docker stop and rm
```
### Docker stop and rm
```
docker stop frontend-alpha && docker rm frontend-alpha
```
### Docker stop and rm and start
```
docker stop frontend-alpha && docker rm frontend-alpha && docker run -d --name frontend-alpha -p 8099:80 -p 8098:80 -p 8097:80 skillgroup25/frontend:latest
```
### Docker sh
```
#!/bin/bash
echo "Begin restart front";
echo "Stop docker front";
docker stop frontend-alpha;
echo "rm docker front";
docker rm frontend-alpha;
echo "Pull image";
docker image pull skillgroup25/frontend:latest;
echo "Start new docker front";
docker run -d --name frontend-alpha -p 8099:80 -p 8098:80 -p 8097:80 skillgroup25/frontend:latest
```
