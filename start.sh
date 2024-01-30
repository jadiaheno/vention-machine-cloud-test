#!/bin/bash
./start-database.sh
bun run db:migrate
bun run dev