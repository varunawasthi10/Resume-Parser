import sys
import os
import traceback
from http.server import BaseHTTPRequestHandler

try:
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))
    from backend.app.main import app as main_app
    app = main_app
except Exception as e:
    class handler(BaseHTTPRequestHandler):
        def do_GET(self):
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            
            error_msg = f"Error: {e}\n\nTraceback:\n{traceback.format_exc()}\n\nCWD: {os.getcwd()}"
            self.wfile.write(error_msg.encode('utf-8'))
