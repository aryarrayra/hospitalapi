// mystyle.js - Tampilan yang Lebih Modern

import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
    // --- Container Utama ---
    viewWrapper: { 
        flex: 1, 
        backgroundColor: '#F7F8F9', // Latar belakang abu-abu muda
        paddingHorizontal: 15,
        paddingTop: 15,
    },

    // --- Form Input ---
    viewForm: {
        padding: 20,
        backgroundColor: '#FFFFFF', // Latar belakang putih
        borderRadius: 12,
        marginBottom: 20,
        // Shadow modern (iOS)
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Elevation (Android)
        elevation: 3,
    },
    textInput: {
        padding: 12,
        fontSize: 16,
        borderRadius: 8, // Sedikit lebih bulat
        borderWidth: 1,
        marginBottom: 15,
        backgroundColor: '#FAFAFA',
        borderColor: '#E5E5E5',
    },

    // --- List Data ---
    viewData: { 
        flex: 4, 
        marginBottom: 10,
    },
    viewList: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        marginBottom: 10,
        alignItems: 'center',
        
        // Tambahkan garis bawah/bayangan untuk pemisah item
        borderBottomWidth: 1, 
        borderBottomColor: '#F0F0F0', 
    },

    // --- Teks & Data ---
    textListKode: {
        flex: 2,
        fontSize: 17,
        fontWeight: 'bold',
        color: '#333333', // Warna kode lebih gelap
        marginRight: 10,
    },
    textList: { 
        flex: 3,
        fontSize: 16,
        color: '#555555',
    },

    // --- Tombol Aksi ---
    textListEdit: { 
        color: '#007AFF', // Warna biru iOS standar
        marginHorizontal: 10, 
        fontWeight: 'bold',
        fontSize: 15,
        padding: 5, // Area sentuh lebih besar
    },
    textListDelete: { 
        color: '#FF3B30', // Warna merah iOS standar
        fontWeight: 'bold',
        fontSize: 15,
        padding: 5, // Area sentuh lebih besar
    },
});