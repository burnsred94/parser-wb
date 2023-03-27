#!/bin/bash

if [ -z ${INFRA_API_IMAGE_TAG+x} ];
then echo "env not provided; do not call this script directly."; exit;
fi

BUILD_TAG=${BUILD_TAG:-$INFRA_API_IMAGE_TAG}
echo "🔄 Restart stack"

docker-compose  --env-file \
    ${INFRA_API_PATH_ENV}\
    restart