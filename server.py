#!/usr/bin/env python3
import http.server
import socketserver
import os
import urllib.parse

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        # Handle specific routes for static pages
        if path == '/privacy':
            self.path = '/privacy.html'
        elif path == '/terms':
            self.path = '/terms.html'
        elif path == '/404':
            self.path = '/404.html'
        elif path == '/visithealth':
            self.path = '/visithealth.html'
        elif path == '/visithealth/tree':
            self.path = '/visithealth/tree.html'
        else:
            # Check if the requested file exists
            file_path = os.path.join(os.getcwd(), path.lstrip('/'))
            if not os.path.exists(file_path) and not os.path.exists(file_path + '.html'):
                # Serve 404 page for any unknown route
                self.path = '/404.html'
        
        # Call the parent handler
        super().do_GET()

if __name__ == "__main__":
    PORT = 3000
    os.chdir('dist')
    
    with socketserver.TCPServer(("", PORT), SPAHandler) as httpd:
        print(f"Serving at http://localhost:{PORT}")
        print("Press Ctrl+C to stop")
        httpd.serve_forever()