import React, { Component } from 'react';
import { View, Text, TextInput, Button, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { style } from './mystyle'; 

// --- Definisi Tipe Data (TypeScript) ---
interface PasienItem {
    // Menggunakan nama kolom yang TEPAT dari DB
    NomorRekamMedis: string; 
    namaPasien: string; 
    alamatPasien: string; // ✅ PERBAIKAN: Menggunakan nama kolom DB yang benar (alamatPasien)
}

interface PasienState {
    // State harus cocok dengan kolom DB
    NomorRekamMedis: string; 
    namaPasien: string; 
    alamatPasien: string;
    listData: PasienItem[]; 
    idUpdate: string | null; // ID berupa string (Nomor Rekam Medis)
}
interface PasienProps {} 

class pasien extends Component<PasienProps, PasienState> {
    
    constructor(props: PasienProps) { 
        super(props);
        this.state = {
            NomorRekamMedis: '',
            namaPasien: '',
            alamatPasien: '',
            listData: [], 
            idUpdate: null, 
        };
        this.klikSimpan = this.klikSimpan.bind(this);
    }

    // URL API untuk Pasien (GANTI IP sesuai server XAMPP kamu!)
    URL = "http://10.233.94.101/apiruangan/pasien_api.php"; 

    // --- FUNGSI CREATE & UPDATE (klikSimpan) ---
    klikSimpan() {
        if (this.state.namaPasien === '' || this.state.alamatPasien === '') {
            Alert.alert('Peringatan', 'Nama pasien dan alamat wajib diisi!');
            return;
        }

        let urlAksi = '';
        let bodyData = 
            "namaPasien=" + this.state.namaPasien + 
            "&alamatPasien=" + this.state.alamatPasien + 
            "&NomorRekamMedis=" + this.state.NomorRekamMedis; // Kirim juga NRM

        if (this.state.idUpdate) {
            // UPDATE: Gunakan NRM yang sedang diupdate sebagai ID
            urlAksi = this.URL + '/?op=update&id=' + this.state.idUpdate;
        } else {
            // CREATE: Pastikan NRM diisi saat buat baru
            if (this.state.NomorRekamMedis === '') {
                Alert.alert('Peringatan', 'Nomor Rekam Medis (NRM) wajib diisi untuk pasien baru!');
                return;
            }
            urlAksi = this.URL + '/?op=create';
        }

        fetch(urlAksi, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' 
            },
            body: bodyData
        })
        .then((response) => response.json()) 
        .then((json) => {
            // Reset Form
            this.setState({
                NomorRekamMedis: '',
                namaPasien: '',
                alamatPasien: '',
                idUpdate: null 
            }); 
            this.ambilData(); // Refresh Data
            Alert.alert("Sukses", json.message || "Operasi berhasil.");
        })
        .catch((error) => {
            console.log("Error saat menyimpan data pasien:", error);
            Alert.alert("Gagal", "Gagal menyimpan data: " + error);
        });
    }
    
    // --- FUNGSI READ (ambilData) ---
    async ambilData() {
        await fetch(this.URL) 
            .then((response) => response.json()) 
            .then((json) => {
                const finalData = Array.isArray(json) ? json : []; 
                this.setState({listData: finalData}); 
            })
            .catch((error) => {
                console.log("Error saat mengambil data pasien:", error);
                this.setState({listData: []}); 
            });
    }

    // --- FUNGSI DELETE (klikDelete) ---
    klikDelete(nrm: string) {
        Alert.alert("Konfirmasi Hapus", `Yakin hapus pasien NRM ${nrm}?`, [
            { text: "Batal", style: "cancel" },
            { 
                text: "Hapus", 
                onPress: () => {
                    // Kirim NRM sebagai ID untuk operasi delete
                    fetch(this.URL + '/?op=delete&id=' + nrm, { method: 'GET' }) 
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
    klikEdit(item: PasienItem) {
        this.setState({
            NomorRekamMedis: item.NomorRekamMedis,
            namaPasien: item.namaPasien,
            alamatPasien: item.alamatPasien,
            idUpdate: item.NomorRekamMedis, // Simpan NRM yang akan diupdate
        });
    }

    componentDidMount() {
        this.ambilData();
    }
    
    // --- FUNGSI RENDER / TAMPILAN ---
    render() {
        const isUpdateMode = !!this.state.idUpdate;
        
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView> 
                    
                    {/* Bagian List Data */}
                    <View style={style.viewWrapper}> 
                        <View style={style.viewData}>
                            {
                                this.state.listData && this.state.listData.length > 0 ? (
                                    this.state.listData.map((val, index) => (
                                        <View key={index} style={style.viewList}> 
                                            
                                            <Text style={style.textListKode}>
                                                {val.NomorRekamMedis}
                                            </Text>
                                            <Text style={style.textList}>
                                                {val.namaPasien} ({val.alamatPasien})
                                            </Text>
                                            
                                            <TouchableOpacity 
                                                onPress={() => this.klikEdit(val)}>
                                                <Text style={style.textListEdit}>Edit</Text>
                                            </TouchableOpacity>
                                            
                                            <TouchableOpacity 
                                                onPress={() => this.klikDelete(val.NomorRekamMedis)}>
                                                <Text style={style.textListDelete}>Delete</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={{ textAlign: 'center', marginTop: 20 }}>
                                        Data pasien kosong.
                                    </Text>
                                )
                            }
                        </View>
                    </View>

                    {/* Bagian FORM Input */}
                    <View style={style.viewForm}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                            {isUpdateMode ? "Form Update Pasien" : "Form Tambah Pasien"}
                        </Text>
                        
                        <TextInput 
                            style={style.textInput}
                            placeholder="Nomor Rekam Medis (NRM)"
                            value={this.state.NomorRekamMedis}
                            onChangeText={(text) => this.setState({NomorRekamMedis: text})}
                            // Jika mode update, NRM tidak bisa diubah
                            editable={!isUpdateMode} 
                        />
                        <TextInput 
                            style={style.textInput}
                            placeholder="Nama Pasien"
                            value={this.state.namaPasien}
                            onChangeText={(text) => this.setState({namaPasien: text})}
                        />
                         <TextInput 
                            style={style.textInput}
                            placeholder="Alamat Pasien"
                            value={this.state.alamatPasien}
                            onChangeText={(text) => this.setState({alamatPasien: text})}
                        />

                        {/* Tombol Simpan/Update */}
                        <Button 
                            title={isUpdateMode ? "Update Pasien" : "Simpan Pasien"} 
                            onPress={this.klikSimpan} 
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

export default pasien;