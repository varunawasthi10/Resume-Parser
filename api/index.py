import sys
import os
import traceback

try:
    # Add the backend directory to Python path so 'from app.xxx' imports work
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

    # Import the FastAPI app from the backend package
    from app.main import app
except Exception as e:
    from fastapi import FastAPI
    app = FastAPI()
    err_info = {"error": str(e), "traceback": traceback.format_exc(), "cwd": os.getcwd(), "files": os.listdir('.')}
    
    @app.api_route("/{path_name:path}", methods=["GET", "POST", "PUT", "DELETE"])
    def catch_all(path_name: str):
        return err_info
