// app/(tabs)/ruangan.tsx

import React, { Component } from 'react';
import { View, Text, TextInput, Button, ScrollView, SafeAreaView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
// Pastikan path ke mystyle.js benar, jika di folder yang sama:
import { style } from './mystyle'; 

// --- Definisi Tipe Data (TypeScript) ---
interface RuanganItem {
    id: number; 
    kodeRuangan: string; // Harus cocok dengan field di DB/API
    namaRuangan: string; // Harus cocok dengan field di DB/API
}

interface RuanganState {
    kodeRuangan: string;
    namaRuangan: string;
    listData: RuanganItem[]; 
    idUpdate: number | null; 
}
interface RuanganProps {} 

// --- Komponen Kelas ---

class ruangan extends Component<RuanganProps, RuanganState> {
    
    constructor(props: RuanganProps) { 
        super(props);
        this.state = {
            kodeRuangan: '',
            namaRuangan: '',
            listData: [], 
            idUpdate: null, 
        };
        this.klikSimpan = this.klikSimpan.bind(this);
    }

    // URL API (Ganti IP ini jika server PHP kamu pindah!)
    URL = "http://10.233.94.101/apiruangan/ruangan_api.php"; 

    // --- FUNGSI CREATE & UPDATE (klikSimpan) ---
    klikSimpan() {
        if (this.state.kodeRuangan === '' || this.state.namaRuangan === '') {
            Alert.alert('Peringatan', 'Silakan masukkan kode ruangan dan nama ruangan!');
        } else {
            // FIX: Menggunakan 'let'
            let urlAksi = '';
            
            // Tentukan apakah UPDATE atau CREATE
            if (this.state.idUpdate) {
                // UPDATE: Kirim ID di URL sebagai GET parameter
                urlAksi = this.URL + '/?op=update&id=' + this.state.idUpdate;
            } else {
                // CREATE: Kirim op=create
                urlAksi = this.URL + '/?op=create';
            }

            fetch(urlAksi, {
                method: 'POST', // Menggunakan POST untuk CREATE dan UPDATE
                headers: {
                    // Header wajib untuk mengirim data form-encoded yang dapat dibaca PHP $_POST
                    'Content-Type': 'application/x-www-form-urlencoded' 
                },
                // Body mengirim data yang diketik
                body: "kodeRuangan=" + this.state.kodeRuangan + "&namaRuangan=" + this.state.namaRuangan
            })
            .then((response) => response.json()) // Berharap API mengirim JSON
            .then((json) => {
                // Reset Form dan ID Update
                this.setState({
                    kodeRuangan: '',
                    namaRuangan: '',
                    idUpdate: null // Reset idUpdate setelah simpan/update sukses
                }); 
                this.ambilData(); // Refresh Data
                Alert.alert("Sukses", json.message || "Operasi berhasil.");
            })
            .catch((error) => {
                console.log("Error saat menyimpan data:", error);
                Alert.alert("Gagal", "Gagal menyimpan data: " + error); // Error ini muncul jika PHP tidak kirim JSON
            });
        }
    }
    
    // --- FUNGSI READ (ambilData) ---
async ambilData() {
    await fetch(this.URL) 
        .then((response) => response.json()) 
        .then((json) => {
            let finalData = [];

            // 1. Cek jalur API kamu (json.data.result) - sesuai slide
            if (json && json.data && json.data.result && Array.isArray(json.data.result)) {
                finalData = json.data.result;
            } 
            // 2. Cek jalur alternatif (misalnya, jika API langsung mengembalikan array)
            else if (Array.isArray(json)) {
                finalData = json;
            } 
            // 3. Cek jalur lain (misalnya, jika API mengembalikan {result: [...]})
            else if (json && Array.isArray(json.result)) {
                finalData = json.result;
            }
            
            console.log('Data Ditemukan:', JSON.stringify(finalData));
            this.setState({listData: finalData}); 
        })
        .catch((error) => {
            console.log("Error saat mengambil data API:", error);
            this.setState({listData: []}); // Mencegah crash jika fetch gagal
        });
}

    // --- FUNGSI DELETE (klikDelete) ---
    klikDelete(id: number) {
        Alert.alert(
            "Konfirmasi Hapus",
            "Yakin ingin menghapus data ini?",
            [
                { text: "Batal", style: "cancel" },
                { 
                    text: "Hapus", 
                    onPress: () => {
                        fetch(this.URL + '/?op=delete&id=' + id, { method: 'GET' }) // Menggunakan GET untuk DELETE (sesuai logika API)
                        .then((response) => response.json())
                        .then((json) => {
                            Alert.alert("Sukses", json.message || "Data berhasil dihapus.");
                            this.ambilData();
                        })
                        .catch((error) => console.log("Gagal hapus:", error));
                    },
                    style: "destructive"
                }
            ]
        );
    }

    // --- FUNGSI EDIT (klikEdit) ---
    klikEdit(item: RuanganItem) {
        // Mengisi form input dengan data yang akan diedit
        this.setState({
            kodeRuangan: item.kodeRuangan,
            namaRuangan: item.namaRuangan,
            idUpdate: item.id, // Simpan ID yang akan diupdate
        });
    }

    componentDidMount() {
        this.ambilData();
    }
    
    // --- FUNGSI RENDER / TAMPILAN ---
    render() {
        // Menggunakan style.viewWrapper sesuai slide
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView> 
                    
                    {/* Bagian List Data (style.viewData) */}
                    <View style={style.viewWrapper}> 
                        <View style={style.viewData}>
                            {
                            this.state.listData && this.state.listData.length > 0 ? (
                                this.state.listData.map((val, index) => (
                                    <View key={index} style={style.viewList}>
                                        
                                        {/* Data Ruangan */}
                                        <Text style={style.textListKode}>
                                            {val.kodeRuangan}
                                        </Text>
                                        <Text style={style.textList}>
                                            {val.namaRuangan}
                                        </Text>
                                        
                                        {/* Tombol Edit */}
                                        <TouchableOpacity 
                                            onPress={() => this.klikEdit(val)}>
                                            <Text style={style.textListEdit}>Edit</Text>
                                        </TouchableOpacity>
                                        
                                        {/* Tombol Delete */}
                                        <TouchableOpacity 
                                            onPress={() => this.klikDelete(val.id)}>
                                            <Text style={style.textListDelete}>Delete</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))
                                    ) : (
                                <Text style={{ textAlign: 'center', marginTop: 20 }}>
                                    {this.state.listData ? "Data ruangan kosong." : "Sedang memuat data..."}
                                </Text>
                                )
                            }
                        </View>
                    </View>

                    {/* Bagian FORM Input (style.viewForm) */}
                    <View style={style.viewForm}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                            {this.state.idUpdate ? "Form Update Ruangan" : "Form Tambah Ruangan"}
                        </Text>
                        
                        <TextInput 
                            style={style.textInput}
                            placeholder="Masukkan Kode Ruangan"
                            value={this.state.kodeRuangan}
                            onChangeText={(text) => this.setState({kodeRuangan: text})}
                        />
                        <TextInput 
                            style={style.textInput}
                            placeholder="Masukkan Nama Ruangan"
                            value={this.state.namaRuangan}
                            onChangeText={(text) => this.setState({namaRuangan: text})}
                        />

                        {/* Tombol Simpan/Update */}
                        <Button 
                            title={this.state.idUpdate ? "Update Data" : "Simpan Data"} 
                            onPress={this.klikSimpan} 
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

export default ruangan;