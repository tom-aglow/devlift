import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  Keyboard,
  Platform
} from "react-native";

import NewTodo from "./NewTodo";
import Row from "./Row";
import * as firebase from "firebase";
import firebaseConfig from "../credentials.json";

const firebaseApp = firebase.initializeApp(firebaseConfig);

class App extends Component {
  state = {
    inputValue: "",
    items: [{ id: Date.now(), text: "foo bar", isCompleted: false }]
  };

  handleAddItem = () => {
    if (!this.state.inputValue) return null;

    const newItems = [
      ...this.state.items,
      {
        id: Date.now(),
        text: this.state.inputValue,
        isCompleted: false
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

  handleScrollListView = () => {
    Keyboard.dismiss();
  };

  handleCheckBoxToggle = (id, isCompleted) => {
    const newItems = this.state.items.map(item => {
      if (item.id !== id) return item;
      return { ...item, isCompleted };
    });

    this.setState({ items: newItems });
  };

  renderItem = ({ item }) => (
    <Row key={item.id} {...item} onToggle={this.handleCheckBoxToggle} />
  );

  keyExtractor = ({ id }) => id;

  renderSectionHeader = ({ section }) => (
    <Text style={styles.sectionHeader}>{section.title.toUpperCase()}</Text>
  );

  render() {
    const sections = [
      {
        title: "Personal",
        data: this.state.items,
        key: "Personal"
      }
    ];

    return (
      <View style={styles.container}>
        <NewTodo
          inputValue={this.state.inputValue}
          onAddItem={this.handleAddItem}
          onChange={this.handleInputChange}
        />
        <SectionList
          style={styles.list}
          sections={sections}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSectionHeader}
          enableEmptySections
          onScroll={this.handleScrollListView}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    ...Platform.select({
      ios: { paddingTop: 30 }
    })
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "700"
  },
  list: {
    backgroundColor: "#b0beff",
    paddingHorizontal: 10,
    width: "100%"
  },
  separator: {
    borderWidth: 1,
    borderColor: "#F5FCFF"
  }
});

export default App;
