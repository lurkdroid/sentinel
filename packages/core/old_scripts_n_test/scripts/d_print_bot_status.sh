#!/bin/sh
echo 'd_print_bot_status'
export bot_address=$1
hh run --network matic ./scripts/d_print_bot_status.ts
