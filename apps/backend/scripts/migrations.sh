#!/bin/sh


set -e

node dist/utils/migrations.js $1
