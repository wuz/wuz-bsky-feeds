#!/usr/bin/env bash

set -o errexit
set -o nounset

corepack enable yarn

yarn install --immutable

yarn run build
