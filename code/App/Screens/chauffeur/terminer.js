import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, deleteDoc, addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FireBaseConfig';
import ButtonM from '../../Components/button';
import { useUser } from '../../UserContext';

function Terminer() {
    const { user } = useUser();
    const navigation = useNavigation();
    const route = useRoute();
    const { item } = route.params;  
    const [code, setCode] = useState("");

    const handleConfirm = async () => {
        if (code === item.code_confirm) {
            try {
                const completedLocationsRef = collection(FIREBASE_DB, 'terminéColis');
                await addDoc(completedLocationsRef, {
                    chauffeur_id: user.uid,
                    ...item,
                });

                
                const locationDoc = collection(FIREBASE_DB, 'acceptedColis');
                const d = query(locationDoc, where('id', '==', item.id));
                const querySnapshots = await getDocs(d);

                for (const docSnapshot of querySnapshots.docs) {
                    await deleteDoc(doc(locationDoc, docSnapshot.id));
                }

                Alert.alert('Success', 'La location a été supprimée avec succès.');
                navigation.goBack();
                
            } catch (error) {
                console.error('Error completing location:', error);
                Alert.alert('Erreur', 'Une erreur s\'est produite. Veuillez réessayer.');
            }
        } else {
            Alert.alert('Code Incorrect', 'Le code que vous avez entré est incorrect.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.screen}>
                <Text style={styles.title}>Vous venez à la porte du client?</Text>
                <Text style={styles.text}>Demander le code de confirmation au Client.</Text>
                <View style={{ flex: 0.7, width: "100%", alignItems: "center", justifyContent: "center" }}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setCode}
                        value={code}
                        placeholder="Enter le code du client"
                    />
                </View>
                <ButtonM style={styles.button} fnc={handleConfirm}>Terminer</ButtonM>
                <ButtonM fnc={() => navigation.goBack()}>Retourner</ButtonM>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(239, 32, 77, 0.1)',
        flex: 1, alignItems: "center",
        justifyContent: "center",
    },
    screen: {
        flex: 1,
        backgroundColor: '#fff',
        width: "95%",
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "flex-start",
        margin: 20,
        borderRadius: 25,
        paddingTop: 10,
    },
    title: {
        fontSize: 25,
        fontWeight: "700",
        textAlign: "center",
        paddingTop: 10
    },
    text: {
        fontSize: 18,
        fontWeight: "500",
        textAlign: "center",
        paddingTop: 10
    },
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
    button: {
        marginBottom: 30,
        backgroundColor: "#B89F92",
    }
});

export default Terminer;
