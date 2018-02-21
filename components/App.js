import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";

import NewTodo from "./NewTodo.js";
import * as firebase from "firebase";
import firebaseConfig from "../credentials.json";

const firebaseApp = firebase.initializeApp(firebaseConfig);

class App extends Component {
  state = {
    inputValue: "",
    items: []
  };

  handleAddItem = () => {
    if (!this.state.inputValue) return null;

    const newItems = [
      ...this.state.items,
      {
        id: Date.now(),
        text: this.state.inputValue,
        completed: false
      }
    ];

    this.setState({
      items: newItems,
      inputValue: ""
    });
  };

  handleInputChange = inputValue => {
    this.setState({ inputValue });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>{"Hello world"}</Text>
        <NewTodo
          inputValue={this.state.inputValue}
          onAddItem={this.handleAddItem}
          onChange={this.handleInputChange}
        />
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
  }
});

export default App;
