import React, { useState,useEffect } from 'react';
import { StyleSheet, View, ImageBackground, Text,TouchableOpacity } from 'react-native';
import Textinput from '../../Components/textinput';
import { Picker } from "@react-native-picker/picker";
import Swiper from 'react-native-swiper';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

function Envoi() {
    const [selectedOption, setSelectedOption] = useState(" ");
    const [region, setRegion] = useState(null);
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
                        <Swiper>
                            <View style={styles.slide}>
                                <Textinput label={"l'adresse de l'émetteur"} holder={"Emetteur"} />
                                <Textinput label={"l'adresse du destinataire"} holder={"Destinataire"} />
                            </View>
                            <View style={styles.slide}>
                                
                            <Picker
                                    selectedValue={selectedOption}
                                style={[styles.picker, { borderRadius: 10 }]} // Ajoutez le borderRadius ici
                             onValueChange={(itemValue) => setSelectedOption(itemValue)}>
                             <Picker.Item label="Taille de colis" value="Taille de colis" />
                             <Picker.Item label="petit" value="S" />
                              <Picker.Item label="moyen" value="M" />
                              <Picker.Item label="grand" value="L" />
                            </Picker>
                            <TouchableOpacity  
                            style={styles.button}> 
                            <Text style={{fontWeight:"700",fontSize:25}}>Rechercher livreur </Text>
                            </TouchableOpacity>
  

                                
                            </View>
                        </Swiper>
                    </View>
                
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mapContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    picker: {
        justifyContent: "center",
        alignSelf: "center",
        width: '90%',
        height: 50,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 25,
        marginTop: 10,
        padding: 10,
    },
    slide: { flex: 1, marginLeft: 5, marginRight: 5, backgroundColor: 'rgba(239, 32, 77, 0.5)', borderRadius: 25, alignItems: "center" },
    map: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "transparent",
        width: "100%",
        height: "100%"
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%"
    },
    form: {
        height: "40%",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        elevation: 100,
        paddingVertical: 20,
        paddingHorizontal: 20
    },
    container: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center"
    },
    button: {
        borderRadius:25,
        backgroundColor:"#B89F92",
        height:50,
        width:"70%",
        alignItems: 'center',
        justifyContent:"center",
        marginTop:20
                   
       },
   
});

export default Envoi;
