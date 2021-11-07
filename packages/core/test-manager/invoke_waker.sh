#!/bin/sh
export network=$1
hh run --network localhost ./test-manager/invoke_waker.ts
