let currentMode = 'text';

function switchTab(mode) {
    currentMode = mode;
    document.getElementById('errorBox').classList.add('hidden');
    
    const tabText = document.getElementById('tab-text');
    const tabFile = document.getElementById('tab-file');
    
    if (mode === 'text') {
        tabText.className = "flex-1 py-2 text-center text-blue-400 border-b-2 border-blue-400 font-semibold";
        tabFile.className = "flex-1 py-2 text-center text-gray-500 hover:text-gray-300 font-semibold";
        
        document.getElementById('textInputSection').classList.remove('hidden');
        document.getElementById('textOutputSection').classList.remove('hidden');
        document.getElementById('fileInputSection').classList.add('hidden');
        document.getElementById('fileOutputSection').classList.add('hidden');
    } else {
        tabFile.className = "flex-1 py-2 text-center text-blue-400 border-b-2 border-blue-400 font-semibold";
        tabText.className = "flex-1 py-2 text-center text-gray-500 hover:text-gray-300 font-semibold";
        
        document.getElementById('textInputSection').classList.add('hidden');
        document.getElementById('textOutputSection').classList.add('hidden');
        document.getElementById('fileInputSection').classList.remove('hidden');
        document.getElementById('fileOutputSection').classList.remove('hidden');
    }
}

function updateFileName() {
    const input = document.getElementById('fileInput');
    const display = document.getElementById('fileNameDisplay');
    if (input.files.length > 0) {
        display.textContent = input.files[0].name;
        display.classList.add('text-green-400');
        display.classList.remove('text-gray-400');
    } else {
        display.textContent = "Klik atau Drag & Drop file ke sini";
        display.classList.add('text-gray-400');
        display.classList.remove('text-green-400');
    }
}

// Fungsi Matematika Modulo (menangani bilangan negatif di JS)
function mod(n, m) { return ((n % m) + m) % m; }

// Invers Modulo
function modInverse(a, m) {
    a = mod(a, m);
    for (let x = 1; x < m; x++) {
        if (mod(a * x, m) === 1) return x;
    }
    return -1;
}

function getMatrix() {
    return [
        [parseInt(document.getElementById('k00').value) || 0, parseInt(document.getElementById('k01').value) || 0],
        [parseInt(document.getElementById('k10').value) || 0, parseInt(document.getElementById('k11').value) || 0]
    ];
}

function showError(msg) {
    const errorBox = document.getElementById('errorBox');
    if (msg) {
        errorBox.textContent = msg;
        errorBox.classList.remove('hidden');
    } else {
        errorBox.classList.add('hidden');
    }
}

// ROUTER
function process(action) {
    if (currentMode === 'text') processText(action);
    else processFile(action);
}

// TEXT PROCESSING (Mod 26)
function processText(action) {
    showError('');
    let text = document.getElementById('inputText').value.toUpperCase().replace(/[^A-Z]/g, '');
    const format = document.getElementById('outputFormat').value;
    const key = getMatrix();
    const MOD = 26;

    if (text.length === 0) return showError('Masukkan teks terlebih dahulu.');
    if (text.length % 2 !== 0) text += 'X'; 

    const det = key[0][0] * key[1][1] - key[0][1] * key[1][0];
    const detMod = mod(det, MOD);
    const invDet = modInverse(detMod, MOD);
    
    if (invDet === -1) {
        return showError(`Matriks Kunci TIDAK VALID untuk Teks (Mod 26)! Determinan (${detMod}) tidak coprime dengan 26.`);
    }

    let result = '';
    
    if (action === 'encrypt') {
        for (let i = 0; i < text.length; i += 2) {
            const p1 = text.charCodeAt(i) - 65;
            const p2 = text.charCodeAt(i + 1) - 65;
            const c1 = mod(key[0][0] * p1 + key[0][1] * p2, MOD);
            const c2 = mod(key[1][0] * p1 + key[1][1] * p2, MOD);
            result += String.fromCharCode(c1 + 65) + String.fromCharCode(c2 + 65);
        }
    } else {
        const invKey = [
            [mod( key[1][1] * invDet, MOD), mod(-key[0][1] * invDet, MOD)],
            [mod(-key[1][0] * invDet, MOD), mod( key[0][0] * invDet, MOD)]
        ];
        for (let i = 0; i < text.length; i += 2) {
            const c1 = text.charCodeAt(i) - 65;
            const c2 = text.charCodeAt(i + 1) - 65;
            const p1 = mod(invKey[0][0] * c1 + invKey[0][1] * c2, MOD);
            const p2 = mod(invKey[1][0] * c1 + invKey[1][1] * c2, MOD);
            result += String.fromCharCode(p1 + 65) + String.fromCharCode(p2 + 65);
        }
    }

    if (format === 'group-5') result = result.match(/.{1,5}/g)?.join(' ') || result;
    document.getElementById('outputText').value = result;
}

// FILE PROCESSING (Mod 256)
function processFile(action) {
    showError('');
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) return showError('Pilih file terlebih dahulu.');
    
    const file = fileInput.files[0];
    const key = getMatrix();
    const MOD = 256; // Biner menggunakan byte 0-255

    const det = key[0][0] * key[1][1] - key[0][1] * key[1][0];
    const detMod = mod(det, MOD);
    const invDet = modInverse(detMod, MOD);
    
    if (invDet === -1) {
        return showError(`Matriks Kunci TIDAK VALID untuk File (Mod 256)! Determinan (${detMod}) harus berupa bilangan ganjil agar coprime dengan 256. (Contoh kunci valid: 3, 2, 2, 5)`);
    }

    document.getElementById('loading').classList.remove('hidden');

    const reader = new FileReader();
    reader.onload = function(e) {
        const buffer = e.target.result;
        const view = new Uint8Array(buffer);
        
        // Pad dengan 0 jika jumlah byte ganjil
        let data = view;
        if (data.length % 2 !== 0) {
            data = new Uint8Array(view.length + 1);
            data.set(view);
            data[data.length - 1] = 0; // Padding
        }

        const outputData = new Uint8Array(data.length);

        if (action === 'encrypt') {
            for (let i = 0; i < data.length; i += 2) {
                const p1 = data[i];
                const p2 = data[i + 1];
                outputData[i] = mod(key[0][0] * p1 + key[0][1] * p2, MOD);
                outputData[i + 1] = mod(key[1][0] * p1 + key[1][1] * p2, MOD);
            }
        } else {
            const invKey = [
                [mod( key[1][1] * invDet, MOD), mod(-key[0][1] * invDet, MOD)],
                [mod(-key[1][0] * invDet, MOD), mod( key[0][0] * invDet, MOD)]
            ];
            for (let i = 0; i < data.length; i += 2) {
                const c1 = data[i];
                const c2 = data[i + 1];
                outputData[i] = mod(invKey[0][0] * c1 + invKey[0][1] * c2, MOD);
                outputData[i + 1] = mod(invKey[1][0] * c1 + invKey[1][1] * c2, MOD);
            }
        }

        // Trigger download
        let newFileName = action === 'encrypt' ? 'enc_' + file.name : 'dec_' + file.name.replace('enc_', '');
        const blob = new Blob([outputData], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = newFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        document.getElementById('loading').classList.add('hidden');
    };
    
    reader.readAsArrayBuffer(file);
}
