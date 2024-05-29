import React, { useState,useEffect  } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import  Textedit from '../../Components/textedit';
import { useUser } from '../../UserContext';
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../FireBaseConfig";
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../FireBaseConfig';

function Profil_client({ navigation }) {
  const [avoirpic, setavoirpic] = useState(false);
  const { user, setUser } = useUser();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user) {
          const userRef = doc(FIREBASE_DB, "users", user.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.log("No such document!");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, [user]);
  const handleLogout =  async () => {
    try {
      await signOut(FIREBASE_AUTH);
      setUser(null); 
      navigation.navigate('Login'); 
    } catch (error) {
      console.log('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={ styles.backbutton} onPress={()=>navigation.navigate("home")}>
          <AntDesign name='back' size={40} color={"black"} />
        </TouchableOpacity>
       <Text  style={{fontSize:30,fontWeight:"600"}}>Profile</Text>
       <TouchableOpacity style={[ styles.backbutton,{backgroundColor:'rgba(239, 32, 77, 1)',}]} onPress={handleLogout}>
       <MaterialIcons name="logout" size={40} color="black" />
        </TouchableOpacity>
      
      </View>
      <View style={styles.container2}>
      {!avoirpic &&
          <TouchableOpacity style={[styles.backbutton, { marginTop:30 ,  backgroundColor:"#B89F92",elevation:20,height:100, width: 100, borderRadius: 50 }]}>
            <Text style={{fontSize:40,fontWeight:"bold"}}>{userData && userData.name ? userData.name[0] : "D"}</Text>
          </TouchableOpacity>}
        {/* ici on met l'image stock dans la bdd */}
        <Text style={{marginTop:20,fontSize:30,fontWeight:"500"}}> {userData && userData.name ? userData.name : "Default Name"} {userData && userData.familyName ? userData.familyName : "Default family"}</Text>
        <Textedit label="l'adresse" > {userData && userData.email ? userData.email : "Default email"}</Textedit>
        <Textedit label="Numero de telephone" > {userData && userData.num ? userData.num : "Default num"}</Textedit>
        <Textedit label="le idantifiant de reception" > {userData && userData.idclient ? userData.idclient : "Default num"}</Textedit>
        
      </View>
      <View style={{flex:0.1,width:"90%",alignItems: "center"}}>
      <TouchableOpacity  style={styles.button} onPress={() => (navigation.navigate('Devenirchauf'))}> 
        <Text style={{fontWeight:"700",fontSize:25}}>Devenir un chaufeur </Text>
     </TouchableOpacity>
     </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backbutton: {
    backgroundColor: "#C5C6C7",
    height: 50,
    width: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignContent: "center",
    alignItems: "center"
  },
  header: {
    flex: 0.1,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
  },
  container2:{
   
    width:"90%",
    backgroundColor:"#fff",
    borderRadius:10,
    justifyContent: "flex-start",
    alignItems: "center",
    elevation:10,
    flex:0.8

  },
  button: {
    position:"absolute",
    bottom:"10",
    borderRadius:25,
    backgroundColor:"#B89F92",
    height:50,
    width:"70%",
    alignItems: 'center',
    justifyContent:"center"
               
   },
});

export default Profil_client;
