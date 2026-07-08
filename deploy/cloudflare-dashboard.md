# Cloudflare Tunnel Route

The existing Cloudflare Tunnel is remotely managed and currently has:

- `ssh.bubostrap.my.id` -> `ssh://localhost:22`

Add a second published application route for the dashboard:

- Public hostname: `dashboard.bubostrap.my.id`
- Service type: `HTTP`
- Service URL: `http://localhost:5000`

Cloudflare dashboard path:

1. Open Cloudflare Zero Trust.
2. Go to `Networks` / `Networking` -> `Tunnels`.
3. Select the existing tunnel with connector ID `ab2ce131-c12f-4b40-98c7-a096b3c94a14`.
4. Open `Routes` or `Public Hostnames`.
5. Add a published application route:
   - Subdomain: `dashboard`
   - Domain: `bubostrap.my.id`
   - Service: `HTTP`
   - URL: `localhost:5000`
6. Save the route.

Keep `ssh.bubostrap.my.id` as-is unless you intentionally want to replace SSH access.
