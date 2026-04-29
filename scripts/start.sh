#!/bin/sh
concurrently -k --prefix "{time} | {name} |" -t "HH:mm:ss.SSS" \
  -n "backend ,admin   " \
  -c "blue,yellow,green" \
  "pnpm --filter=backend dev" \
  "pnpm --filter=admin dev"
