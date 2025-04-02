#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
# Treat unset variables as an error when substituting.
# Pipelines return the exit status of the last command to exit with a non-zero status, or zero if all commands exit successfully.
set -euo pipefail

# --- Configuration ---
readonly REQUIRED_NODE_MAJOR_VERSION=20
readonly ENV_FILE=".env"
readonly DIST_DIR="dist"
readonly SCRIPT_NAME=$(basename "$0")

# --- Utility Functions ---

# Logs an informational message to stdout
log_info() {
    printf "[%s][INFO] %s\\n" "$(date '+%Y-%m-%d %H:%M:%S')" "$1"
}

# Logs an error message to stderr
log_error() {
    printf "[%s][ERROR] %s\\n" "$(date '+%Y-%m-%d %H:%M:%S')" "$1" >&2
}

# Checks for required system dependencies and configuration files
check_prereqs() {
    log_info "Running prerequisite checks..."

    # Check for Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed or not found in PATH. Please install Node.js version ${REQUIRED_NODE_MAJOR_VERSION} or higher."
        exit 1
    fi

    # Check Node.js version
    local node_version
    node_version=$(node --version)
    local node_major_version
    node_major_version=$(echo "$node_version" | cut -d. -f1 | sed 's/v//')

    if [[ "$node_major_version" -lt "$REQUIRED_NODE_MAJOR_VERSION" ]]; then
        log_error "Node.js version ${node_version} found. Version ${REQUIRED_NODE_MAJOR_VERSION}.x or higher is required (as per package.json engines). Please upgrade Node.js."
        exit 1
    fi
    log_info "Node.js version check passed (${node_version})."

    # Check for npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed or not found in PATH. Please install npm (usually included with Node.js)."
        exit 1
    fi
    log_info "npm check passed ($(npm --version))."

    # Check for .env file
    if [[ ! -f "$ENV_FILE" ]]; then
        log_error "Configuration file '$ENV_FILE' not found in the current directory ($(pwd))."
        log_error "This file is required and must contain the DISCORD_BOT_TOKEN."
        log_error "Please create '$ENV_FILE' based on the project documentation or example."
        exit 1
    fi
    log_info "Configuration file '$ENV_FILE' found."

    log_info "Prerequisite checks passed."
}

# --- Main Execution ---

# Default mode is production
MODE="production"

# Parse arguments
if [[ $# -gt 0 ]]; then
    if [[ "$1" == "--dev" ]]; then
        MODE="development"
        log_info "Development mode requested (--dev flag detected)."
    else
        log_error "Invalid argument: $1"
        printf "Usage: %s [--dev]\\n" "$SCRIPT_NAME" >&2
        printf "  (no arguments)  Start in production mode (requires 'npm run build' first).\\n" >&2
        printf "  --dev           Start in development mode using ts-node-dev.\\n" >&2
        exit 1
    fi
fi

# Run prerequisite checks
check_prereqs

# Execute based on mode
if [[ "$MODE" == "production" ]]; then
    log_info "Starting application in PRODUCTION mode..."

    # Check for dist directory in production mode
    if [[ ! -d "$DIST_DIR" ]]; then
        log_error "Production build directory '$DIST_DIR/' not found."
        log_error "Please run 'npm run build' to compile the TypeScript code before starting in production mode."
        exit 1
    fi
    log_info "Build directory '$DIST_DIR/' found."

    log_info "Executing 'npm run start'..."
    # Use exec to replace the shell process with the Node.js process
    # This ensures signals (SIGINT, SIGTERM) are handled by the Node.js app
    exec npm run start

elif [[ "$MODE" == "development" ]]; then
    log_info "Starting application in DEVELOPMENT mode..."
    log_info "Executing 'npm run dev' (using ts-node-dev)..."
    # Use exec to replace the shell process with the ts-node-dev process
    exec npm run dev

else
    # This case should technically be unreachable due to argument parsing, but included for safety.
    log_error "Internal script error: Invalid mode '$MODE'."
    exit 1
fi

# The script should not reach here if exec succeeds
exit 0