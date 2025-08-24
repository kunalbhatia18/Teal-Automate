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
        
        # Check if it's a static file (CSS, JS, images, etc.)
        if path.endswith(('.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.xml', '.txt')):
            # For static files, serve directly if they exist in the root
            file_path = os.path.join(os.getcwd(), path.lstrip('/'))
            if os.path.exists(file_path):
                super().do_GET()
                return
            else:
                # Static file not found, send 404
                self.send_error(404, "File not found")
                return
        
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
            # For HTML routes, check if the requested path exists
            file_path = os.path.join(os.getcwd(), path.lstrip('/'))
            if not os.path.exists(file_path) and not os.path.exists(file_path + '.html'):
                # Serve 404 page for any unknown HTML route
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