import sys
import os

# Add the backend directory to Python path so 'from app.xxx' imports work
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Import the FastAPI app from the backend package
from app.main import app
