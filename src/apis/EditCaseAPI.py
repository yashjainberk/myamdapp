import azure.functions as func
import logging
from typing import Dict
import json
from azure.core.exceptions import ResourceNotFoundError
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

@app.route(route="editIncident", methods=["POST"])
def edit_incident(req: func.HttpRequest) -> func.HttpResponse:
    try:
        # Get request body
        req_body = req.get_json()
        inc_id = req_body.get('incID')
        edit_fields = req_body.get('editFields')

        # Validate required fields
        if not inc_id or not edit_fields:
            return func.HttpResponse(
                json.dumps({
                    "error": "Please provide incidentId and updateFields"
                }),
                status_code=400
            )

        # Connect to database
        conn = get_db_connection()
        cursor = conn.cursor()

        # Build dynamic SQL query
        updates = ", ".join([f"{key} = ?" for key in edit_fields.keys()])
        query = f"UPDATE Incidents SET {updates} WHERE incID = ?"
        
        # Execute query with parameters
        params = list(edit_fields.values()) + [inc_id]
        cursor.execute(query, params)
        
        # Check if any rows were affected
        if cursor.rowcount == 0:
            return func.HttpResponse(
                json.dumps({
                    "error": f"No incident found with ID: {inc_id}"
                }),
                status_code=404
            )

        conn.commit()
        
        return func.HttpResponse(
            json.dumps({
                "message": "Incident updated successfully",
                "incidentId": inc_id
            }),
            status_code=200
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