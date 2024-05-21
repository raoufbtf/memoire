import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FIREBASE_DB } from '../../FireBaseConfig';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { useUser } from '../../UserContext';

function Enregistre() {
    const [region, setRegion] = useState(null);
    const [markerPosition, setMarkerPosition] = useState(null);
    const route = useRoute();
    const navigation = useNavigation();
    const data = route.params.data;

    const { user } = useUser();

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            });
        })();
    }, []);

    const handleMapPress = (event) => {
        const { coordinate } = event.nativeEvent;
        setMarkerPosition(coordinate);
    };

    const handleEnregistrer = async () => {
        if (markerPosition) {
           
                navigation.navigate('Trajet', { data: data, position: markerPosition });
           
        } else {
            Alert.alert('Veuillez sélectionner une localisation sur la carte.');
        }
    };
    
    
    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={region}
                onPress={handleMapPress}
            >
                {markerPosition && (
                    <Marker coordinate={markerPosition} />
                )}
            </MapView>
            <View style={styles.form}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleEnregistrer}
                >
                    <Text style={{ fontWeight: "700", fontSize: 25 }}>Enregistrer Localisation</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    form: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        alignItems: 'center',
    },
    button: {
        borderRadius: 25,
        backgroundColor: "#B89F92",
        height: 50,
        width: "100%",
        alignItems: 'center',
        justifyContent: "center",
    },
    container: {
        flex: 1,
    },
});

export default Enregistre;
