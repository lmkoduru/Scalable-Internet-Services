#!/usr/bin/env python3
import json
import os
import random
import subprocess
import sys
import tempfile
import zipfile

AWS_ACCOUNT_ID = "671946291905"
AWS_PROFILE = "scalableinternetservices"
AWS_REGION = "us-west-2"

aws_username = None


def aws_command(command_args, **check_output_args):
    args = ["aws"] + command_args + ["--profile", AWS_PROFILE, "--region", AWS_REGION]
    print(f"Executing: {' '.join(args)}")
    output = subprocess.check_output(args, text=True, **check_output_args)
    result = json.loads(output)
    return result


def configure_api_gateway(function_arn):
    api_id = find_or_create_rest_api()
    arn = f"arn:aws:apigateway:{AWS_REGION}:lambda:path/2015-03-31/functions/{function_arn}/invocations"

    result = aws_command(["apigateway", "get-resources", "--rest-api-id", api_id])
    root_item = None
    proxy_item = None
    for item in result["items"]:
        if item["path"] == "/":
            root_item = item
        elif item["path"] == "/{proxy+}":
            proxy_item = item
        else:
            print("Need to delete path")

    if "resourceMethods" not in root_item:
        aws_command(
            [
                "apigateway",
                "put-method",
                "--authorization-type=NONE",
                "--http-method=ANY",
                "--resource-id",
                root_item["id"],
                "--rest-api-id",
                api_id,
            ]
        )
        configure_api_method(
            api_id=api_id, arn=arn, method_id=root_item["id"], method="ANY", path="/"
        )

    if not proxy_item:
        result = aws_command(
            [
                "apigateway",
                "create-resource",
                "--parent-id",
                root_item["id"],
                "--path-part={proxy+}",
                "--rest-api-id",
                api_id,
            ]
        )
        proxy_item = result

    if "resourceMethods" not in proxy_item:
        aws_command(
            [
                "apigateway",
                "put-method",
                "--authorization-type=NONE",
                "--http-method=ANY",
                "--resource-id",
                proxy_item["id"],
                "--rest-api-id",
                api_id,
            ]
        )

        configure_api_method(
            api_id=api_id, arn=arn, method_id=proxy_item["id"], method="ANY", path="/*"
        )

    aws_command(
        [
            "apigateway",
            "create-deployment",
            "--rest-api-id",
            api_id,
            "--stage-name=prod",
        ]
    )

    return f"https://{api_id}.execute-api.{AWS_REGION}.amazonaws.com/prod/"


def configure_api_method(api_id, arn, method_id, method, path):
    aws_command(
        [
            "apigateway",
            "put-integration",
            "--http-method",
            method,
            "--integration-http-method=POST",
            "--resource-id",
            method_id,
            "--rest-api-id",
            api_id,
            "--type=AWS_PROXY",
            "--uri",
            arn,
        ]
    )

    aws_command(
        [
            "lambda",
            "add-permission",
            "--action=lambda:InvokeFunction",
            "--function-name",
            aws_username,
            "--principal=apigateway.amazonaws.com",
            "--source-arn",
            f"arn:aws:execute-api:{AWS_REGION}:{AWS_ACCOUNT_ID}:{api_id}/*/*{path}",
            f"--statement-id=apigateway-test-{method_id}",
        ]
    )


def zip_add_directory(zip_fp, path):
    for item in sorted(os.listdir(path)):
        current_path = os.path.join(path, item)
        if os.path.isfile(current_path):
            zip_fp.write(current_path)
        else:
            zip_add_directory(zip_fp, current_path)


def create_or_update_lambda_function():
    with tempfile.NamedTemporaryFile(suffix=".zip") as fp:
        with zipfile.ZipFile(fp.name, "w") as zip_fp:
            zip_fp.write("function.rb")
            zip_add_directory(zip_fp, "vendor")

        try:
            result = aws_command(
                [
                    "lambda",
                    "create-function",
                    "--environment",
                    f"Variables={{JWT_SECRET={random.randint(0, 0xFFFFFF)}}}",
                    "--function-name",
                    aws_username,
                    "--handler=function.main",
                    "--role",
                    f"arn:aws:iam::{AWS_ACCOUNT_ID}:role/ScalableInternetServicesLambda",
                    "--runtime=ruby2.7",
                    "--zip",
                    f"fileb://{fp.name}",
                ],
                stderr=subprocess.DEVNULL,
            )
        except subprocess.CalledProcessError:
            result = aws_command(
                [
                    "lambda",
                    "update-function-code",
                    "--function-name",
                    aws_username,
                    "--zip",
                    f"fileb://{fp.name}",
                ]
            )
        return result["FunctionArn"]


def find_or_create_rest_api():
    result = aws_command(["apigateway", "get-rest-apis"])
    for item in result["items"]:
        if item["name"] == aws_username:
            return item["id"]
    result = aws_command(
        [
            "apigateway",
            "create-rest-api",
            "--endpoint-configuration=types=REGIONAL",
            "--name",
            aws_username,
        ]
    )
    return result["id"]


def main():
    global aws_username

    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} AWS_USERNAME")
        return 1

    aws_username = sys.argv[1]

    function_arn = create_or_update_lambda_function()
    print(configure_api_gateway(function_arn))
    return 0


if __name__ == "__main__":
    sys.exit(main())