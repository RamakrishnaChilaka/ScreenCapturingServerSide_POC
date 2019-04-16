import logging
import boto3
from botocore.exceptions import ClientError
from pymongo import MongoClient
import os

ACCESS_KEY = "fsgdhf"
SECRET_KEY = "asdfgdf"


def upload_file(file_name, bucket, object_name=None):
    """Upload a file to an S3 bucket

    :param file_name: File to upload
    :param bucket: Bucket to upload to
    :param object_name: S3 object name. If not specified then same as file_name
    :return: True if file was uploaded, else False
    """

    # If S3 object_name was not specified, use file_name
    if object_name is None:
        object_name = file_name

    # Upload the file
    s3_client = boto3.client(
        's3',
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET_KEY,
        region_name='us-east-1',
    )
    bucket_location = s3_client.get_bucket_location(Bucket=bucket)
    try:
        s3_client.upload_file(file_name, bucket, object_name, ExtraArgs={'ACL':'public-read'})
        object_url = "https://s3.amazonaws.com/{0}/{1}".format(
            bucket,
            object_name
        )
        logging.info("object url is " + object_url)
    except ClientError as e:
        logging.error(e)
        return False
    return True

def store_in_db():
    client = MongoClient('mongodb://localhost:27017/') 
    # using mongodb uri
    db = client.test_database 
    # using test_database, change this
    collection = db['test-collection']
    data = {}
    data['abcd'] = "def"
    collection.insert_one(data)



def main():
    """Exercise upload_file()"""

    bucket_name = 'abhinav-test-nfer'
    file_name = '../node/uploads/testm.webm'
    object_name = 'abhinav.webm'

    logging.basicConfig(level=logging.DEBUG,
                        format='%(levelname)s: %(asctime)s: %(message)s')

    # Upload a file
    response = upload_file(file_name, bucket_name, object_name)
    if response:
        logging.info('File was uploaded')
        # store_in_db()
    # 1) need userId
    # 2) make this recursive until upload succeeds
    # 3) clean up the video
    os.remove(file_name) 
    print("File Removed!")
    


if __name__ == '__main__':
    main()