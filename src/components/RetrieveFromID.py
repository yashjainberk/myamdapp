import logging
from azure.cosmos import CosmosClient, exceptions
import azure.functions as func

# Initialize the Cosmos client
endpoint = "YOUR_COSMOS_DB_ENDPOINT"
key = "YOUR_COSMOS_DB_KEY"
client = CosmosClient(endpoint, key)

# Define the database and container
database_name = "YOUR_DATABASE_NAME"
container_name = "YOUR_CONTAINER_NAME"
database = client.get_database_client(database_name)
container = database.get_container_client(container_name)
app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)

@app.route(route="GET /api/RetrieveFromID", methods=["GET"])
def RetrieveFromID(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    inc_id = req.params.get('IncID')
    if not inc_id:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            inc_id = req_body.get('IncID')

    if inc_id:
        try:
            query = "SELECT * FROM c WHERE c.IncID=@inc_id"
            parameters = [{"name": "@inc_id", "value": inc_id}]
            items = list(container.query_items(query=query, parameters=parameters, enable_cross_partition_query=True))
            
            if items:
                return func.HttpResponse(f"Data: {items}", status_code=200)
            else:
                return func.HttpResponse("No data found", status_code=404)
        except exceptions.CosmosHttpResponseError as e:
            logging.error(f"Cosmos DB error: {e}")
            return func.HttpResponse("Error querying Cosmos DB", status_code=500)
    else:
        return func.HttpResponse(
             "Please pass an IncID on the query string or in the request body",
             status_code=400
        )
