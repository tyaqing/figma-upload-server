docker build -t figma-upload-server:latest .  --platform linux/amd64
docker tag figma-upload-server:latest yakirteng/figma-upload-server:latest
docker push yakirteng/figma-upload-server:latest
