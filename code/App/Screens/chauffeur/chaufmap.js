import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ButtonM from '../../Components/button';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

function Chaufmap() {
    const [isCheck, setIsCheck] = useState(false);
    const [region, setRegion] = useState(null);

    const toggleCheckBox = () => {
        setIsCheck(!isCheck);
    };

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

    return (
        <View style={styles.container}>
            <View style={styles.mapContainer}>
                {region && (
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        region={region}
                    />
                )}
                <View style={styles.form}>
                    <TouchableOpacity onPress={toggleCheckBox} style={styles.checkBox}>
                        <Ionicons
                            name={isCheck ? 'checkbox-outline' : 'square-outline'}
                            size={50}
                            color='black'
                            style={[
                                styles.icon,
                                { backgroundColor: isCheck ? "rgba(239, 32, 77, 1)" : "rgba(255, 255, 255, 1)" }
                            ]}
                        />
                        <Text style={[
                            styles.text,
                            { textDecorationLine: isCheck ? "none" : "line-through" }
                        ]}>
                            vous êtes disponibilité
                        </Text>
                    </TouchableOpacity>
                    <ButtonM style={styles.button}>
                        Ajouter un trajet
                    </ButtonM>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    mapContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    form: {
        height: "20%",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        elevation: 100,
        paddingVertical: 20,
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    checkBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        borderRadius: 5,
        height: 50,
        width: 50,
    },
    text: {
        fontWeight: "bold",
        fontSize: 25,
        marginLeft: 5,
    },
    button: {
        marginTop: 10,
        borderRadius: 15,
    },
});

export default Chaufmap;
