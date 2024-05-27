import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, FlatList, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUser } from '../../UserContext';
import { FIREBASE_DB } from '../../FireBaseConfig';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getCurrentAddress from '../../adresstext';

const generateRandomNumber = () => {
    const min = 100000; // Minimum 6-digit number
    const max = 999999; // Maximum 6-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

function Listenvoi({ navigation }) {
    const { user } = useUser();
    const [locations, setLocations] = useState([]);
    const [addressMap, setAddressMap] = useState({});
    const [hiddenLocations, setHiddenLocations] = useState(new Set());
    const [rotating, setRotating] = useState(false);
    const rotationValue = useRef(new Animated.Value(0)).current;
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        fetchLocations();
        loadHiddenLocations(); // Check if locations are still hidden
    }, []);

    useEffect(() => {
        locations.forEach(location => {
            if (!addressMap[location.id]) {
                getCurrentAddress(location.latitude_eme, location.longitude_eme)
                    .then(address => {
                        setAddressMap(prev => ({
                            ...prev,
                            [location.id]: {
                                ...prev[location.id],
                                depart: address
                            }
                        }));
                    });
                getCurrentAddress(location.latitude_des, location.longitude_des)
                    .then(address => {
                        setAddressMap(prev => ({
                            ...prev,
                            [location.id]: {
                                ...prev[location.id],
                                destination: address
                            }
                        }));
                    });
            }
        });
    }, [locations]);

    const loadHiddenLocations = async () => {
        try {
            const hiddenLocationsJson = await AsyncStorage.getItem('hiddenLocations');
            if (hiddenLocationsJson !== null) {
                setHiddenLocations(new Set(JSON.parse(hiddenLocationsJson)));
            }
        } catch (error) {
            console.error('Error loading hidden locations:', error);
        }
    };

    const saveHiddenLocations = async (hiddenLocationsSet) => {
        try {
            const hiddenLocationsJson = JSON.stringify(Array.from(hiddenLocationsSet));
            await AsyncStorage.setItem('hiddenLocations', hiddenLocationsJson);
        } catch (error) {
            console.error('Error saving hidden locations:', error);
        }
    };

    const fetchTrajets = async () => {
        try {
            const trajetsRef = collection(FIREBASE_DB, 'trajet');
            const q = query(trajetsRef, where('user_id', '==', user.uid)); // Filter by user_id
            const querySnapshot = await getDocs(q);
            const trajetsList = [];

            querySnapshot.forEach((doc) => {
                const trajetData = doc.data();
                trajetsList.push({
                    id: doc.id,
                    ...trajetData,
                });
            });

            return trajetsList;
        } catch (error) {
            console.error('Error fetching trajets:', error);
        }
    };

    const fetchLocationsForTrajet = async (trajet) => {
        try {
            const locationsRef = collection(FIREBASE_DB, 'Colis');

            // Adjust your queries to avoid multiple range queries on the same field set
            const q = query(
                locationsRef,
                where('latitude_eme', '>=', trajet.latitude_eme - 0.045),
                where('latitude_eme', '<=', trajet.latitude_eme + 0.045)
            );

            const querySnapshot = await getDocs(q);
            const locationsList = [];

            querySnapshot.forEach((doc) => {
                const locationData = doc.data();
                // Further filtering in memory
                if (
                    locationData.longitude_eme >= trajet.longitude_eme - 0.045 &&
                    locationData.longitude_eme <= trajet.longitude_eme + 0.045 &&
                    locationData.latitude_des >= trajet.latitude_des - 0.045 &&
                    locationData.latitude_des <= trajet.latitude_des + 0.045 &&
                    locationData.longitude_des >= trajet.longitude_des - 0.045 &&
                    locationData.longitude_des <= trajet.longitude_des + 0.045 // Add condition to filter locations by chauffeur's UID
                ) {
                    locationsList.push({
                        id: doc.id,
                        ...locationData,
                    });
                }
            });

            return locationsList;
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    const fetchLocations = async () => {
        try {
            setLoading(true); // Start loading
            const trajetsList = await fetchTrajets();
            const allLocations = [];

            for (const trajet of trajetsList) {
                const locationsList = await fetchLocationsForTrajet(trajet);
                allLocations.push(...locationsList);
            }

            setLocations(allLocations);
            setLoading(false); // Stop loading
        } catch (error) {
            console.error('Error fetching all locations:', error);
            setLoading(false); // Stop loading on error
        }
    };

    

    const handleAcceptLocation = async (location) => {
        try {
            const acceptedLocationsRef = collection(FIREBASE_DB, 'acceptedColis');
            await addDoc(acceptedLocationsRef, {
                chauffeur_id: user.uid,
                code_confirm: '' + generateRandomNumber(),
                ...location,
            });

            // Now delete from locations collection
            const locationDoc = doc(FIREBASE_DB, 'Colis', location.id);
            await deleteDoc(locationDoc);

            // Update state to reflect deletion
            setLocations((prevLocations) => prevLocations.filter((loc) => loc.id !== location.id));
        } catch (error) {
            console.error('Error accepting location:', error);
        }
    };

    const reload = () => {
        rotateIcon();
        fetchLocations();
    };

    const rotateIcon = () => {
        if (!rotating) {
            setRotating(true);
            Animated.timing(rotationValue, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }).start(() => {
                Animated.timing(rotationValue, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }).start(() => setRotating(false));
            });
        }
    };

    const rotateAnimation = rotationValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const renderItem = ({ item }) => (
        <View style={[styles.item, { flexDirection: "column", alignItems: "center" }]}>
            <Text style={{ fontWeight: "bold" }}>Location:</Text>
            <View style={styles.item2}>
                <TouchableOpacity style={styles.cells} onPress={() => navigation.navigate("Map", {
                    latitude: item.latitude_eme,
                    longitude: item.longitude_eme
                })}>
                    <Text style={{ fontWeight: "600" }}>Emetteur :</Text>
                    <Text>{addressMap[item.id]?.depart || 'Loading...'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cells} onPress={() => navigation.navigate("Map", {
                    latitude: item.latitude_des,
                    longitude: item.longitude_des
                })}>
                    <Text style={{ fontWeight: "600" }}>Receiver:</Text>
                    <Text>{addressMap[item.id]?.destination || 'Loading...'}</Text>
                </TouchableOpacity>
                <View style={styles.cells}>
                    <TouchableOpacity style={styles.button} onPress={() => handleAcceptLocation(item)} >
                        <Text style={styles.buttonText}>Accept</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={{ flex: 0.1, backgroundColor: 'rgba(255,255,255,0.9)', elevation: 5 }}>
                <View style={styles.Header}>
                    <TouchableOpacity style={styles.backbutton} onPress={() => navigation.navigate('page1')}>
                        <AntDesign name="back" size={40} color={'black'} />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.text}>Liste des locations disponibles :</Text>
                    </View>
                    <View>
                        <TouchableOpacity style={[styles.backbutton, { marginLeft: 0, marginRight: 5 }]} onPress={reload}>
                            <Animated.View style={{ transform: [{ rotate: rotating ? rotateAnimation : '0deg' }] }}>
                                <Ionicons name="reload-circle-outline" size={50} color={'black'} />
                            </Animated.View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.liste}>
                {loading ? ( // Display loading spinner when loading is true
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <FlatList
                        data={locations.filter(location => !hiddenLocations.has(location.id))}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    Header: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignContent: 'center',
    },
    liste: {
        flex: 0.9,
        width: '100%',
        alignSelf: 'center',
        alignContent: 'center',
    },
    text: {
        fontWeight: '900',
        fontSize: 18,
    },
    backbutton: {
        backgroundColor: '#C5C6C7',
        height: 50,
        width: 50,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    item: {
        marginTop: 10,
        width: "95%",
        backgroundColor: 'rgba(239, 32, 77, 0.6)',
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "space-between",
        padding: 5
    },
    item2: {
        alignItems: 'center',
        width: "95%",
        flexDirection: "row",
        justifyContent: 'space-between',
    },
    cells: {
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: 'black',
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderWidth: 1,
        borderRadius: 5,
    },
    button: {
        borderRadius: 5,
        backgroundColor: "#B89F92",
        height: 50,
        width: "100%",
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: "center",
    },
    buttonText: {
        fontWeight: "600",
        fontSize: 16,
        color: "#fff",
    },
});

export default Listenvoi;
