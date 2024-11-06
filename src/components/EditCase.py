import logging
import azure.functions as func
import json
from azure.cosmos import CosmosClient

# Your credentials and configuration
COSMOS_ENDPOINT = "your_cosmos_endpoint_here"
COSMOS_KEY = "your_cosmos_key_here"
DATABASE_NAME = "your_database_name"
CONTAINER_NAME = "your_container_name"

app = func.FunctionApp()

@app.function_name(name="EditIncident")
@app.route(route="/api/edit_incident", auth_level=func.AuthLevel.FUNCTION, methods=["POST"])
def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    try:
        req_body = req.get_json()
        incident_id = req_body.get('incID')
        update_fields = req_body.get('editFields')

        if not incident_id or not update_fields:
            return func.HttpResponse(
                "Please pass incidentId and updateFields in the request body",
                status_code=400
            )

        # Initialize the Cosmos Client
        endpoint = "YOUR_COSMOS_ENDPOINT"
        key = "YOUR_COSMOS_KEY"
        client = CosmosClient(COSMOS_ENDPOINT, COSMOS_KEY)

        # Get database and container
        database = client.get_database_client(DATABASE_NAME)
        container = database.get_container_client(CONTAINER_NAME)

        # Query for the document
        query = f"SELECT * FROM c WHERE c.id = '{incident_id}'"
        items = list(container.query_items(query=query, enable_cross_partition_query=True))

        if not items:
            return func.HttpResponse(
                f"No incident found with ID: {incident_id}",
                status_code=404
            )

        # Get the document
        doc = items[0]

        # Update the specified fields
        for field, value in update_fields.items():
            doc[field] = value

        # Replace the document
        container.replace_item(item=doc, body=doc)

        return func.HttpResponse(
            json.dumps({"message": "Document updated successfully", "document": doc}),
            mimetype="application/json",
            status_code=200
        )

    except Exception as e:
        logging.error(f"Error: {str(e)}")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500
        )