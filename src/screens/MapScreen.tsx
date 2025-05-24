import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { useAuth } from '../context/AuthContext';
import { Report } from '../services/report';
import api from '../services/api';

type ClusteredReport = Report & { count?: number };

export default function MapScreen({ navigation }: any) {
  const [reports, setReports] = useState<ClusteredReport[]>([]);
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    getLocationAndReports();
  }, []);

  const getLocationAndReports = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permissão de localização negada');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setInitialRegion({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      const response = await api.get('/reports', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const parsedReports: Report[] = response.data.map((report: any) => ({
        ...report,
        latitude: Number(report.latitude),
        longitude: Number(report.longitude),
      }));

      const clusteredReports = clusterNearbyReports(parsedReports, 0.0002); // distância mínima para agrupar (~10m)
      setReports(clusteredReports);
    } catch (error) {
      console.error('Erro ao obter localização ou relatórios:', error);
    } finally {
      setLoading(false);
    }
  };

  // Agrupa relatórios muito próximos
  const clusterNearbyReports = (reports: Report[], threshold: number): ClusteredReport[] => {
    const clustered: ClusteredReport[] = [];

    reports.forEach(report => {
      const existing = clustered.find(c =>
        getDistance(c.latitude, c.longitude, report.latitude, report.longitude) < threshold
      );

      if (existing) {
        existing.count = (existing.count || 1) + 1;
      } else {
        clustered.push({ ...report, count: 1 });
      }
    });

    return clustered;
  };

  // Calcula distância entre dois pontos (em graus decimais, para clustering simples)
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    return Math.sqrt((lat2 - lat1) ** 2 + (lon2 - lon1) ** 2);
  };

  return (
    <View style={styles.container}>
      {initialRegion ? (
        <MapView style={styles.map} initialRegion={initialRegion} showsUserLocation>
          {reports.map((report: ClusteredReport) => (
            <Marker
              key={report.id}
              coordinate={{
                latitude: report.latitude,
                longitude: report.longitude,
              }}
              title="Alagamento"
              description={
                report.count && report.count > 1
                  ? `${report.count} pessoas reportaram esse local`
                  : report.comment || 'Sem comentário'
              }
            />
          ))}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Carregando mapa...</Text>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <Button title="Marcar novo alagamento" onPress={() => navigation.navigate('Report')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    elevation: 5,
  },
});
