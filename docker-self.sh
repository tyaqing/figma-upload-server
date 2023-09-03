DOCKER_TAG='latest'
DOCKER_IMAGE_NAME='figma-upload-server'
DOCKER_REGISTRY='hkccr.ccs.tencentyun.com'
DOCKER_NAMESPACE='yakir-namespace'

docker build -t ${DOCKER_IMAGE_NAME}:${DOCKER_TAG} .  --platform linux/amd64

# if ONLY_BUILD not set , push image to registry
if [ -z ${ONLY_BUILD} ]; then
    docker tag ${DOCKER_IMAGE_NAME}:${DOCKER_TAG} ${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/${DOCKER_IMAGE_NAME}:${DOCKER_TAG}
    docker push ${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/${DOCKER_IMAGE_NAME}:${DOCKER_TAG}
fi
