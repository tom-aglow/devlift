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
    editingId: 0,
    lists: [],
    todos: []
  };

  itemsRef = firebaseApp.database().ref();

  componentDidMount() {
    this.listenForItems(this.itemsRef);
  }

  listenForItems(itemsRef) {
    itemsRef.on('value', snap => {
      const newState = Object.assign({}, this.state, {
        todos: snap.val().todos,
        lists: snap.val().lists
      });
      this.setState(newState);
    });
  }

  changeItemDataInList(todos, id, newProps) {
    return todos.map(todo => {
      if (todo.id !== id) return todo;

      return {
        ...todo,
        ...newProps
      };
    });
  }

  handleAddItem = listId => {
    const { inputValue, todos } = this.state;
    if (!inputValue) return null;

    const DEFAULT_ID = Date.now();
    const DEFAULT_IS_COMPLETED = false;

    const newTodo = {
      id: DEFAULT_ID,
      text: inputValue.trim(),
      isCompleted: DEFAULT_IS_COMPLETED,
      listId
    };

    const newTodos = [...todos, newTodo];

    const newState = Object.assign({}, this.state, {
      todos: newTodos,
      inputValue: ''
    });

    this.itemsRef.child('todos').set(newTodos);
    this.setState(newState);
  };

  handleRemoveItem = id => {
    const { todos } = this.state;

    const newTodos = todos.filter(todo => todo.id !== id);
    const newState = Object.assign({}, this.state, { todos: newTodos });

    this.itemsRef.child('todos').set(newTodos);
    this.setState(newState);
  };

  handleInputChange = inputValue => {
    this.setState({ inputValue });
  };

  handleScrollListView = () => {
    Keyboard.dismiss();
  };

  handleCheckBoxToggle = (id, isCompleted) => {
    const { todos } = this.state;

    const newTodos = this.changeItemDataInList(todos, id, { isCompleted });
    const newState = Object.assign({}, this.state, { todos: newTodos });

    this.itemsRef.child('todos').set(newTodos);
    this.setState(newState);
  };

  handleUpdateText = (id, text) => {
    const { todos } = this.state;

    const newTodos = this.changeItemDataInList(todos, id, { text });
    const newState = Object.assign({}, this.state, { todos: newTodos });

    this.itemsRef.child('todos').set(newTodos);
    this.setState(newState);
  };

  handleToggleEditing = id => {
    const newState = Object.assign({}, this.state, { editingId: id });
    this.setState(newState);
  };

  handleBlurEditing = () => {
    const newState = Object.assign({}, this.state, { editingId: 0 });
    this.setState(newState);
  };

  keyExtractor = ({ id }) => id;

  renderItem = ({ item }) => {
    return (
      <Todo
        key={item.id}
        {...item}
        isEditing={this.state.editingId === item.id}
        onToggle={this.handleCheckBoxToggle}
        onEditToggle={this.handleToggleEditing}
        onUpdate={this.handleUpdateText}
        onDelete={this.handleRemoveItem}
        onBlur={this.handleBlurEditing}
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
          lists={this.state.lists}
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
    marginBottom: 5,
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
