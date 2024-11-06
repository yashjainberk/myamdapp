# function_app.py
import azure.functions as func
import logging
from azure.cosmos import CosmosClient, exceptions
import json
from datetime import datetime

# Your credentials and configuration
COSMOS_ENDPOINT = "your_cosmos_endpoint_here"
COSMOS_KEY = "your_cosmos_key_here"
DATABASE_NAME = "your_database_name"
CONTAINER_NAME = "your_container_name"

app = func.FunctionApp()

@app.function_name(name="AddIncident")
@app.route(route="/api/incident_upload", auth_level=func.AuthLevel.FUNCTION, methods=["POST"])
def add_incident(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Processing new incident entry request.')

    try:
        # Get request body
        req_body = req.get_json()

        # Validate required fields
        required_fields = ['incID', 'dateReported', 'incidentType']
        for field in required_fields:
            if field not in req_body:
                return func.HttpResponse(
                    json.dumps({
                        "error": f"Missing required field: {field}"
                    }),
                    status_code=400
                )

        # Initialize Cosmos Client with direct credentials
        client = CosmosClient(COSMOS_ENDPOINT, COSMOS_KEY)
        database = client.get_database_client(DATABASE_NAME)
        container = database.get_container_client(CONTAINER_NAME)

        # Prepare the new incident document
        new_incident = {
            # Universal Fields
            "id": req_body.get("incID"),  # Required in Cosmos DB
            "dateReported": req_body.get("dateReported", ""),
            "incidentType": req_body.get("incidentType", ""),
            "totalQTY": req_body.get("totalQTY", ""),
            "region": req_body.get("region", ""),
            "country": req_body.get("country", ""),
            "stateProvince": req_body.get("stateProvince", ""),
            "carID": req_body.get("carID", ""),

            # Customs Fields
            "customsPortAgency": req_body.get("customsPortAgency", ""),
            "destinationCountry": req_body.get("destinationCountry", ""),
            "originCountry": req_body.get("originCountry", ""),
            "locationRecovered": req_body.get("locationRecovered", ""),
            "seizureDate": req_body.get("seizureDate", ""),
            "bondAmount": req_body.get("bondAmount", ""),
            "infringementType": req_body.get("infringementType", ""),

            # String fields (previously boolean)
            "subpoena": req_body.get("subpoena", ""),
            "subpoenaOpen": req_body.get("subpoenaOpen", ""),
            "ceaseDesist": req_body.get("ceaseDesist", ""),
            "ceaseDesistOpen": req_body.get("ceaseDesistOpen", ""),
            "dueDiligence": req_body.get("dueDiligence", ""),
            "enhanced": req_body.get("enhanced", ""),
            "image": req_body.get("image", ""),

            # Notes
            "notes": req_body.get("notes", ""),

            # Metadata
            "createdAt": datetime.utcnow().isoformat(),
            "type": "incident"
        }

        # Create the item in Cosmos DB
        created_item = container.create_item(body=new_incident)

        return func.HttpResponse(
            json.dumps({
                "message": "Incident created successfully",
                "incident": created_item
            }),
            mimetype="application/json",
            status_code=201
        )

    except ValueError as ve:
        logging.error(f"Invalid request body: {str(ve)}")
        return func.HttpResponse(
            json.dumps({
                "error": "Invalid request body",
                "details": str(ve)
            }),
            mimetype="application/json",
            status_code=400
        )

    except exceptions.CosmosHttpResponseError as ce:
        logging.error(f"Cosmos DB error: {str(ce)}")
        return func.HttpResponse(
            json.dumps({
                "error": "Database operation failed",
                "details": str(ce)
            }),
            mimetype="application/json",
            status_code=500
        )

    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        return func.HttpResponse(
            json.dumps({
                "error": "Internal server error",
                "details": str(e)
            }),
            mimetype="application/json",
            status_code=500
        )