import os

from storages.backends.s3boto3 import S3Boto3Storage


class S3StaticStorage(S3Boto3Storage):
    querystring_auth = False
    bucket_name = '%s-assets' % os.environ.get('S3_BUCKET_NAME')
    preload_metadata = True


class S3MediaStorage(S3Boto3Storage):
    bucket_name = '%s-media' % os.environ.get('S3_BUCKET_NAME')
    default_acl = 'private'
