#!/bin/sh -

sh -c "git config --global --add safe.directory $PWD"

if [ ! -d node_modules ]
then
  echo "[Installing dependencies...]"
  pnpm install
fi

exec "$@"
