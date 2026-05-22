import sys
import os
import traceback

try:
    # Add the backend directory to Python path so 'from app.xxx' imports work
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

    # Import the FastAPI app from the backend package
    from app.main import app
except Exception as e:
    from http.server import BaseHTTPRequestHandler
    
    class handler(BaseHTTPRequestHandler):
        def do_GET(self):
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            
            error_msg = f"Error: {e}\n\nTraceback:\n{traceback.format_exc()}\n\nCWD: {os.getcwd()}\nFiles: {os.listdir('.')}"
            self.wfile.write(error_msg.encode('utf-8'))
        
        def do_POST(self):
            self.do_GET()
        
        def do_PUT(self):
            self.do_GET()
        
        def do_DELETE(self):
            self.do_GET()
            
    # For Vercel Python runtime, if it's not a FastAPI/Flask/Django app, 
    # it expects a class named 'handler' subclassing BaseHTTPRequestHandler.
