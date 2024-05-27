import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, FlatList, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FIREBASE_DB } from '../../FireBaseConfig';
import { collection, query, where, getDocs, doc as firestoreDoc, getDoc } from 'firebase/firestore';
import { useUser } from '../../UserContext';
import ButtonM from '../../Components/button';
import getCurrentAddress from '../../adresstext';

function Listenvoi({ navigation }) {
    const [cells, setCells] = useState([]);
    const { user } = useUser();
    const rotationValue = useRef(new Animated.Value(0)).current;
    const [rotating, setRotating] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchCells = async () => {
        try {
            const userRef = firestoreDoc(FIREBASE_DB, 'users', user.uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                console.log("No such user document!");
                return;
            }

            const userData = userDoc.data();
            const cellsRef = collection(FIREBASE_DB, 'Colis');
            const q = query(cellsRef, where('user_id', '==', user.uid));
            const querySnapshot = await getDocs(q);

            const pendingCells = await Promise.all(querySnapshot.docs.map(async (cellDoc) => {
                const cellData = cellDoc.data();
                const depart = await getCurrentAddress(cellData.latitude_eme, cellData.longitude_eme);
                const destination = await getCurrentAddress(cellData.latitude_des, cellData.longitude_des);
                return {
                    id: cellDoc.id,
                    depart,
                    destination,
                    taille: cellData.taille,
                    etat: 'En Attente',
                    num: userData.num,
                };
            }));

            const cellsRefa = collection(FIREBASE_DB, 'acceptedColis');
            const d = query(cellsRefa, where('user_id', '==', user.uid));
            const querySnapshots = await getDocs(d);

            const acceptedCells = await Promise.all(querySnapshots.docs.map(async (cellDoc) => {
                const cellData = cellDoc.data();
                const chauffeurRef = firestoreDoc(FIREBASE_DB, 'users', cellData.chauffeur_id);
                const chauffeurDoc = await getDoc(chauffeurRef);
                const chauffeur = chauffeurDoc.data();
                const depart = await getCurrentAddress(cellData.latitude_eme, cellData.longitude_eme);
                const destination = await getCurrentAddress(cellData.latitude_des, cellData.longitude_des);
                return {
                    id: cellDoc.id,
                    depart,
                    destination,
                    taille: cellData.taille,
                    etat: 'En Cours',
                    num: chauffeur.num,
                };
            }));
            const cellsRefas = collection(FIREBASE_DB, 'terminéColis');
            const ds = query(cellsRefas, where('user_id', '==', user.uid));
            const querySnapshotss = await getDocs(ds);

            const acceptedCellss = await Promise.all(querySnapshotss.docs.map(async (cellDoc) => {
                const cellData = cellDoc.data();
                const chauffeurRef = firestoreDoc(FIREBASE_DB, 'users', cellData.chauffeur_id);
                const chauffeurDoc = await getDoc(chauffeurRef);
                const chauffeur = chauffeurDoc.data();
                const depart = await getCurrentAddress(cellData.latitude_eme, cellData.longitude_eme);
                const destination = await getCurrentAddress(cellData.latitude_des, cellData.longitude_des);
                return {
                    id: cellDoc.id,
                    depart,
                    destination,
                    taille: cellData.taille,
                    etat: 'Termine',
                    num: chauffeur.num,
                };
            }));

            setCells([...acceptedCells, ...pendingCells, ...acceptedCellss]);
        } catch (e) {
            console.error("Error fetching cells: ", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCells();
    }, [user]);

    const renderItem = ({ item }) => (
        <View style={[styles.item, { flexDirection: "column", alignItems: "center" }]}>
            <Text style={{ fontWeight: "bold" }}>Le coli :</Text>
            <View style={styles.item2}>
                <View style={styles.cells}>
                    <Text style={{ fontWeight: "600" }}>Départ:</Text>
                    <Text>{item.depart}</Text>
                    <Text style={{ fontWeight: "600" }}>Destination:</Text>
                    <Text>{item.destination}</Text>
                </View>
                <View style={styles.cells}>
                    <Text style={{ fontWeight: "600" }}>Taille:</Text>
                    <Text>{item.taille}</Text>
                    <Text style={{ fontWeight: "600" }}>État:</Text>
                    <Text>{item.etat}</Text>
                </View>
                <View style={styles.cells}>
                    <Text style={{ fontWeight: "600" }}>Numéro:</Text>
                    <Text>{item.num}</Text>
                </View>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const reload = () => {
        rotateIcon();
        fetchCells();
    };

    const rotateIcon = () => {
        if (!rotating) {
            setRotating(true);
            Animated.timing(rotationValue, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }).start(() => {
                rotationValue.setValue(0); // Reset rotation to 0 after completing the animation
                setRotating(false);
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
                        <Text style={styles.text}>Liste des colis envoyés :</Text>
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
                <ButtonM style={styles.button} fnc={reload}> Ajouter un coli </ButtonM>
            </View>
            <View style={styles.liste}>
                <FlatList
                    data={cells}
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
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Listenvoi;
