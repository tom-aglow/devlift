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
    lists: [{ id: 1, title: 'Personal' }, { id: 2, title: 'Movies to Watch' }],
    todos: [
      { id: 1, text: 'foo', isCompleted: false, listId: 1 },
      { id: 2, text: 'bar', isCompleted: true, listId: 2 }
    ]
  };

  itemsRef = firebaseApp.database().ref();

  componentDidMount() {
    this.listenForItems(this.itemsRef);
  }

  static addItemToList({ todos, listId, value }) {
    const DEFAULT_ID = Date.now();
    const DEFAULT_IS_COMPLETED = false;

    return [
      ...todos,
      {
        id: DEFAULT_ID,
        text: value,
        isCompleted: DEFAULT_IS_COMPLETED,
        listId
      }
    ];
  }

  removeItemFromList({ todos, id }) {
    return todos.filter(todo => todo.id !== id);
  }

  changeItemDataInList({ todos, id, newProps }) {
    return todos.map(todo => {
      if (todo.id !== id) return todo;

      return {
        ...todo,
        ...newProps
      };
    });
  }

  handleAddItem = ({ listId }) => {
    const { inputValue, todos } = this.state;

    if (!inputValue) return null;

    const newTodos = App.addItemToList({
      todos,
      listId,
      value: inputValue.trim()
    });

    const newState = Object.assign({}, this.state, {
      todos: newTodos,
      inputValue: ''
    });

    this.setState(newState);
  };

  handleRemoveItem = ({ id }) => {
    const { todos } = this.state;

    const newTodos = this.removeItemFromList({ todos, id });
    const newState = Object.assign({}, this.state, { todos: newTodos });

    this.setState(newState);
  };

  handleInputChange = inputValue => {
    this.setState({ inputValue });
  };

  handleScrollListView = () => {
    Keyboard.dismiss();
  };

  handleCheckBoxToggle = ({ id, isCompleted }) => {
    const { todos } = this.state;

    const newTodos = this.changeItemDataInList({
      todos,
      id,
      newProps: { isCompleted }
    });
    const newState = Object.assign({}, this.state, { todos: newTodos });

    this.setState(newState);
  };

  listenForItems(itemsRef) {
    itemsRef.on('value', snap => {
      console.log('value: ', snap.val());
    });
  }

  keyExtractor = ({ id }) => id;

  renderItem = ({ item }) => {
    return (
      <Todo
        key={item.id}
        {...item}
        onToggle={this.handleCheckBoxToggle}
        onDelete={this.handleRemoveItem}
      />
    );
  };

  renderSectionHeader = ({ section }) => {
    const openedTodoNum = section.data.reduce((sum, cur) => {
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

  makeSectionsArray() {
    const { lists, todos } = this.state;

    return lists.map(({ id, title }) => {
      const data = todos.filter(todo => todo.listId === id);
      return {
        title,
        data,
        key: title
      };
    });
  }

  render() {
    const sections = this.makeSectionsArray();

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
