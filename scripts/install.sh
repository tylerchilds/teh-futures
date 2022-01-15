#!/bin/sh
deno cache --lock=lock.json --lock-write public/editor.js
deno cache --lock=lock.json --lock-write server.js
