import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";

import * as firebase from "firebase";
import firebaseConfig from "../credentials.json";

const firebaseApp = firebase.initializeApp(firebaseConfig);

class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.instructions}>{"Hello world"}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});

export default App;
