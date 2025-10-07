<?php
// File: ruangan_api.php
include 'koneksi.php'; // Pastikan koneksi.php bersih tanpa output!

// Header CORS (penting agar React Native bisa mengakses)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$method = $_SERVER['REQUEST_METHOD'];
header('Content-Type: application/json');

// Jika kamu masih mendapatkan error 'Unexpected character: <',
// aktifkan baris ini untuk menyembunyikan warning/notice PHP:
// error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING); 

switch ($method) {
    // --- READ (Membaca Data) ---
    case 'GET':
        // Cek apakah ada parameter 'op' untuk DELETE
        if (isset($_GET['op']) && $_GET['op'] === 'delete') {
            goto delete_case; // Langsung lompat ke logika DELETE
        }
        
        // Cek apakah ada parameter 'id' untuk ambil data spesifik
        if (isset($_GET['id'])) {
            $id = $koneksi->real_escape_string($_GET['id']);
            $sql = "SELECT id, kodeRuangan, namaRuangan FROM ruangans WHERE id = '$id'"; // Sesuaikan kolom
        } else {
            // Ambil semua data ruangan
            $sql = "SELECT id, kodeRuangan, namaRuangan FROM ruangans"; // Sesuaikan kolom
        }

        $result = $koneksi->query($sql);

        if ($result) { 
            $data = array();
            while($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            // Mengembalikan array data murni (sesuai permintaan ambilData() di RN)
            echo json_encode($data); 
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Gagal menjalankan query READ.", "error_detail" => $koneksi->error));
        }
        break;

    // --- CREATE & UPDATE (Menambah/Mengubah Data) ---
    case 'POST':
        // ✅ Perbaikan: Ambil data dari $_POST karena RN mengirim form-urlencoded
        $kodeRuangan = $koneksi->real_escape_string($_POST['kodeRuangan']);
        $namaRuangan = $koneksi->real_escape_string($_POST['namaRuangan']);
        
        $op = isset($_GET['op']) ? $_GET['op'] : '';
        
        if ($op === 'update') {
            // --- LOGIKA UPDATE ---
            $id = (int)$koneksi->real_escape_string($_GET['id']);
            
            $sql = "UPDATE ruangans SET 
                    kodeRuangan = '$kodeRuangan', 
                    namaRuangan = '$namaRuangan' 
                    WHERE id = $id";

            if ($koneksi->query($sql) === TRUE) {
                echo json_encode(array("message" => "Data ruangan ID $id berhasil diperbarui."));
            } else {
                http_response_code(500);
                echo json_encode(array("message" => "Gagal memperbarui data: " . $koneksi->error));
            }

        } else if ($op === 'create') {
            // --- LOGIKA CREATE ---
            $sql = "INSERT INTO ruangans (kodeRuangan, namaRuangan) 
                    VALUES ('$kodeRuangan', '$namaRuangan')";

            if ($koneksi->query($sql) === TRUE) {
                http_response_code(201);
                echo json_encode(array("message" => "Data ruangan berhasil ditambahkan."));
            } else {
                http_response_code(500);
                echo json_encode(array("message" => "Gagal menambahkan data: " . $koneksi->error));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Operasi tidak valid."));
        }
        break;

    // --- DELETE (Menghapus Data) ---
    delete_case:
    case 'DELETE': // Blok ini hanya untuk skenario DELETE murni, tapi RN pakai GET/POST dengan 'op=delete'
        // Jika DELETE dipicu dari GET op=delete (seperti di klikDelete() RN)
        $id = (int)$koneksi->real_escape_string($_GET['id']);
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(array("message" => "ID Ruangan wajib disertakan untuk delete."));
            break;
        }

        $sql = "DELETE FROM ruangans WHERE id = $id";

        if ($koneksi->query($sql) === TRUE) {
            echo json_encode(array("message" => "Data ruangan ID $id berhasil dihapus."));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Gagal menghapus data ruangan: " . $koneksi->error));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Metode tidak didukung"));
        break;
}

$koneksi->close();
?>