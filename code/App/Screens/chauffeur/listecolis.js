import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, FlatList, Button } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUser } from '../../UserContext';
import { FIREBASE_DB } from '../../FireBaseConfig';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Listenvoi({ navigation }) {
    const { user } = useUser();
    const [locations, setLocations] = useState([]);
    const [hiddenLocations, setHiddenLocations] = useState(new Set());
    const [rotating, setRotating] = useState(false);
    const rotationValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        console.log('User info:', user); // Debug: Log user info
        fetchLocations();
        loadHiddenLocations(); // Check if locations are still hidden
    }, []);

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

            console.log('Fetched trajets:', trajetsList); // Debug statement
            return trajetsList;
        } catch (error) {
            console.error('Error fetching trajets:', error);
        }
    };

    const fetchLocationsForTrajet = async (trajet) => {
        try {
            const locationsRef = collection(FIREBASE_DB, 'locations');

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
                    locationData.longitude_des <= trajet.longitude_des + 0.045  // Add condition to filter locations by chauffeur's UID
                ) {
                    locationsList.push({
                        id: doc.id,
                        ...locationData,
                    });
                }
            });

            console.log('Fetched locations for trajet:', locationsList); // Debug statement
            return locationsList;
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    const fetchLocations = async () => {
        try {
            const trajetsList = await fetchTrajets();
            const allLocations = [];

            for (const trajet of trajetsList) {
                const locationsList = await fetchLocationsForTrajet(trajet);
                allLocations.push(...locationsList);
            }

            console.log('All fetched locations:', allLocations); // Debug statement
            setLocations(allLocations);
        } catch (error) {
            console.error('Error fetching all locations:', error);
        }
    };

    const handleRefuseLocation = (id) => {
        setHiddenLocations((prevHiddenLocations) => new Set(prevHiddenLocations).add(id));
        saveHiddenLocations(hiddenLocations); // Save hidden locations when one is refused
        setTimeout(() => {
            setHiddenLocations((prevHiddenLocations) => {
                const newHiddenLocations = new Set(prevHiddenLocations);
                newHiddenLocations.delete(id);
                saveHiddenLocations(newHiddenLocations); // Save hidden locations after timeout
                return newHiddenLocations;
            });
        }, 15 * 60 * 1000); // 15 minutes
    };

    const handleAcceptLocation = async (location) => {
        try {
            const acceptedLocationsRef = collection(FIREBASE_DB, 'acceptedLocations');
            await addDoc(acceptedLocationsRef, {
                chauffeur_id: user.uid,
                ...location,
            });
            console.log('Location accepted:', location);

            // Now delete from locations collection
            const locationDoc = doc(FIREBASE_DB, 'locations', location.id);
            await deleteDoc(locationDoc);
            console.log('Location deleted:', location.id);

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
        <View style={[styles.item, { flexDirection: 'column', alignItems: 'center' }]}>
            <Text style={{ fontWeight: 'bold' }}>Location:</Text>
            <View style={styles.item2}>
                <Text>ID: {item.id}</Text>
                <Text>Latitude EME: {item.latitude_eme}</Text>
                <Text>Longitude EME: {item.longitude_eme}</Text>
                <Button title="Accept" onPress={() => handleAcceptLocation(item)} />
                <Button title="Refuse" onPress={() => handleRefuseLocation(item.id)} />
                {/* Display other location details here */}
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
                        <TouchableOpacity
                            style={[styles.backbutton, { marginLeft: 0, marginRight: 5 }]}
                            onPress={reload}>
                            <Animated.View style={{ transform: [{ rotate: rotating ? rotateAnimation : '0deg' }] }}>
                                <Ionicons name="reload-circle-outline" size={50} color={'black'} />
                            </Animated.View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.liste}>
                <FlatList
                    data={locations.filter(location => !hiddenLocations.has(location.id))}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
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
        width: '95%',
        backgroundColor: 'rgba(239, 32, 77, 0.6)',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'space-between',
        padding: 5,
    },
    item2: {
        padding: 10,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 20,
    },
});

export default Listenvoi;
