import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FIREBASE_DB } from '../../FireBaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useUser } from '../../UserContext';

function Listenvoi({ navigation }) {
    const [cells, setCells] = useState([]);
    const { user } = useUser();
    const rotationValue = useRef(new Animated.Value(0)).current;
    const [rotating, setRotating] = useState(false);
 
    const addToCells = (newItem) => {
        setCells((prevCells) => {
            const lastId = prevCells.length > 0 ? prevCells[prevCells.length - 1].id : 0;
            const newItemWithId = { ...newItem, id: lastId + 1 };
            return [...prevCells, newItemWithId];
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRef = doc(FIREBASE_DB, 'users', user.uid);
                const userDoc = await getDoc(userRef);
                
                if (!userDoc.exists()) {
                    console.log("No such user document!");
                    return;
                }

                const userData = userDoc.data();

                const locationsRef = collection(FIREBASE_DB, 'locations');
                const q = query(locationsRef, where('user_id', '==', user.uid));
                const querySnapshot = await getDocs(q);

                querySnapshot.forEach((doc) => {
                    const locationData = doc.data();

                    addToCells({
                        Lemeteur: locationData.latitude_eme,
                        Ldistinateur: locationData.latitude_des,
                        lemeteur: locationData.longitude_eme,
                        ldistinateur: locationData.longitude_des,
                        etat: 'En Attente', 
                        taille: locationData.taille,
                        num: userData.num,
                        ...locationData,
                    });
                });
                const locationsRefa = collection(FIREBASE_DB, 'acceptedLocations');
                const d = query(locationsRefa, where('user_id', '==', user.uid));
                const querySnapshots = await getDocs(d);

                querySnapshots.forEach((doc) => {
                    const locationData = doc.data();

                    addToCells({
                        Lemeteur: locationData.latitude_eme,
                        Ldistinateur: locationData.latitude_des,
                        lemeteur: locationData.longitude_eme,
                        ldistinateur: locationData.longitude_des,
                        etat: 'En Cours', 
                        taille: locationData.taille,
                        num: userData.num,
                        ...locationData,
                    });
                });
                
            } catch (e) {
                console.error("Error fetching documents: ", e);
            }

            
        };

        fetchData();
    }, [user]);

    const renderItem = ({ item }) => (
        <View style={[styles.item, { flexDirection: "column", alignItems: "center" }]}>
            <Text style={{fontWeight:"bold"}}>le coli : </Text>
            <View style={[styles.item2]}>
                <View style={styles.cells}>
                    <Text style={{fontWeight:"600"}}>depart:</Text>
                    <Text>{item.lemeteur}</Text>
                    <Text>{item.id}</Text>
                    <Text style={{fontWeight:"bold"}}>destination:</Text>
                    <Text>{item.ldistinateur}</Text>
                </View>
                <View style={styles.cells}>
                    <Text style={{fontWeight:"bold"}}>Taille:</Text>
                    <Text>{item.taille}</Text>
                    <Text style={{fontWeight:"bold"}}>Etat:</Text>
                    <Text>{item.etat}</Text>
                </View>
                <View style={styles.cells}>
                    <Text style={{fontWeight:"bold"}}>Numero:</Text>
                    <Text>{item.num}</Text>
                </View>
            </View>
        </View>
    );

    const reload = () => {
        rotateIcon();
        console.log('Reloading data...');
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
            <View style={styles.liste}>
                <FlatList
                    data={cells}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
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
});

export default Listenvoi;
