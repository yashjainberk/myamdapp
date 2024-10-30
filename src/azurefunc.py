import azure.functions as func
import logging
from azure.storage.blob import BlobServiceClient
import json

app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)

@app.route(route="amd_testing")
def amd_testing(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request!!')

    container_name = "subpoenas"

    if not container_name:
        try:
            req_body = req.get_json()
        except ValueError:
            return func.HttpResponse(
                "Please provide container name in request body",
                status_code=400
            )
        else:
            container_name = req_body.get('containerName')

    # Connection string to access your Azure Storage account
    connection_string = "DefaultEndpointsProtocol=https;AccountName=amdupsynctest;AccountKey=DqRdKcB819DWBdjxb3P5OnXRr51fP2GDuYKoxwcae7dK5rxmxuI0ZL+RmoyDHksZ2knLY2I5Cx5u+AStX1wChA==;EndpointSuffix=core.windows.net"
    
    # Create BlobServiceClient to interact with the storage account
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    container_client = blob_service_client.get_container_client(container_name)
    
    # List blobs in the container to retrieve the folder structure and files
    blob_list = container_client.list_blobs()

    # Organize blobs into folders and capture file creation times
    folders = {}
    for blob in blob_list:
        folder = blob.name.split('/')[0]  # Get the first part (folder name)
        file_info = {
            "file_name": blob.name,
            "created_on": blob.creation_time.isoformat() if blob.creation_time else "Unknown"
        }
        if folder not in folders:
            folders[folder] = {
                "files": [],
                "folder_creation_time": file_info["created_on"]  # Initially set to the first file's creation time
            }
        folders[folder]["files"].append(file_info)
        
        # Update the folder creation time if the current file is older
        if blob.creation_time and folders[folder]["folder_creation_time"] != "Unknown":
            folder_creation_time = folders[folder]["folder_creation_time"]
            if folder_creation_time == "Unknown" or blob.creation_time.isoformat() < folder_creation_time:
                folders[folder]["folder_creation_time"] = blob.creation_time.isoformat()

    # Convert the folder structure to JSON format for the response
    folder_structure_json = json.dumps({"folders": folders})

    # Return the folder structure as the HTTP response
    return func.HttpResponse(
        folder_structure_json,
        mimetype="application/json",
        status_code=200
    )
