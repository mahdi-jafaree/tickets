#!/bin/sh
concurrently -k --prefix "{time} | {name} |" -t "HH:mm:ss.SSS" \
  -n "backend    ,frontend   " \
  -c "blue,yellow,green" \
  "pnpm --filter=backend dev" \
  "pnpm --filter=frontend dev"
