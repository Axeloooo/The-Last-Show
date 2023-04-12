import uuid
import boto3
import json
import base64
import hashlib
import time
import requests
from requests_toolbelt.multipart import decoder


# Create the clients
ssm = boto3.client("ssm", "ca-central-1")
polly = boto3.client("polly", "ca-central-1")

# Create the resource of dynamodb
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("the-last-show-30145429")

# Create the credentials dictionary
credentials = {}


def get_parameters_by_path():
    """
    Get the parameters by path

    :param path: The path to get the parameters
    :return: The parameters
    """

    try:
        # Set the path
        path = "/"

        # Method from ssm client to get parameters by path
        response = ssm.get_parameters_by_path(
            Path=path, Recursive=True, WithDecryption=True)

        # Return the request payload with the parameters
        return response

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


def set_credentials(parameters):
    """
    Set the credentials

    :param parameters: The parameters
    :return: The credentials
    """

    try:
        # Set the credentials from SSM
        for parameter in parameters['Parameters']:
            credentials[parameter["Name"]] = parameter['Value']

        # Return the credentials
        return credentials

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


def create_query_string(body):
    """
    Create the query string

    :param dictionary: The body
    :return: The query string
    """

    try:
        # Create the query string
        query_string = ""

        # Loop through the body and create the query string
        for idx, (k, v) in enumerate(body.items()):
            query_string = f"{k}={v}" if idx == 0 else f"{query_string}&{k}={v}"

        # Return the query string
        return query_string

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


def sort_dictionary(dictionary, exclude):
    """
    Sort the dictionary

    :param dictionary: The dictionary
    :param exclude: The keys to exclude
    :return: The sorted dictionary
    """

    try:
        # Return the sorted dictionary
        return {k: v for k, v in sorted(dictionary.items(), key=lambda item: item[0]) if k not in exclude}

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


def create_signature(body):
    """
    Create the signature

    :param body: The body
    :return: The signature
    """

    try:
        # Create the signature
        exclude = ["api_key", "resource_type", "cloud_name"]
        sorted_body = sort_dictionary(body, exclude)
        query_string = create_query_string(sorted_body)

        # Create the query string
        query_string_appended = f"{query_string}{credentials['Cloudinary_API_Secret']}"

        signature = hashlib.sha1(query_string_appended.encode()).hexdigest()
        return signature

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


def upload_to_cloudinary(filename, resource_type):
    """
    Upload the obituary image or audio to Cloudinary

    :param filename: The filename
    :param resource_type: The resource type
    :return: The url
    """

    try:
        # Set the body
        body = {
            "api_key": credentials["Cloudinary_API_Key"],
        }

        # Set the files
        files = {
            "file": open(filename, "rb"),
        }

        # Set the timestamp
        timestamp = int(time.time())
        body["timestamp"] = timestamp

        # Create the signature
        body["signature"] = create_signature(body)

        # Http post request to Cloudinary
        url = f"https://api.cloudinary.com/v1_1/{credentials['Cloudinary_Cloud_Name']}/{resource_type}/upload"

        res = requests.post(url, data=body, files=files)
        return res.json()["url"]

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


def create_obituary_with_chatgpt(prompt):
    """
    Create an obituary with OpenAI's GPT-3 API

    :param prompt: The prompt
    :return: The obituary text
    """

    try:
        # Set the url, headers and body
        url = f"https://api.openai.com/v1/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {credentials['OpenAI_API_Key']}"
        }
        body = {
            "model": "text-curie-001",
            "prompt": prompt,
            "max_tokens": 600,
            "temperature": 0.2,
        }

        # Http post request to OpenAI's GPT-3 API
        response = requests.post(url, headers=headers, json=body)
        data = response.json()

        # Return the obituary text
        return data['choices'][0]['text']

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


def create_obituary_with_polly(text):
    """
    Create an obituary mp3 with Amazon Polly

    :param text: The obituary text
    :return: The obituary audio mp3
    """

    try:
        # Method from polly client to synthesize speech
        response = polly.synthesize_speech(
            Engine="standard",
            LanguageCode="en-US",
            Text=text,
            TextType="text",
            OutputFormat="mp3",
            VoiceId="Joanna"
        )

        # Write the audio stream to a file
        filename = "/tmp/obituary.mp3"
        with open(filename, "wb") as f:
            f.write(response['AudioStream'].read())

        # Return the audio stream
        return filename

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


def put_item_to_dynamodb(item):
    """
    Put an item to DynamoDB

    :param item: The item
    :return: The response
    """

    try:
        # Put an item to DynamoDB
        res = table.put_item(Item=item)

        # Return the response
        return res

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

    :param event: The event
    :param context: The context
    :return: JSON response with message or error
    """

    try:

        # Get the body
        body = event["body"]

        # Decode the body if it is base64 encoded
        if event["isBase64Encoded"]:
            body = base64.b64decode(body)

        # Decode the body
        content_type = event["headers"]["content-type"]
        data = decoder.MultipartDecoder(body, content_type)

        # Get the binary data
        binary_data = [part.content for part in data.parts]
        name = binary_data[1].decode()
        born_year = binary_data[2].decode()
        died_year = binary_data[3].decode()

        # Write the image to a file
        filename = "/tmp/obituary.png"
        with open(filename, "wb") as f:
            f.write(binary_data[0])

        # Get the SSM parameters
        parameters = get_parameters_by_path()

        # Set the credentials from SSM
        _ = set_credentials(parameters)

        # Create the prompt
        prompt = f"Write an obituary about a fictional character named {name} who was born on {born_year} and died on {died_year}."

        # Create the obituary with OpenAI's GPT-3 API
        obituary_text = create_obituary_with_chatgpt(prompt)

        # Create the obituary audio with Amazon Polly
        obituary_audio = create_obituary_with_polly(obituary_text)

        # Upload the obituary image to Cloudinary
        obituary_image_url = upload_to_cloudinary(filename, "image")
        print(obituary_image_url)

        # Upload the obituary audio to Cloudinary
        obituary_audio_url = upload_to_cloudinary(obituary_audio, "video")
        print(obituary_audio_url)

        # Generate a random id
        id = uuid.uuid4()
        print(str(id))

        # Create item for DynamoDB
        item = {
            "id": str(id),
            "obituary_image_url": obituary_image_url,
            "obituary_audio_url": obituary_audio_url,
            "obituary_text": obituary_text,
        }

        # Put the item to DynamoDB
        _ = put_item_to_dynamodb(item)

        # Return a status code 200 if everything is OK
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps(item)
        }

    except Exception as e:
        # Print the error in CloudWatch
        print(e)

        # Return an status code 500 if there is an error
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "error": str(e)
            })
        }
