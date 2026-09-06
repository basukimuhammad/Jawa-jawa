const halaman = `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>JawaNotes</title>
  <style>
    *{box-sizing:border-box}
    body{margin:0;font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#f3f6fb;color:#182230}
    .wrap{max-width:820px;margin:48px auto;padding:20px}
    .card{background:white;border-radius:22px;padding:28px;box-shadow:0 14px 40px rgba(0,0,0,.08)}
    h1{margin:0 0 8px;font-size:34px}.sub{margin:0 0 22px;color:#697586}
    .bar{display:flex;gap:10px}.bar input{flex:1;padding:14px 16px;border:1px solid #d8dee8;border-radius:13px;font-size:16px;outline:none}
    button{border:0;border-radius:12px;padding:12px 15px;font-weight:700;cursor:pointer}
    .add{background:#182230;color:white}.clear{background:#eef2f7;color:#334155}
    #daftar{display:grid;gap:10px;margin-top:22px}
    .item{display:flex;align-items:center;gap:12px;padding:14px;background:#f8fafc;border:1px solid #e8edf3;border-radius:14px}
    .item.done .text{text-decoration:line-through;color:#8a94a3}.text{flex:1;word-break:break-word}
    .del{background:#ffe8e8;color:#b42318;padding:9px 11px}.empty{text-align:center;color:#8a94a3;padding:24px}
    .footer{margin-top:18px;display:flex;justify-content:space-between;color:#8a94a3;font-size:13px}
    @media(max-width:600px){.wrap{margin:18px auto}.card{padding:20px}.bar{flex-direction:column}}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <h1>📒 JawaNotes</h1>
      <p class="sub">Catatan sederhana, digawe nganggo JawaScript.</p>
      <div class="bar">
        <input id="isi" placeholder="Tulis catatan..." maxlength="200">
        <button class="add" onclick="tambah()">Tambah</button>
        <button class="clear" onclick="hapusRampung()">Bersihkan selesai</button>
      </div>
      <div id="daftar"></div>
      <div class="footer"><span id="jumlah">0 catatan</span><span>JawaScript + Vercel</span></div>
    </div>
  </div>
<script>
const KUNCI = 'jawanotes.catatan.v1';
let catatan = [];
let nomor = 1;
function simpan(){ localStorage.setItem(KUNCI, JSON.stringify({catatan, nomor})); }
function ambil(){
  try{
    const data = JSON.parse(localStorage.getItem(KUNCI) || '{}');
    catatan = Array.isArray(data.catatan) ? data.catatan : [];
    nomor = Number(data.nomor) || (catatan.reduce((m,x)=>Math.max(m, Number(x.id)||0),0)+1);
  }catch(e){ catatan=[]; nomor=1; }
  gambar();
}
function gambar(){
  const daftar = document.getElementById('daftar');
  document.getElementById('jumlah').textContent = catatan.length + ' catatan';
  if(!catatan.length){
    daftar.innerHTML = '<div class="empty">Belum ada catatan. Tulis sesuatu di atas 👆</div>';
    return;
  }
  daftar.innerHTML = catatan.map(x =>
    '<div class="item ' + (x.selesai ? 'done' : '') + '">' +
    '<input type="checkbox" ' + (x.selesai ? 'checked' : '') + ' onchange="ubah(' + x.id + ', this.checked)">' +
    '<div class="text">' + esc(x.teks) + '</div>' +
    '<button class="del" onclick="hapus(' + x.id + ')">Hapus</button>' +
    '</div>'
  ).join('');
}
function esc(s){
  return String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}
function tambah(){
  const input = document.getElementById('isi');
  const teks = input.value.trim();
  if(!teks) return;
  catatan.push({id: nomor++, teks, selesai:false});
  simpan();
  input.value=''; input.focus(); gambar();
}
function ubah(id, selesai){
  const item = catatan.find(x => x.id === id);
  if(item){ item.selesai = Boolean(selesai); simpan(); gambar(); }
}
function hapus(id){ catatan = catatan.filter(x => x.id !== id); simpan(); gambar(); }
function hapusRampung(){ catatan = catatan.filter(x => !x.selesai); simpan(); gambar(); }
document.getElementById('isi').addEventListener('keydown', e => { if(e.key === 'Enter') tambah(); });
ambil();
</script>
</body>
</html>`;

function kirim(res, kode, isi, tipe = 'application/json') {
  res.statusCode = kode;
  res.setHeader('Content-Type', tipe + '; charset=utf-8');
  res.end(tipe === 'application/json' ? JSON.stringify(isi) : isi);
}

if (req.method === 'GET' && (req.url === '/' || req.url === '')) {
  kirim(res, 200, halaman, 'text/html');
} else if (req.url === '/api' || req.url === '/api/') {
  kirim(res, 200, { sukses: true, pesan: 'Sugeng rawuh ing JawaNotes!', bahasa: 'JawaScript', runtime: 'Vercel Function' });
} else {
  kirim(res, 404, { sukses: false, pesan: 'Halaman tidak ditemukan' });
}
