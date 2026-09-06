# JawaNotes — JawaScript + Vercel

Versi ini mempertahankan source utama di `app.jawa`, lalu `api/index.js` menerjemahkannya menjadi JavaScript saat Function dijalankan.

## Deploy ke Vercel

1. Upload folder ini ke GitHub.
2. Import repository di Vercel.
3. Jangan isi Build Command atau Start Command custom.
4. Deploy.
5. Buka URL deployment.

## Penting

Kode awal memakai `http.createServer(...).listen(...)`. Pola itu cocok untuk server lokal, tetapi Vercel Functions memanggil handler per request. Karena itu kode dipindahkan ke handler `req`/`res`.

Data catatan disimpan di `localStorage` browser, sehingga aman untuk aplikasi demo tanpa database dan tidak bergantung pada memory serverless.
