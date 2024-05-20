import React, { useState } from 'react';
import { StyleSheet, View, ImageBackground, TouchableOpacity,Text} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import ButtonM from '../../Components/button';

function Chaufmap() {
    const [isCheck, setisCheck] = useState(false);
    const toggleCheckBox =()=>{
        setisCheck(!isCheck);
    }

    return (
        <View style={styles.container}>
            <View style={styles.map}>
                <ImageBackground
                    source={require('../assets/map.png')}
                    style={styles.backgroundImage}
                > 
                    <View style={styles.form}>
                        <View>
                            <TouchableOpacity onPress={toggleCheckBox} style={styles.checkBox}>
                                <Ionicons name={isCheck? 'checkbox-outline':'square-outline'} size={50} color='black' style={{backgroundColor: isCheck? "rgba(239, 32, 77,1)":"rgba(255, 255, 255,1)",borderRadius:5,height:50,width:50 }} />
                                <Text style={{fontWeight:"bold",fontSize:25, textDecorationLine: isCheck?"none":"line-through",marginLeft:5 }}>vous ete disponibilite </Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <ButtonM style={styles.button} > Ajouter un trajet </ButtonM>

                        </View>
                        
                        
                    </View>
                </ImageBackground>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
    container: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center"
    },
    checkBox:
    {
        
        flexDirection:"row",
         alignItems:"center",
         justifyContent:"center"

        
    }, 
    button:
    {  marginTop:10,
        borderRadius:15

    }
    
        

   
   
});

export default Chaufmap;
