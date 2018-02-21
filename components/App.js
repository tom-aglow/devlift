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
import Todo from "./Todo";
import * as firebase from "firebase";
import firebaseConfig from "../credentials.json";

const firebaseApp = firebase.initializeApp(firebaseConfig);

class App extends Component {
  state = {
    inputValue: "",
    sections: [
      {
        title: "Personal",
        data: [{ id: 1, text: "foo bar", isCompleted: false }],
        key: "Personal"
      },
      {
        title: "Movies to Watch",
        data: [{ id: 2, text: "Lost Highway", isCompleted: true }],
        key: "Movies to Watch"
      }
    ]
  };

  handleAddItem = ({ list }) => {
    if (!this.state.inputValue) return null;

    const newSections = this.state.sections.map(section => {
      if (section.title !== list) return section;

      const newData = [
        ...section.data,
        {
          id: Date.now(),
          text: this.state.inputValue,
          isCompleted: false
        }
      ];

      return { ...section, data: newData };
    });

    const newState = Object.assign({}, this.state, {
      sections: newSections,
      inputValue: ""
    });

    this.setState(newState);
  };

  handleRemoveItem = ({ list, id }) => {
    const newSections = this.state.sections.map(section => {
      if (section.title !== list) return section;

      const newData = section.data.filter(item => item.id !== id);
      return { ...section, data: newData };
    });

    const newState = Object.assign({}, this.state, { sections: newSections });

    this.setState(newState);
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
    <Todo
      key={item.id}
      {...item}
      onToggle={this.handleCheckBoxToggle}
      onDelete={this.handleRemoveItem}
    />
  );

  keyExtractor = ({ id }) => id;

  renderSectionHeader = ({ section }) => (
    <Text style={styles.sectionHeader}>{section.title.toUpperCase()}</Text>
  );

  render() {
    return (
      <View style={styles.container}>
        <NewTodo
          inputValue={this.state.inputValue}
          onAddItem={this.handleAddItem}
          onChange={this.handleInputChange}
        />
        <SectionList
          style={styles.list}
          sections={this.state.sections}
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
