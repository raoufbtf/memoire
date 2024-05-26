import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert , TextInput} from 'react-native';
import { Picker } from "@react-native-picker/picker";
import Swiper from 'react-native-swiper';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FIREBASE_DB } from '../../FireBaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useUser } from '../../UserContext';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import getCurrentAddress from '../../adresstext';

import MapViewDirections from 'react-native-maps-directions';
const GOOGLE_MAPS_API_KEY = 'AIzaSyCdIq65pwy2KoNBa42AhnecTG3wZN5j4EQ';  // Replace with your API key

function Envoi() {
  const [selectedOption, setSelectedOption] = useState(" ");
  const [region, setRegion] = useState(null);
  const [emitterPosition, setEmitterPosition] = useState(null);
  const [receiverPosition, setReceiverPosition] = useState(null);
  const [addressreceiver, setAddressreceiver] = useState('');
  const [addressemitter, setAddressemitter] = useState('');
  const [idu,setidu]= useState('');

  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useUser();

  const Emetteur = () => {
    navigation.navigate('Enregistre', { data: true });
  };

  const Distinateur = () => {
    navigation.navigate('Enregistre', { data: false });
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

  useEffect(() => {
    if (route && route.params) {
      const { data, position } = route.params;
      if (data) {
        setEmitterPosition(position);
        handleGetAddressemitter(position);
      } else {
        setReceiverPosition(position);
        handleGetAddressreceiver(position);
      }
    }
  }, [route]);

  const handleGetAddressreceiver = async (position) => {
    try {
      const currentAddress = await getCurrentAddress(position.latitude, position.longitude);
      setAddressreceiver(currentAddress);
    } catch (error) {
      setAddressreceiver(error);
    }
  };

  const handleGetAddressemitter = async (position) => {
    try {
      const currentAddress = await getCurrentAddress(position.latitude, position.longitude);
      setAddressemitter(currentAddress);
    } catch (error) {
      setAddressemitter(error);
    }
  };

 

  const Recheche = async () => {
    if (emitterPosition && receiverPosition) {
      try {
        const locationId = uuidv4();
        const locationRef = doc(FIREBASE_DB, 'locations', locationId);
        const locationData = {
          taille: selectedOption,
          latitude_eme: emitterPosition.latitude,
          longitude_eme: emitterPosition.longitude,
          latitude_des: receiverPosition.latitude,
          longitude_des: receiverPosition.longitude,
          user_id: user.uid,
          timestamp_des: Date.now()
        };

        await setDoc(locationRef, locationData);

        Alert.alert('Localisation enregistrée avec succès !');
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
      <View style={styles.mapContainer}>
        {region && (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={region}
          >
            {emitterPosition && (
              <Marker coordinate={emitterPosition} />
            )}
            {receiverPosition && (
              <Marker coordinate={receiverPosition} />
            )}
            {emitterPosition && receiverPosition && (
                    <MapViewDirections
                        origin={emitterPosition}
                        destination={receiverPosition}
                        apikey={GOOGLE_MAPS_API_KEY}
                        strokeWidth={3}
                        strokeColor="hotpink"
                    />
                       )}
          </MapView>
        )}
        <View style={styles.form}>
          <Swiper>
            <View style={styles.slide}>
              <View style={{ width: '90%', marginTop: 15 }}>
                <Text style={{ fontWeight: "500", fontSize: 17, marginLeft: 20 }}>L'adresse de l'émetteur</Text>
                <TouchableOpacity style={styles.input} onPress={Emetteur}>
                  {emitterPosition ? <Text>{addressemitter}</Text> : <Text>Emetteur</Text>}
                </TouchableOpacity>
              </View>
              <View style={{ width: '90%', marginTop: 15 }}>
                <Text style={{ fontWeight: "500", fontSize: 17, marginLeft: 20 }}>L'adresse du destinataire</Text>
                <TouchableOpacity style={styles.input} onPress={Distinateur}>
                  {receiverPosition ? <Text>{addressreceiver}</Text> : <Text>Destinataire</Text>}
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.slide}>
              
            <Text style={{ fontWeight: "500", fontSize: 17, marginLeft: 20 }}>le id de distinataire</Text>
            <TextInput
                  style={styles.input}
                  onChangeText={setidu}
                  value={idu}
                  placeholder="Enter le identifiant"
                />

              <Picker
                selectedValue={selectedOption}
                style={[styles.picker, { borderRadius: 10 }]}
                onValueChange={(itemValue) => setSelectedOption(itemValue)}>
                <Picker.Item label="Taille de colis" value="Taille de colis" />
                <Picker.Item label="petit" value="S" />
                <Picker.Item label="moyen" value="M" />
                <Picker.Item label="grand" value="L" />
              </Picker>
              <TouchableOpacity style={styles.button} onPress={Recheche}>
                <Text style={{ fontWeight: "700", fontSize: 25 }}>Rechercher livreur</Text>
              </TouchableOpacity>
            </View>
          </Swiper>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    input: {
        justifyContent: "center",
        alignSelf: "center",
        width: '90%',
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 25,
        padding: 10,
    },
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
    slide: {
        flex: 1,
        marginLeft: 5,
        marginRight: 5,
        backgroundColor: 'rgba(239, 32, 77, 0.5)',
        borderRadius: 25,
        alignItems: "center"
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
        borderRadius: 25,
        backgroundColor: "#B89F92",
        height: 50,
        width: "70%",
        alignItems: 'center',
        justifyContent: "center",
        marginTop: 20
    },
});

export default Envoi;
