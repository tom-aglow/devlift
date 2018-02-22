import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  Keyboard,
  Platform
} from 'react-native';
import * as firebase from 'firebase';

import NewTodo from './NewTodo';
import Todo from './Todo';
import colors from '../utils/colors.json';
import firebaseConfig from '../credentials.json';

const firebaseApp = firebase.initializeApp(firebaseConfig);

class App extends Component {
  state = {
    inputValue: '',
    sections: [
      {
        title: 'Personal',
        data: [{ id: 1, text: 'foo bar', isCompleted: false }],
        key: 'Personal'
      },
      {
        title: 'Movies to Watch',
        data: [{ id: 2, text: 'Lost Highway', isCompleted: true }],
        key: 'Movies to Watch'
      }
    ]
  };

  addItemToList(sections, listName, value) {
    const DEFAULT_ID = Date.now();
    const DEFAULT_IS_COMPLETED = false;

    return sections.map(section => {
      if (section.title !== listName) return section;

      const newData = [
        ...section.data,
        {
          id: DEFAULT_ID,
          text: value,
          isCompleted: DEFAULT_IS_COMPLETED
        }
      ];

      return { ...section, data: newData };
    });
  }

  removeItemFromList(sections, listName, id) {
    return sections.map(section => {
      if (section.title !== listName) return section;

      const newData = section.data.filter(item => item.id !== id);
      return { ...section, data: newData };
    });
  }

  changeItemDataInList(sections, listName, id, newProps) {
    return sections.map(section => {
      if (section.title !== listName) return section;

      const newData = section.data.map(item => {
        if (item.id !== id) return item;

        return {
          ...item,
          ...newProps
        };
      });

      return { ...section, data: newData };
    });
  }

  handleAddItem = ({ list }) => {
    const { inputValue, sections } = this.state;

    if (!inputValue) return null;

    const newSections = this.addItemToList(sections, list, inputValue.trim());

    const newState = Object.assign({}, this.state, {
      sections: newSections,
      inputValue: ''
    });

    this.setState(newState);
  };

  handleRemoveItem = ({ list, id }) => {
    const { sections } = this.state;

    const newSections = this.removeItemFromList(sections, list, id);
    const newState = Object.assign({}, this.state, { sections: newSections });

    this.setState(newState);
  };

  handleInputChange = inputValue => {
    this.setState({ inputValue });
  };

  handleScrollListView = () => {
    Keyboard.dismiss();
  };

  handleCheckBoxToggle = ({ list, id, isCompleted }) => {
    const { sections } = this.state;

    const newSections = this.changeItemDataInList(sections, list, id, {
      isCompleted
    });
    const newState = Object.assign({}, this.state, { sections: newSections });

    this.setState(newState);
  };

  renderItem = ({ item, section }) => (
    <Todo
      key={item.id}
      {...item}
      list={section.title}
      onToggle={this.handleCheckBoxToggle}
      onDelete={this.handleRemoveItem}
    />
  );

  keyExtractor = ({ id }) => id;

  renderSectionHeader = ({ section }) => {
    const todos = this.state.sections.find(
      item => item.title === section.title
    );
    const openedTodoNum = todos.data.reduce((sum, cur) => {
      if (!cur.isCompleted) sum += 1;
      return sum;
    }, 0);

    return (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeader}>{section.title.toUpperCase()}</Text>
        {!!openedTodoNum && <Text style={styles.counter}>{openedTodoNum}</Text>}
      </View>
    );
  };

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
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: colors.white,
    ...Platform.select({
      ios: { paddingTop: 30 }
    })
  },
  sectionHeaderContainer: {
    marginTop: 20,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sectionHeader: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold'
  },
  list: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    width: '100%'
  },
  counter: {
    width: 25,
    height: 25,
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 12.5,
    textAlign: 'center',
    lineHeight: 23,
    fontSize: 12
  }
});

export default App;
