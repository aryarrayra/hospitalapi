<?php
// File: pasien_api.php

// Pastikan file koneksi.php sudah tersedia dan benar
include 'koneksi.php'; 

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$method = $_SERVER['REQUEST_METHOD'];
header('Content-Type: application/json');

switch ($method) {
    
    // ---------------------------------
    // --- CASE GET (READ & DELETE) ---
    // ---------------------------------
    case 'GET':
        if (isset($_GET['op']) && $_GET['op'] === 'delete') {
            // Logika DELETE menggunakan NRM dari GET parameter 'id'
            $nrm = $koneksi->real_escape_string($_GET['id']);
            $sql = "DELETE FROM pasiens WHERE NomorRekamMedis = '$nrm'";

            if ($koneksi->query($sql) === TRUE) {
                echo json_encode(array("message" => "Data pasien NRM $nrm berhasil dihapus."));
            } else {
                http_response_code(500);
                echo json_encode(array("message" => "Gagal menghapus data: " . $koneksi->error));
            }
            break; 
        }
        
        // Logika READ
        // Mengambil hanya kolom yang relevan untuk ditampilkan di list
        $sql = "SELECT NomorRekamMedis, namaPasien, alamatPasien FROM pasiens"; 
        $result = $koneksi->query($sql);
        
        if ($result) {
            $data = array();
            while($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            echo json_encode($data); 
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Gagal menjalankan query READ.", "error_detail" => $koneksi->error));
        }
        break; 

    // --------------------------------------
    // --- CASE POST (CREATE & UPDATE) ---
    // --------------------------------------
    case 'POST':
        // Ambil data dari $_POST sesuai nama field di pasien.tsx
        $nrm = $koneksi->real_escape_string($_POST['NomorRekamMedis']);
        $nama = $koneksi->real_escape_string($_POST['namaPasien']);
        $alamat = $koneksi->real_escape_string($_POST['alamatPasien']);
        
        $op = isset($_GET['op']) ? $_GET['op'] : '';
        
        if ($op === 'update') {
            // Logika UPDATE
            $id_update = $koneksi->real_escape_string($_GET['id']); // Ini adalah NRM lama
            
            $sql = "UPDATE pasiens SET 
                    namaPasien = '$nama', 
                    alamatPasien = '$alamat' 
                    WHERE NomorRekamMedis = '$id_update'"; // Update berdasarkan NRM
            
        } else if ($op === 'create') {
            // Logika CREATE
            // Pastikan kamu menyertakan semua kolom yang TIDAK NULL di DB
            $sql = "INSERT INTO pasiens (NomorRekamMedis, namaPasien, alamatPasien) 
                    VALUES ('$nrm', '$nama', '$alamat')"; 
        } else {
            http_response_code(400); 
            echo json_encode(array("message" => "Operasi CREATE/UPDATE tidak valid."));
            break;
        }
        
        // Eksekusi query
        if ($koneksi->query($sql) === TRUE) {
            http_response_code($op === 'create' ? 201 : 200); 
            echo json_encode(array("message" => "Data pasien NRM $nrm berhasil di" . ($op === 'create' ? "tambahkan." : "perbarui.")));
        } else {
            http_response_code(500); 
            echo json_encode(array("message" => "Gagal operasi data pasien: " . $koneksi->error));
        }
        break; 

    // -----------------------------
    // --- CASE DEFAULT (ERROR) ---
    // -----------------------------
    default:
        http_response_code(405); 
        echo json_encode(array("message" => "Metode tidak didukung"));
        break;
}

$koneksi->close();
?>