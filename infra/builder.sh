#!/bin/sh
echo "-= Image Builder =-"

load_dev_env () {
    PWD_ENV=$PWD/dev
    . $PWD_ENV/sru-env.development.env
     echo "Using 🟢🟢🟢 $INFRA_STACK_NAME"
}

run_bot_ai_builder () {
    echo "> Running api builder"
    . dev/build-api-bot.sh
}

run_restart_bot_ai (){
    echo "> Restarting bot-ai"
    . scripts/restart-bot-ai.sh
}

run_build_stack () {
    echo "> Build stack"
    . dev/build-stack.sh
    . scripts/restart-stack.sh
}


_PARAM_TARGET=$1

case $_PARAM_TARGET in
  "bot-ai:dev") load_dev_env && run_bot_ai_builder;;
  "restart:dev") load_dev_env && run_restart_bot_ai;;
  "build:stack") load_dev_env && run_build_stack;
esac
