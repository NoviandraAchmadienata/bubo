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

## Cache dan sesi Cloudflare

Agar sidebar dan halaman tidak tercampur dengan aset atau HTML lama, jangan aktifkan aturan **Cache Everything** untuk `dashboard.bubostrap.my.id`. Bila ada Cache Rule, buat pengecualian untuk `*dashboard.bubostrap.my.id/*` dengan **Bypass cache**. Aplikasi juga mengirim `Cache-Control: no-store` untuk halaman dan API, sementara versi URL CSS/JavaScript diperbarui saat rilis.

Tambahkan variabel berikut pada service production sebelum restart:

```ini
Environment=FLASK_SECRET_KEY=<nilai-acak-panjang>
Environment=SESSION_COOKIE_SECURE=1
```

`SESSION_COOKIE_SECURE=1` hanya untuk hostname HTTPS Cloudflare; biarkan `0` saat menjalankan HTTP di localhost.
