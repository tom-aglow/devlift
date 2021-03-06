import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import ExpandableList from 'react-native-expandable-section-list';
import * as firebase from 'firebase';

import NewTodo from './NewTodo';
import Todo from './Todo';
import colors from '../utils/colors.json';
import firebaseConfig from '../config';

class App extends Component {
  state = {
    inputValue: '',
    editingId: 0,
    lists: [],
    todos: [],
    openLists: [0]
  };

  firebaseDb = {};
  itemsRef = {};

  componentDidMount() {
    this.firebaseInit();
    this.listenForItems(this.itemsRef);
  }

  firebaseInit() {
    const firebaseApp = !firebase.apps.length
      ? firebase.initializeApp(firebaseConfig)
      : firebase.app();
    this.firebaseDb = firebaseApp.database();
    this.itemsRef = this.firebaseDb.ref();
  }

  listenForItems(itemsRef) {
    itemsRef.once('value', snap => {
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

  renderItem = rowItem => {
    return (
      <Todo
        key={rowItem.id}
        {...rowItem}
        isEditing={this.state.editingId === rowItem.id}
        onToggle={this.handleCheckBoxToggle}
        onEditToggle={this.handleToggleEditing}
        onUpdate={this.handleUpdateText}
        onDelete={this.handleRemoveItem}
        onBlur={this.handleBlurEditing}
      />
    );
  };

  renderSectionHeader = (section, sectionId) => {
    const openedTodoNum = this.state.todos.filter(
      todo => todo.listId === +sectionId && !todo.isCompleted
    ).length;

    return (
      <View style={styles.sectionHeaderContainer} data-test="list-header">
        <Text style={styles.sectionHeader}>{section.toUpperCase()}</Text>
        {!!openedTodoNum && (
          <Text style={styles.counter} data-test="open-todo-badge">
            {openedTodoNum}
          </Text>
        )}
      </View>
    );
  };

  makeSectionsArray() {
    const { lists, todos } = this.state;

    return lists.map(({ id, title }) => {
      const data = todos
        .filter(todo => todo.listId === id)
        .sort((a, b) => a.isCompleted - b.isCompleted);
      return { title, data };
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
        <ExpandableList
          style={styles.list}
          dataSource={sections}
          headerKey="title"
          memberKey="data"
          renderRow={this.renderItem}
          renderSectionHeaderX={this.renderSectionHeader}
          openOptions={this.state.openLists}
          data-test="todo-list"
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
