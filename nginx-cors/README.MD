1. Исправть ip в nginx.conf
2. Собрать образ.

```shell
docker build . -t nginx-cors
docker run -p 80:80 nginx-cors
```

3. Открыть в браузере
   http://localhost
