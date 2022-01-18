#!/bin/sh
export network=$1
hh run --network localhost ./test/test-manager/setup-manager.ts
