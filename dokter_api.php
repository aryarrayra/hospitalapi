<?php
// File: dokter_api.php

// Pastikan file koneksi.php sudah tersedia dan benar
include 'koneksi.php'; 

// Header wajib untuk CORS (agar bisa diakses dari React Native)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$method = $_SERVER['REQUEST_METHOD'];
header('Content-Type: application/json');

switch ($method) {
    
    // ---------------------------------
    // --- CASE GET (READ & DELETE) ---
    // ---------------------------------
    case 'GET':
        // Cek apakah ada parameter 'op=delete' untuk menjalankan operasi Hapus
        if (isset($_GET['op']) && $_GET['op'] === 'delete') {
            // Logika DELETE
            $id = (int)$koneksi->real_escape_string($_GET['id']);
            $sql = "DELETE FROM dokters WHERE id = $id";

            if ($koneksi->query($sql) === TRUE) {
                echo json_encode(array("message" => "Data dokter ID $id berhasil dihapus."));
            } else {
                http_response_code(500);
                echo json_encode(array("message" => "Gagal menghapus data: " . $koneksi->error));
            }
            break; // Keluar dari switch setelah operasi DELETE
        }
        
        // Logika READ (Mengambil semua data jika tidak ada op=delete)
        $sql = "SELECT id, namaDokter, spesialisasi FROM dokters";
        $result = $koneksi->query($sql);
        
        if ($result) {
            $data = array();
            while($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            // Mengembalikan array data murni
            echo json_encode($data); 
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Gagal menjalankan query READ.", "error_detail" => $koneksi->error));
        }
        break; // Keluar dari switch setelah operasi GET

    // --------------------------------------
    // --- CASE POST (CREATE & UPDATE) ---
    // --------------------------------------
    case 'POST':
        // Ambil data dari $_POST karena React Native mengirim form-urlencoded
        // Pastikan nama field ini cocok dengan yang dikirim dari dokter.tsx
        $nama = $koneksi->real_escape_string($_POST['namaDokter']);
        $spesialisasi = $koneksi->real_escape_string($_POST['spesialisasi']);
        
        $op = isset($_GET['op']) ? $_GET['op'] : '';
        
        if ($op === 'update') {
            // Logika UPDATE
            $id = (int)$koneksi->real_escape_string($_GET['id']);
            $sql = "UPDATE dokters SET 
                    namaDokter = '$nama', 
                    spesialisasi = '$spesialisasi' 
                    WHERE id = $id";
            
        } else if ($op === 'create') {
            // Logika CREATE
            $sql = "INSERT INTO dokters (nama_dokter, spesialisasi) 
                    VALUES ('$nama', '$spesialisasi')";
        } else {
            // Jika op tidak ada atau tidak valid
            http_response_code(400); // Bad Request
            echo json_encode(array("message" => "Operasi CREATE/UPDATE tidak valid."));
            break;
        }
        
        // Eksekusi query
        if ($koneksi->query($sql) === TRUE) {
            http_response_code($op === 'create' ? 201 : 200); // 201 untuk Create, 200 untuk Update
            echo json_encode(array("message" => "Data dokter berhasil di" . ($op === 'create' ? "tambahkan." : "perbarui.")));
        } else {
            http_response_code(500); // Internal Server Error
            echo json_encode(array("message" => "Gagal operasi data dokter: " . $koneksi->error));
        }
        break; // Keluar dari switch setelah operasi POST

    // -----------------------------
    // --- CASE DEFAULT (ERROR) ---
    // -----------------------------
    default:
        http_response_code(405); // Method Not Allowed
        echo json_encode(array("message" => "Metode tidak didukung"));
        break;
}

$koneksi->close();
?>