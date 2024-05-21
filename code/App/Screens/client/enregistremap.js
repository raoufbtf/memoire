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
            console.log('Localisation du marqueur :', markerPosition);
            console.log('Type:', data ? "Émetteur" : "Destinataire");
    
            try {
                const locationRef = doc(FIREBASE_DB, 'locations', user.uid);
                const locationDoc = await getDoc(locationRef);
    
                const locationData = {};
    
                if (data === true) {
                    locationData.latitude_eme = markerPosition.latitude;
                    locationData.longitude_eme = markerPosition.longitude;
                    locationData.timestamp_eme = Date.now();
                } else if (data === false) {
                    locationData.latitude_des = markerPosition.latitude;
                    locationData.longitude_des = markerPosition.longitude;
                    locationData.timestamp_des = Date.now();
                }
    
                locationData.user_id = user.uid;
    
                if (locationDoc.exists()) {
                    await updateDoc(locationRef, locationData);
                } else {
                    await setDoc(locationRef, locationData);
                }
    
                Alert.alert('Localisation enregistrée avec succès !');
    
                // Naviguer vers l'écran Envoi en passant les données
                navigation.navigate('envoi', { data: data, position: markerPosition });
            } catch (e) {
                console.error("Error adding document: ", e);
                Alert.alert('Erreur lors de l\'enregistrement de la localisation.');
            }
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
