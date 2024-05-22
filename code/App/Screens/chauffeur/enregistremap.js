import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, TextInput } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useUser } from '../../UserContext';
import axios from 'axios'; 

const GOOGLE_PLACES_API_KEY = 'apikey';

function Enregistre() {
    const [region, setRegion] = useState(null);
    const [markerPosition, setMarkerPosition] = useState(null);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
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

    const handleEnregistrer = () => {
        if (markerPosition) {
            navigation.navigate('Trajet', { data: data, position: markerPosition });
        } else {
            Alert.alert('Veuillez sélectionner une localisation sur la carte.');
        }
    };

    const searchfnc = async () => {
        if (!search.trim().length) {
            Alert.alert('Le champ recherche est vide');
            return;
        }

        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json`, {
                params: {
                    query: search,
                    key: GOOGLE_PLACES_API_KEY,
                },
            });

            const results = response.data.results;

            if (results.length > 0) {
                const firstResult = results[0];
                const newRegion = {
                    latitude: firstResult.geometry.location.lat,
                    longitude: firstResult.geometry.location.lng,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                };

                setRegion(newRegion);
                setSearchResults(results.map(place => ({
                    id: place.place_id,
                    name: place.name,
                    coordinate: {
                        latitude: place.geometry.location.lat,
                        longitude: place.geometry.location.lng,
                    },
                })));
            } else {
                Alert.alert('Aucun résultat trouvé');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Erreur lors de la recherche');
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
                {searchResults.map(result => (
                    <Marker
                        key={result.id}
                        coordinate={result.coordinate}
                        image={require('../assets/mark.png')}
                         
                    />
                ))}
            </MapView>
            <View style={styles.searchContainer}>
                <TextInput
                    placeholder='Rechercher une position'
                    style={styles.input}
                    onChangeText={setSearch}
                    value={search}
                />
                <TouchableOpacity style={[styles.button, { backgroundColor: "#aaa", height: 40, width: "80%", marginTop: 10 }]} onPress={searchfnc}>
                    <Text style={styles.buttonText}>Rechercher</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.form}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleEnregistrer}
                >
                    <Text style={styles.buttonText}>Enregistrer Localisation</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
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
    buttonText: {
        fontWeight: "700",
        fontSize: 18,
        color: "#fff",
    },
    searchContainer: {
        position: 'absolute',
        top: 10,
        alignSelf: "center",
        width: "90%",
        padding: 10,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#aaa",
        backgroundColor: "#fff",
        alignItems: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        width: '100%',
        paddingHorizontal: 10,
        marginBottom: 10,
    },
});

export default Enregistre;
