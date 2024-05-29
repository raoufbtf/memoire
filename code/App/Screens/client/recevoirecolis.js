import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, FlatList, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FIREBASE_DB } from '../../FireBaseConfig';
import { collection, query, where, getDocs, doc as firestoreDoc, getDoc } from 'firebase/firestore';
import { useUser } from '../../UserContext';
import ButtonM from '../../Components/button';

function Recevoire({ navigation }) {
  const rotationValue = useRef(new Animated.Value(0)).current;
  const [rotating, setRotating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cells, setCells] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user && user.uid) {
      fetchCells();
    } else {
      console.error('User or uid is undefined');
      setLoading(false);
    }
  }, [user]);

  const fetchCells = async () => {
    if (!user || !user.uid) {
      console.error('User or uid is undefined');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const userRef = firestoreDoc(FIREBASE_DB, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        console.log("No such user document!");
        setLoading(false);
        return;
      }

      const userData = userDoc.data();
      console.log('User data:', userData);

      const acceptedLocationQuery = query(
        collection(FIREBASE_DB, 'acceptedColis'),
        where('idclient', '==', userData.idclient)
      );
      const acceptedLocationSnapshot = await getDocs(acceptedLocationQuery);

      if (acceptedLocationSnapshot.empty) {
        console.log("No accepted locations found for the user.");
        setLoading(false);
        return;
      }

      console.log('Accepted location documents:', acceptedLocationSnapshot.docs);

      const cellsData = await Promise.all(
        acceptedLocationSnapshot.docs.map(async (doc) => {
          const data = doc.data();
          console.log('Accepted location data:', data);

          const chauffeurDoc = await getDoc(firestoreDoc(FIREBASE_DB, 'users', data.chauffeur_id));

          if (!chauffeurDoc.exists()) {
            console.log("No such chauffeur document!");
            return null;  
          }

          const chauffeurData = chauffeurDoc.data();
          console.log('Chauffeur data:', chauffeurData);

          return {
            id: doc.id,
            chauffeurName: `${chauffeurData.name} ${chauffeurData.familyName}`,
            chauffeurNumero: chauffeurData.num,
            codeConfirm: data.code_confirm,
          };
        })
      );

      const validCellsData = cellsData.filter(item => item !== null);

      console.log('Cells data:', validCellsData);
      setCells(validCellsData);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
    setLoading(false);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.item, { flexDirection: 'column', alignItems: 'center' }]}>
      <Text style={{ fontWeight: 'bold' }}>Le coli :</Text>
      <View style={styles.item2}>
        <View style={styles.cells}>
          <Text style={{ fontWeight: '600' }}>Chauffeur:</Text>
          <Text>{item.chauffeurName}</Text>
          <Text style={{ fontWeight: '600' }}>Numéro:</Text>
          <Text>{item.chauffeurNumero}</Text>
        </View>
        <View style={styles.cells}>
          <Text style={{ fontWeight: '600' }}>Code de confirmation:</Text>
          <Text>{item.codeConfirm}</Text>
        </View>
      </View>
    </View>
  );

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
        rotationValue.setValue(0); 
        setRotating(false);
      });
    }
  };

  const rotateAnimation = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 0.1, backgroundColor: 'rgba(255,255,255,0.9)', elevation: 5 }}>
        <View style={styles.Header}>
          <TouchableOpacity style={styles.backbutton} onPress={() => navigation.goBack()}>
            <AntDesign name="back" size={40} color={'black'} />
          </TouchableOpacity>
          <View>
            <Text style={styles.text}>Liste des colis à recevoir:</Text>
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
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text >Aucun colis à recevoir</Text>} 
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
    alignItems: 'center',
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
    alignItems: 'center',
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cells: {
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: 'black',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
  },
  buttoncont: {
    width: '100%',
    flex: 0.1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderRadius: 15,
    width: '80%',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Recevoire;
