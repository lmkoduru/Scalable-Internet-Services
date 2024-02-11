#!/usr/bin/env python3
import json
import os
import random
import subprocess
import sys
import tempfile
import zipfile

AWS_PROFILE = "scalableinternetservices"
AWS_REGION = "us-west-2"

aws_username = None


def aws_command(command_args, parse_output=True):
    args = ["aws"] + command_args + ["--profile", AWS_PROFILE, "--region", AWS_REGION]
    print(f"Executing: {' '.join(args)}")
    output = subprocess.check_output(args, stderr=subprocess.DEVNULL, text=True)
    if not parse_output:
        return
    result = json.loads(output)
    return result


def destroy_lambda():
    try:
        aws_command(
            ["lambda", "delete-function", "--function-name", aws_username],
            parse_output=False,
        )
    except subprocess.CalledProcessError:
        pass


def destroy_rest_api():
    api_id = None
    result = aws_command(["apigateway", "get-rest-apis"])
    for item in result["items"]:
        if item["name"] == aws_username:
            api_id = item["id"]
            break
    else:
        return

    aws_command(
        ["apigateway", "delete-rest-api", "--rest-api-id", api_id], parse_output=False
    )


def main():
    global aws_username

    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} AWS_USERNAME")
        return 1

    aws_username = sys.argv[1]

    destroy_rest_api()
    destroy_lambda()
    return 0


if __name__ == "__main__":
    sys.exit(main())