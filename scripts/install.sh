#!/bin/sh
deno cache --lock=client.lock.json --lock-write public/editor.js
deno cache --lock=server.lock.json --lock-write server.js
