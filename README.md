# Aplikasi Hill Cipher - Tugas Kriptografi

## Anggota Kelompok
1. Naufal Abiyyu Ghazy (L0124028)
2. Andrew Yusuf Valentino Padang (L0124039)
3. Dzaky Ghiffary Susilo (L0124097)
4. Muhammad Rafian Surya Muqsith (L0124111)
5. Nehemia Karunia Dewa Ndaru (L0124114)

## Cara Menjalankan Program
1. Unduh (*Download ZIP*) atau *clone* repositori ini.
2. Ekstrak file ZIP tersebut.
3. Buka foldernya, lalu (*double-click*) pada file `index.html`.
4. Aplikasi akan otomatis terbuka di browser bawaan (Chrome/Edge/Firefox/Safari).

## Cara Menggunakan Aplikasi

### A. Mode Teks (Pesan Rahasia)
1. Pastikan Anda berada di Tab **"Teks"**.
2. Masukkan kata atau kalimat pada kolom **Input Text**.
3. Masukkan 4 angka sebagai **Kunci Matriks**. *(Contoh kunci valid: 3, 3, 2, 5)*.
4. Tentukan **Format Output** (mau disambung tanpa spasi atau dipisah per 5 huruf).
5. Klik **Encrypt** untuk mengunci pesan, atau **Decrypt** untuk mengembalikan pesan acak menjadi tulisan asli.
6. Hasilnya akan langsung muncul di kolom **Output Text**.

### B. Mode File (Gambar, Audio, Video)
1. Klik Tab **"File (Gambar/Audio/Video)"** di bagian atas.
2. Seret (*Drag & Drop*) atau klik kotak upload untuk memasukkan file Anda (misal: `foto.jpg`).
3. Masukkan **Kunci Matriks**. 
   *(Catatan: Untuk file, aturan matematikanya menggunakan Modulo 256, jadi determinannya harus ganjil. Contoh kunci valid: 3, 2, 2, 5)*.
4. Klik **Encrypt** atau **Decrypt**.
5. Tunggu sebentar, dan file hasil enkripsi/dekripsi akan **otomatis terunduh** (ter-download) ke perangkat Anda dengan awalan nama `enc_` atau `dec_`.
