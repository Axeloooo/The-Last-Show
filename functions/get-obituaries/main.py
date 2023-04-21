# add your get-obituaries function here

import boto3
import json


# Create the resource of dynamodb
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("the-last-show-30145429")


def fetch_all_items():
    """
    Fetch all the items in the dynamoDB table

    :return: list of items in the table
    """
    try:
        # Create an empty list
        items = []

        # Scan the dynamoDB table
        response = table.scan()

        # Add the items to the list
        items.extend(response['Items'])

        # Return the items in the table
        return items

    except Exception as e:
        # Print the error
        print(e)

        # Return the error
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "Error": str(e)
            })
        }


def lambda_handler(event, context):
    """
    Lambda handler

    :param event: event
    :param context: context
    :return: items in the table
    """
    try:
        # Fetch all the items in the dynamoDB table
        data = fetch_all_items()

        # Return the items in the table
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps(data)
        }

    except Exception as e:
        # Print the error
        print(e)

        # Return the error
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "Error": str(e)
            })
        }
