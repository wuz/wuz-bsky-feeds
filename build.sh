#!/usr/bin/env bash

set -o errexit
set -o nounset

corepack enable

corepack prepare yarn --activate

yarn install --immutable

yarn run build
