import { Tabs } from 'expo-router';
import React from 'react';

// Pastikan semua komponen ini ada di lokasi yang benar di proyekmu
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol'; 
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      
      {/* 1. Tab Home (index.tsx) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      
      {/* 2. Tab Explore (explore.tsx) */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      
      {/* 3. Tab RUANGAN (ruangan.tsx) */}
      <Tabs.Screen
        name="ruangan"
        options={{
          title: 'Ruangan',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="bell.fill" color={color} /> 
          ),
          headerShown: false,
        }}
      />
      
      {/* 4. ✅ Tab DOKTER (dokter.tsx) */}
      <Tabs.Screen
        name="dokter" // Nama file harus: dokter.tsx
        options={{
          title: 'Dokter',
          tabBarIcon: ({ color }) => (
            // Menggunakan ikon 'cross.fill' atau ganti dengan ikon person/doctor yang kamu punya
            <IconSymbol size={28} name="cross.fill" color={color} /> 
          ),
          headerShown: false,
        }}
      />
      
      {/* 5. ✅ Tab PASIEN (pasien.tsx) */}
      <Tabs.Screen
        name="pasien" // Nama file harus: pasien.tsx
        options={{
          title: 'Pasien',
          tabBarIcon: ({ color }) => (
            // Menggunakan ikon 'figure.walk' atau ganti dengan ikon user/person yang kamu punya
            <IconSymbol size={28} name="figure.walk" color={color} /> 
          ),
          headerShown: false,
        }}
      />
      
    </Tabs>
  );
}