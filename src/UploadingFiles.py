import os
from azure.storage.blob import BlobServiceClient

connection_string = "DefaultEndpointsProtocol=https;AccountName=dvuemoresa;AccountKey=ycGfmw7a27G0f0NIxDxK+6S3Gpq9xGHeFCFvsosiZgyC11MCPNyjdX0F9vhjwGWS831ZVPzl5Yus+AStHhaTdg==;EndpointSuffix=core.windows.net"
blob_service_client = BlobServiceClient.from_connection_string(connection_string)
container_name = "my-container"
container_client = blob_service_client.get_container_client(container_name)

if not container_client.exists():
    blob_service_client.create_container(container_name)

root_directory = "ENTER DIRECTORY"

def upload_directory_to_blob(container_client, local_directory, blob_prefix=""):
    for root, dirs, files in os.walk(local_directory):
        for file in files:
            file_path = os.path.join(root, file)
            relative_path = os.path.relpath(file_path, local_directory)
            blob_path = os.path.join(blob_prefix, relative_path).replace("\\", "/")  

            print(f"Uploading {file_path} to {blob_path}")
            blob_client = container_client.get_blob_client(blob_path)
            with open(file_path, "rb") as data:
                blob_client.upload_blob(data, overwrite=True) 

upload_directory_to_blob(container_client, root_directory)
