import os
import binascii

# Function to generate a secure API key
def generate_api_key(length=32):
    return binascii.hexlify(os.urandom(length)).decode()

# Generate a new API key
api_key = generate_api_key()

# Save the API key to a configuration file (you can also use environment variables)
with open("config.ini", "w") as config_file:
    config_file.write(f"API_KEY={api_key}")

print(f"Generated API Key: {api_key}")
print("API Key has been saved to config.ini.")
