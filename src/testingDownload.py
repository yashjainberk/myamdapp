import requests

# URL of the file
url = "https://dvuemoresa.blob.core.windows.net/my-container/Broker Investigations/2024_Q4 TURIN pre-release/desktop-SCSsugariki01.ini"

# Local file name to save the PDF
file_name = "SCSsugariki01.ini"

try:
    # Send a GET request to the URL
    response = requests.get(url)
    response.raise_for_status()  # Raise an error for unsuccessful status codes

    # Save the file to the local machine
    with open(file_name, 'wb') as file:
        file.write(response.content)
    
    print(f"File successfully downloaded and saved as {file_name}")
except requests.exceptions.RequestException as e:
    print(f"An error occurred: {e}")
