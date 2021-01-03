#!/bin/bash

cd $(dirname $0)

deno run --allow-net --allow-read --allow-write --unstable index.ts
