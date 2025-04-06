#!/bin/bash

# Exit on error
set -e

# Make scripts executable
chmod +x "$(dirname "$0")/build-arm-template.sh"
chmod +x "$(dirname "$0")/deploy.sh"

# Change to the script's directory
cd "$(dirname "$0")"

# Build ARM template from Bicep
echo "Building ARM template from Bicep files..."
./build-arm-template.sh

# # Register required resource providers
# echo "Registering required resource providers..."
# az provider register --namespace Microsoft.App
# az provider register --namespace Microsoft.ContainerService
# az provider register --namespace Microsoft.DBforPostgreSQL

# echo "Waiting for resource providers to register..."
# while true; do
#     app_state=$(az provider show -n Microsoft.App --query registrationState -o tsv)
#     container_state=$(az provider show -n Microsoft.ContainerService --query registrationState -o tsv)

#     if [[ "$app_state" == "Registered" ]] && [[ "$container_state" == "Registered" ]]; then
#         echo "All resource providers are registered"
#         break
#     else
#         echo "Waiting for providers to register... App: $app_state, Container: $container_state"
#         sleep 10
#     fi
# done


# n8n Azure Infrastructure Deployment Script

# Exit on error
set -e

# Default values
RESOURCE_GROUP="rg-n8n"
LOCATION="uksouth"
DEPLOYMENT_NAME="n8n-deployment"
PARAMETERS_FILE="main.parameters.json"

# Display help
function show_help {
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  -g, --resource-group    Resource group name (default: $RESOURCE_GROUP)"
    echo "  -l, --location          Azure region (default: $LOCATION)"
    echo "  -n, --name              Deployment name (default: $DEPLOYMENT_NAME)"
    echo "  -p, --parameters        Parameters file (default: $PARAMETERS_FILE)"
    echo "  -h, --help              Show this help message"
    echo ""
    exit 0
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -g|--resource-group)
            RESOURCE_GROUP="$2"
            shift
            shift
            ;;
        -l|--location)
            LOCATION="$2"
            shift
            shift
            ;;
        -n|--name)
            DEPLOYMENT_NAME="$2"
            shift
            shift
            ;;
        -p|--parameters)
            PARAMETERS_FILE="$2"
            shift
            shift
            ;;
        -h|--help)
            show_help
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            ;;
    esac
done

echo "=== n8n Azure Infrastructure Deployment ==="
echo "Resource Group: $RESOURCE_GROUP"
echo "Location: $LOCATION"
echo "Deployment Name: $DEPLOYMENT_NAME"
echo "Parameters File: $PARAMETERS_FILE"
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "Error: Azure CLI is not installed. Please install it first."
    exit 1
fi

# Check if user is logged in to Azure
echo "Checking Azure login status..."
az account show &> /dev/null || {
    echo "You are not logged in to Azure. Please run 'az login' first."
    exit 1
}

# Create resource group if it doesn't exist
echo "Creating resource group if it doesn't exist..."
az group create --name "$RESOURCE_GROUP" --location "$LOCATION" --output none

# Validate the deployment
echo "Validating deployment..."
az deployment group validate \
    --resource-group "$RESOURCE_GROUP" \
    --template-file main.bicep \
    --parameters "@$PARAMETERS_FILE" \
    --output none

# Deploy the infrastructure
echo "Deploying infrastructure..."
az deployment group create \
    --resource-group "$RESOURCE_GROUP" \
    --name "$DEPLOYMENT_NAME" \
    --template-file main.bicep \
    --parameters "@$PARAMETERS_FILE"

# Get the deployment outputs
echo "Deployment completed successfully!"
echo ""
echo "=== Deployment Outputs ==="
az deployment group show \
    --resource-group "$RESOURCE_GROUP" \
    --name "$DEPLOYMENT_NAME" \
    --query "properties.outputs" \
    --output json

echo ""
echo "n8n URL: $(az deployment group show --resource-group "$RESOURCE_GROUP" --name "$DEPLOYMENT_NAME" --query "properties.outputs.n8nUrl.value" --output tsv)"
echo ""
echo "Deployment completed successfully!"
