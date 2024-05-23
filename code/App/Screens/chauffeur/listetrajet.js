import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FIREBASE_DB } from '../../FireBaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useUser } from '../../UserContext';
import ButtonM from '../../Components/button';

function Listetrajet({ navigation }) {
    const [trips, setTrips] = useState([]);
    const { user } = useUser();
    const rotationValue = useRef(new Animated.Value(0)).current;
    const [rotating, setRotating] = useState(false);

    const ajouter_tarjet = () => {
        navigation.navigate('Trajet');
    };

    const fetchTrips = async () => {
        try {
            const tripsRef = collection(FIREBASE_DB, 'trajet');
            const q = query(tripsRef, where('user_id', '==', user.uid));
            const querySnapshot = await getDocs(q);

            const tripsList = [];
            querySnapshot.forEach((doc) => {
                const tripData = doc.data();
                tripsList.push({
                    id: doc.id,
                    depart: tripData.latitude_eme,
                    destination: tripData.latitude_des,
                    dateheure: new Date(tripData.date.seconds * 1000).toLocaleString(), // Convert Firestore timestamp to JS date
                });
            });

            setTrips(tripsList);
        } catch (e) {
            console.error("Error fetching trips: ", e);
        }
    };

    useEffect(() => {
        fetchTrips();
    }, [user]);

    const renderItem = ({ item }) => (
        <View style={[styles.item, { flexDirection: "column", alignItems: "center" }]}>
            <Text style={{ fontWeight: "bold" }}>Le trajet :</Text>
            <View style={styles.item2}>
                <View style={styles.cells}>
                    <Text style={{ fontWeight: "600" }}>Départ:</Text>
                    <Text>{item.depart}</Text>
                </View>
                <View style={styles.cells}>
                    <Text style={{ fontWeight: "600" }}>Destination:</Text>
                    <Text>{item.destination}</Text>
                </View>
                <View style={styles.cells}>
                    <Text style={{ fontWeight: "600" }}>Date et heure de départ :</Text>
                    <Text>{item.dateheure}</Text>
                </View>
            </View>
        </View>
    );

    const reload = () => {
        rotateIcon();
        fetchTrips();
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

    return (
        <View style={styles.container}>
            <View style={{ flex: 0.1, backgroundColor: 'rgba(255,255,255,0.9)', elevation: 5 }}>
                <View style={styles.Header}>
                    <TouchableOpacity style={styles.backbutton} onPress={() => navigation.navigate('page1')}>
                        <AntDesign name="back" size={40} color={'black'} />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.text}>Liste des trajets :</Text>
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
            <View style={styles.buttoncont}>
                <ButtonM style={styles.button} fnc={ajouter_tarjet}> Ajouter un trajet </ButtonM>
            </View>
            <View style={styles.liste}>
                <FlatList
                    data={trips}
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
        padding: 10,
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
        padding: 5
    },
    buttoncont: {
        width: "100%",
        flex: 0.1,
        alignItems: "center",
        justifyContent: "center"
    },
    button: {
        borderRadius: 15,
        width: "80%",
    }
});

export default Listetrajet;
