terraform {
  required_providers {
    aws = {
      version = ">= 4.0.0"
      source  = "hashicorp/aws"
    }
  }
}

provider "aws" {
  region = "ca-central-1"
}

# two lambda functions w/ function url
# one dynamodb table
# roles and policies as needed
# step functions (if you're going for the bonus marks)

locals {
  bucket_name               = "the-last-show-30145429"
  table_name                = "the-last-show-30145429"
  get_function_name         = "get-obituaries-30151330"
  create_function_name      = "create-obituary-30151330"
  handler_name              = "main.lambda_handler"
  artifact_name             = "artifact.zip"
  get_obituaries_directory  = "../functions/get-obituaries"
  create_obituary_directory = "../functions/create-obituary"
}

# resource "aws_s3_bucket" "obituaries" {
#   bucket = local.bucket_name
# }

resource "aws_dynamodb_table" "obituaries" {
  name         = local.table_name
  billing_mode = "PROVISIONED"

  read_capacity  = 1
  write_capacity = 1

  hash_key = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_iam_role" "lambda_role" {
  name               = "role-for-lambda"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_policy" "lambda_policy" {
  name        = "policy-for-lambda"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "dynamodb:Scan",
        "dynamodb:PutItem"
      ],
      "Resource": [
        "arn:aws:logs:*:*:*",
        "${aws_dynamodb_table.obituaries.arn}"
      ],
      "Effect": "Allow"
    },
    {
      "Action": [
        "polly:SynthesizeSpeech"
      ],
      "Resource": "*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

resource "aws_iam_role_policy_attachment" "ssm_read_only" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess"
}

data "archive_file" "get_obituaries" {
  type        = "zip"
  source_dir  = local.get_obituaries_directory
  output_path = "${local.get_obituaries_directory}/${local.artifact_name}"
}

data "archive_file" "create_obituary" {
  type        = "zip"
  source_dir  = local.create_obituary_directory
  output_path = "${local.create_obituary_directory}/${local.artifact_name}"
}

resource "aws_lambda_function" "get_obituaries" {
  role             = aws_iam_role.lambda_role.arn
  function_name    = local.get_function_name
  handler          = local.handler_name
  filename         = "${local.get_obituaries_directory}/${local.artifact_name}"
  source_code_hash = data.archive_file.get_obituaries.output_base64sha256
  runtime          = "python3.9"
  timeout          = 20
}

resource "aws_lambda_function" "create_obituary" {
  role             = aws_iam_role.lambda_role.arn
  function_name    = local.create_function_name
  handler          = local.handler_name
  filename         = "${local.create_obituary_directory}/${local.artifact_name}"
  source_code_hash = data.archive_file.create_obituary.output_base64sha256
  runtime          = "python3.9"
  timeout          = 20
}

resource "aws_lambda_function_url" "get_obituaries" {
  function_name      = aws_lambda_function.get_obituaries.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["GET"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

resource "aws_lambda_function_url" "create_obituary" {
  function_name      = aws_lambda_function.create_obituary.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["PUT"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

# output "s3_bucket_name" {
#   value = aws_s3_bucket.obituaries.bucket
# }

output "dynamodb_table_name" {
  value = aws_dynamodb_table.obituaries.name
}

output "lambda_get_obituaries_url" {
  value = aws_lambda_function_url.get_obituaries.function_url
}

output "lambda_create_obituary_url" {
  value = aws_lambda_function_url.create_obituary.function_url
}
