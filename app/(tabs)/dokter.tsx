import React, { Component } from 'react';
import { View, Text, TextInput, Button, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { style } from './mystyle'; // Menggunakan style yang sudah kamu buat

// --- Definisi Tipe Data (TypeScript) ---
interface DokterItem {
    id: number; 
    namaDokter: string; 
    spesialisasi: string; // Field baru untuk Dokter
}

interface DokterState {
    namaDokter: string; // ✅ PERBAIKAN: Ganti nama_dokter menjadi namaDokter
    spesialisasi: string;
    listData: DokterItem[]; 
    idUpdate: number | null;  
}
interface DokterProps {} 

class dokter extends Component<DokterProps, DokterState> {
    
    constructor(props: DokterProps) { 
        super(props);
        this.state = {
            namaDokter: '',
            spesialisasi: '',
            listData: [], 
            idUpdate: null, 
        };
        this.klikSimpan = this.klikSimpan.bind(this);
    }

    // URL API BARU untuk Dokter (Asumsi: Menggunakan API yang berbeda atau parameter berbeda)
    // GANTI IP sesuai server XAMPP kamu
    URL = "http://10.233.94.101/apiruangan/dokter_api.php"; 

    // --- FUNGSI CREATE & UPDATE (klikSimpan) ---
    klikSimpan() {
        if (this.state.namaDokter === '' || this.state.spesialisasi === '') {
            Alert.alert('Peringatan', 'Silakan masukkan nama dokter dan spesialisasi!');
        } else {
            let urlAksi = '';
            
            if (this.state.idUpdate) {
                urlAksi = this.URL + '/?op=update&id=' + this.state.idUpdate;
            } else {
                urlAksi = this.URL + '/?op=create';
            }

            fetch(urlAksi, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                // Body mengirim data yang diketik
                body: "nama_dokter=" + this.state.namaDokter + "&spesialisasi=" + this.state.spesialisasi
            })
            .then((response) => response.json()) 
            .then((json) => {
                this.setState({
                    namaDokter: '',
                    spesialisasi: '',
                    idUpdate: null
                }); 
                this.ambilData(); 
                Alert.alert("Sukses", json.message || "Operasi berhasil.");
            })
            .catch((error) => {
                console.log("Error saat menyimpan data dokter:", error);
                Alert.alert("Gagal", "Gagal menyimpan data: " + error);
            });
        }
    }
    
    // --- FUNGSI READ (ambilData) ---
    async ambilData() {
        await fetch(this.URL) 
            .then((response) => response.json()) 
            .then((json) => {
                // Asumsi API Dokter mengembalikan array murni
                const finalData = Array.isArray(json) ? json : []; 
                this.setState({listData: finalData}); 
            })
            .catch((error) => {
                console.log("Error saat mengambil data dokter:", error);
                this.setState({listData: []}); 
            });
    }

    // --- FUNGSI DELETE (klikDelete) ---
    klikDelete(id: number) {
        Alert.alert("Konfirmasi Hapus", "Yakin hapus data dokter ini?", [
            { text: "Batal", style: "cancel" },
            { 
                text: "Hapus", 
                onPress: () => {
                    fetch(this.URL + '/?op=delete&id=' + id, { method: 'GET' }) 
                    .then((response) => response.json())
                    .then((json) => {
                        Alert.alert("Sukses", json.message || "Data berhasil dihapus.");
                        this.ambilData();
                    })
                    .catch((error) => console.log("Gagal hapus:", error));
                },
                style: "destructive"
            }
        ]);
    }

    // --- FUNGSI EDIT (klikEdit) ---
    klikEdit(item: DokterItem) {
        this.setState({
            namaDokter: item.namaDokter,
            spesialisasi: item.spesialisasi,
            idUpdate: item.id,
        });
    }

    componentDidMount() {   
        this.ambilData();
    }
    
    // --- FUNGSI RENDER / TAMPILAN ---
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView> 
                    <View style={style.viewWrapper}> 
                        <View style={style.viewData}>
                            {
                                this.state.listData && this.state.listData.length > 0 ? (
                                    this.state.listData.map((val, index) => (
                                        <View key={index} style={style.viewList}> 
                                            <Text style={style.textListKode}>
                                                {val.namaDokter}
                                            </Text>
                                            <Text style={style.textList}>
                                                ({val.spesialisasi})
                                            </Text>
                                            <TouchableOpacity onPress={() => this.klikEdit(val)}>
                                                <Text style={style.textListEdit}>Edit</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => this.klikDelete(val.id)}>
                                                <Text style={style.textListDelete}>Delete</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={{ textAlign: 'center', marginTop: 20 }}>
                                        Data dokter kosong.
                                    </Text>
                                )
                            }
                        </View>
                    </View>

                    <View style={style.viewForm}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                            {this.state.idUpdate ? "Form Update Dokter" : "Form Tambah Dokter"}
                        </Text>
                        
                        <TextInput 
                            style={style.textInput}
                            placeholder="Masukkan Nama Dokter"
                            value={this.state.namaDokter}
                            onChangeText={(text) => this.setState({namaDokter: text})}
                        />
                        <TextInput 
                            style={style.textInput}
                            placeholder="Masukkan Spesialisasi"
                            value={this.state.spesialisasi}
                            onChangeText={(text) => this.setState({spesialisasi: text})}
                        />

                        <Button 
                            title={this.state.idUpdate ? "Update Dokter" : "Simpan Dokter"} 
                            onPress={this.klikSimpan} 
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

export default dokter;