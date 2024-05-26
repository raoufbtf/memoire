import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, FlatList, Button } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUser } from '../../UserContext';
import { FIREBASE_DB } from '../../FireBaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import getCurrentAddress from '../../adresstext';

function Listeacc({ navigation }) {
    const { user } = useUser();
    const [rotating, setRotating] = useState(false);
    const rotationValue = useRef(new Animated.Value(0)).current;
    const [locations, setLocations] = useState([]);
    const [addressMap, setAddressMap] = useState({});

    useEffect(() => {
        fetchData();
    }, [user]);

    const fetchData = async () => {
        try {
            const userRef = doc(FIREBASE_DB, 'users', user.uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                console.log("No such user document!");
                return;
            }

            const userData = userDoc.data();
            const locationsRefa = collection(FIREBASE_DB, 'acceptedLocations');
            const d = query(locationsRefa, where('chauffeur_id', '==', user.uid));
            const querySnapshots = await getDocs(d);
            const fetchedLocations = [];

            querySnapshots.forEach((doc) => {
                const locationData = doc.data();
                fetchedLocations.push({
                    id: doc.id,
                    Lemeteur: locationData.latitude_eme,
                    Ldistinateur: locationData.latitude_des,
                    lemeteur: locationData.longitude_eme,
                    ldistinateur: locationData.longitude_des,
                    etat: 'En Cours', 
                    taille: locationData.taille,
                    num: userData.num,
                    ...locationData,
                });

                // Fetch the addresses asynchronously
                getCurrentAddress(locationData.latitude_eme, locationData.longitude_eme)
                    .then((address) => {
                        setAddressMap((prev) => ({
                            ...prev,
                            [doc.id]: { ...prev[doc.id], depart: address },
                        }));
                    });

                getCurrentAddress(locationData.latitude_des, locationData.longitude_des)
                    .then((address) => {
                        setAddressMap((prev) => ({
                            ...prev,
                            [doc.id]: { ...prev[doc.id], destination: address },
                        }));
                    });
            });

            setLocations(fetchedLocations);
        } catch (e) {
            console.error("Error fetching documents: ", e);
        }
    };

    const reload = () => {
        rotateIcon();
        fetchData();
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
                <TouchableOpacity style={styles.cells} 
                    onPress={() => navigation.navigate("Map", {
                        latitude: item.latitude_eme,
                        longitude: item.longitude_eme
                    })}>
                    <Text style={{ fontWeight: "600" }}>Emetteur :</Text>
                    <Text>{addressMap[item.id]?.depart || 'Loading...'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cells} 
                    onPress={() => navigation.navigate("Map", {
                        latitude: item.latitude_des,
                        longitude: item.longitude_des
                    })}>
                    <Text style={{ fontWeight: "600" }}>Receiver:</Text>
                    <Text>{addressMap[item.id]?.destination || 'Loading...'}</Text>
                </TouchableOpacity>
                <View style={styles.cells}>
                    <Text style={{ fontWeight: "600" }}>Numero:</Text>
                    <Text>{item.num}</Text>
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
                        <Text style={styles.text}>Liste des colis accepte:</Text>
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
                    data={locations}
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

export default Listeacc;
