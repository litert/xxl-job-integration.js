#!/usr/bin/env bash
SCRIPT_ROOT=$(cd $(dirname $0); pwd)

cd $SCRIPT_ROOT

source .env

curl "https://raw.githubusercontent.com/xuxueli/xxl-job/refs/heads/$XXL_JOB_ADMIN_VERSION-release/doc/db/tables_xxl_job.sql" \
    -o./tables_xxl_job.sql
