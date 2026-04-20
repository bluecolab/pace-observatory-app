import http.server
import os
import socketserver
import socket

PORT = 9999

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/event':
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'Starting the move to production!')
            print("Button event received from client!")
            os.system("npx eas deploy --prod")
        else:
            self.send_error(404)

Handler = MyHandler

def get_ipv4():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # Doesn't need to be reachable
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip


with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving HTTP on https://{get_ipv4()}:{PORT}/index.html")
    httpd.serve_forever()