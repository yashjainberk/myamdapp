import azure.functions as func
import logging
from typing import Dict
import json
from datetime import datetime
import pyodbc

# TODO Install the ODBC Driver 17 for SQL Server in your Azure Function environment
# TODO Configure your Azure SQL Database firewall to allow Azure services

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

def get_db_connection():
    server = 'ATLCINVPRDV01\\INVDBSRV'
    database = 'MORE'
    username = 'AMD\\yashjain'
    password = 'MissionHacks1.0'
    driver = '{ODBC Driver 17 for SQL Server}'
    
    connection_string = f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}'
    return pyodbc.connect(connection_string)

@app.route(route="createIncident", methods=["POST"])
def create_incident(req: func.HttpRequest) -> func.HttpResponse:
    try:
        # Get request body
        req_body = req.get_json()
        
        # Extract required fields
        inc_id = req_body.get('incID')
        date_reported = req_body.get('dateReported')
        incident_type = req_body.get('incidentType')

        # Validate required fields
        required_fields = ['incID', 'dateReported', 'incidentType']
        missing_fields = [field for field in required_fields if not req_body.get(field)]
        
        if missing_fields:
            return func.HttpResponse(
                json.dumps({
                    "error": f"Missing required fields: {', '.join(missing_fields)}"
                }),
                status_code=400
            )

        # Connect to database
        conn = get_db_connection()
        cursor = conn.cursor()

        # Build insert query
        fields = list(req_body.keys())
        placeholders = ['?' for _ in fields]
        query = f"""
            INSERT INTO Incidents ({', '.join(fields)})
            VALUES ({', '.join(placeholders)})
        """

        # Execute query with parameters
        values = [req_body[field] for field in fields]
        cursor.execute(query, values)
        conn.commit()

        return func.HttpResponse(
            json.dumps({
                "message": "Incident created successfully",
                "incidentId": inc_id
            }),
            status_code=201
        )

    except pyodbc.IntegrityError:
        return func.HttpResponse(
            json.dumps({
                "error": "An incident with this ID already exists"
            }),
            status_code=409
        )
    except Exception as e:
        logging.error(f'Database error: {str(e)}')
        return func.HttpResponse(
            json.dumps({
                "error": "Internal server error",
                "details": str(e)
            }),
            status_code=500
        )