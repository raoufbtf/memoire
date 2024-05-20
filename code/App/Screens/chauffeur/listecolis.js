import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated,FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';

function Listenvoi({ navigation }) {
    const data = [
        { id: '1', name: 'Item 2',emeteur:"raouf",distinateur: "adem",etat:"en cours de livresant" },
        { id: '2', name: 'Item 3',emeteur:"raouf",distinateur: "adem",etat:"liv terminer"  },
        
       
      ];
      const renderItem = ({ item }) => (
        <View style={[styles.item,{flexDirection:"column",alignItems:"center"}]}>
            <Text> le colis : {item.name}</Text>
           <TouchableOpacity style={[styles.item,styles.item2]}>
            <View>
          <Text>Emeteur:</Text>
          <Text>{item.emeteur}</Text>
          </View>
          <View>
          <Text>Distinateur:</Text>
          <Text>{item.distinateur}</Text>
          </View>
          <View>
          <Text>Etat:</Text>
          <Text>{item.etat}</Text>
          </View>
          </TouchableOpacity>
        </View>
      );
    
    const [rotating, setRotating] = useState(false);
    const rotationValue = useRef(new Animated.Value(0)).current;
    const reload = () => {
        rotateIcon();
        console.log('====================================');
        console.log("rotate");
        console.log('====================================');
    }

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
                        <Text style={styles.text}>Liste des colis a livre :</Text>
                    </View>
                    <View>
                        <TouchableOpacity style={[styles.backbutton, { marginLeft: 0, marginRight: 5 }]} onPress={reload }>
                            <Animated.View style={{ transform: [{ rotate: rotating ? rotateAnimation : '0deg' }] }}>
                            <Ionicons name="reload-circle-outline" size={50} color={'black'} />
                            </Animated.View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.liste}>
               <FlatList 
                 data={data}
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
        fontSize: 25,
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
    item:
    {
        marginTop:10,
        width:"95%",
        backgroundColor:'rgba(239, 32, 77, 0.6)',
        borderRadius:5,
        flexDirection:"row",
        alignItems:"center",
        alignSelf:"center",
        justifyContent:"space-between",
        padding:5
        

    },item2:
    {
        padding:10,
        alignItems: 'center',
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "grey" ,
        borderRadius:20
    
    }
});

export default Listenvoi;
