import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRoute, useNavigation } from '@react-navigation/native';
import MapViewDirections from 'react-native-maps-directions';

const GOOGLE_MAPS_APIKEY = 'AIzaSyCdIq65pwy2KoNBa42AhnecTG3wZN5j4EQ';

function Map() {
    const [region, setRegion] = useState(null);
    const [currentPosition, setCurrentPosition] = useState(null);
    const [markerPosition, setMarkerPosition] = useState(null);
    const route = useRoute();
    const navigation = useNavigation();
    const { latitude, longitude } = route.params;

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setCurrentPosition({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            });

            if (latitude && longitude) {
                setMarkerPosition({
                    latitude,
                    longitude,
                });
                setRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                });
            }
        })();
    }, [latitude, longitude]);

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={region}
            >
                {currentPosition && markerPosition && (
                    <MapViewDirections
                        origin={currentPosition}
                        destination={markerPosition}
                        apikey={GOOGLE_MAPS_APIKEY}
                        strokeWidth={3}
                        strokeColor="hotpink"
                    />
                )}
                {currentPosition && (
                    <Marker coordinate={currentPosition} title="Current Position" 
                    image={require('../assets/car.png')}
                    />
                )}
                {markerPosition && (
                    <Marker coordinate={markerPosition} title="Destination" />
                )}
            </MapView>
            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Retourner</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    button: {
        position: 'absolute',
        bottom: 20,
        borderRadius: 25,
        backgroundColor: "#B89F92",
        height: 50,
        width: "95%",
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: "center",
    },
    buttonText: {
        fontWeight: "700",
        fontSize: 18,
        color: "#fff",
    },
});

export default Map;
