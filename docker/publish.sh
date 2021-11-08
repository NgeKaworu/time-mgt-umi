#!/bin/bash
set -e

docker build -f ./Dockerfile -t ngekaworu/time-mgt-umi ..;
docker push ngekaworu/time-mgt-umi;