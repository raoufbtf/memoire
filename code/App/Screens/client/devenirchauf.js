import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ButtonM from '../../Components/button';
import { useUser } from '../../UserContext';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../FireBaseConfig";

function Devenirchauf({ navigation }) {
  const [numPermis, setNumPermis] = useState('');
  const [tailleMax, setTailleMax] = useState('');
  const [deja, setDeja] = useState(false); // This state is used to check if the user has already submitted the form
  const { user } = useUser();

  useEffect(() => {
    const checkIfDejaSubmitted = async () => {
      try {
        if (user) {
          const userRef = doc(FIREBASE_DB, "users", user.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setDeja(userData.deja || false); // Update deja state based on the value in the user's document
          } else {
            console.log("No such document!");
          }
        }
      } catch (error) {
        console.error("Error checking if user already submitted:", error.message);
      }
    };

    checkIfDejaSubmitted();
  }, [user]);

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      // Check if user already submitted request
      if (deja) {
        console.log("Vous avez déjà soumis une demande.");
        return;
      }

      // Update Firestore with new chauffeur data
      const covoitureurRef = doc(FIREBASE_DB, "covoitureur", user.uid);
      await setDoc(covoitureurRef, {
        numPermis: numPermis, // You need to replace this with the actual photo path or upload mechanism
        poidmax: tailleMax
      });

      // Update the user's document to indicate that the form has been submitted
      const userRef = doc(FIREBASE_DB, "users", user.uid);
      await setDoc(userRef, { deja: true }, { merge: true });

      console.log("Demande de devenir chauffeur soumise avec succès.");
      setDeja(true); // Update state to indicate request submitted
    } catch (error) {
      console.error("Erreur lors de la soumission de la demande:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {!deja ? (
        <>
          <View style={styles.screentext}>
            <Text style={styles.title}>Devenir chauffeur</Text>
            <Text style={styles.text}>
              Vous voulez devenir chauffeur et gagner un peu d'argent ? Remplissez ce formulaire.
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Numéro de permis de conduire:</Text>
            <TextInput
              placeholder="ex:a04178932"
              value={numPermis}
              onChangeText={setNumPermis}
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Taille max :</Text>
            <Picker
              selectedValue={tailleMax}
              style={styles.picker}
              onValueChange={(itemValue) => setTailleMax(itemValue)}>
              <Picker.Item label="Taille de colis" value="" />
              <Picker.Item label="petit" value="S" />
              <Picker.Item label="moyen" value="M" />
              <Picker.Item label="grand" value="L" />
            </Picker>
          </View>
          <ButtonM style={styles.button} fnc={handleSubmit}>Envoyer</ButtonM>
          <ButtonM style={[styles.button,{backgroundColor:"#B89F92",}]} fnc={() => navigation.navigate("profil")}>Retourner</ButtonM>
        </>
      ) : (
        <View style={styles.screentext}>
          <Text style={styles.title}>Devenir chauffeur</Text>
          <Text style={styles.text}>Vous avez déjà demandé un changement de statut.</Text>
          <Text style={styles.text}>Attendez la réponse de l'administrateur.</Text>
          <ButtonM style={[styles.button,{backgroundColor:"#B89F92",}]} fnc={() => navigation.navigate("profil")}>Retourner</ButtonM>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button:{
    margin:20
  },

  picker: {
    width: '100%',
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 5,
    marginBottom: 25,
    padding: 10,
  },
  inputContainer: {
    width: '90%',
    marginTop: 15,
    alignSelf: 'center',
  },
  label: {
    fontWeight: '500',
    fontSize: 17,
    marginLeft: 20,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 25,
    padding: 10,
    alignSelf: 'center',
  },
  container: {
    backgroundColor: 'rgba(239, 32, 77, 0.1)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  screentext: {
    alignItems: 'center',
    width: '90%',
  },
  title: {
    fontSize: 25,
    fontWeight: '700',
    textAlign: 'center',
    paddingTop: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    paddingTop: 10,
  },
});

export default Devenirchauf;
