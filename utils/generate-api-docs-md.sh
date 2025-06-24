#!/usr/bin/env bash
SCRIPT_ROOT=$(cd $(dirname $0); pwd)

cd $SCRIPT_ROOT/..

API_DOC_OUTPUT_DIR=docs/en-us/api
SRC_DIR=src/lib

rm -rf $API_DOC_OUTPUT_DIR

npx typedoc \
    --exclude "**/*+(index|.test).ts" \
    --out api \
    --readme none \
    --name "Documents for @litert/xxl-job-integration" \
    --plugin typedoc-plugin-markdown \
    --plugin typedoc-vitepress-theme \
    --plugin typedoc-plugin-no-inherit \
    --sourceLinkTemplate "https://github.com/litert/xxl-job-integration.js/blob/master/{path}#L{line}" \
    $SRC_DIR/Executor/Executor.ts \
    $SRC_DIR/Executor/Typings.ts \
    $SRC_DIR/AdminApiClient.ts \
    $SRC_DIR/Constants.ts \
    $SRC_DIR/Errors.ts \
    $SRC_DIR/RegisterAgent.ts \
    $SRC_DIR/JobRunner/Bean.ts \
    $SRC_DIR/JobRunner/NodeJsInProcess.ts \
    $SRC_DIR/Listener/Fastify.ts \
    $SRC_DIR/Listener/NodeHttp.ts \
    $SRC_DIR/LogManagers/FileLogManager.ts \
    $SRC_DIR/LogManagers/MemoryLogManager.ts

mv api $API_DOC_OUTPUT_DIR
