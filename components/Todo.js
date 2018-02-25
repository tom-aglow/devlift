import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput
} from 'react-native';
import CheckBox from 'react-native-check-box';

import colors from '../utils/colors.json';

class Todo extends Component {
  handleToggleClick = () => {
    const { id, onToggle, isCompleted } = this.props;
    const newIsCompleted = !isCompleted;
    onToggle(id, newIsCompleted);
  };

  handleDeleteClick = () => {
    const { id, onDelete } = this.props;
    onDelete(id);
  };

  handleEditClick = () => {
    const { id, onEditToggle, isCompleted } = this.props;
    if (!isCompleted) {
      onEditToggle(id);
    }
  };

  handleTextUpdate = value => {
    this.props.onUpdate(this.props.id, value);
  };

  renderTextComponent() {
    const { text, isCompleted } = this.props;

    return (
      <TouchableOpacity
        style={styles.textWrapper}
        onLongPress={this.handleEditClick}
        data-test="todo-text"
      >
        <Text style={[styles.text, isCompleted && styles.isCompleted]}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  }

  renderRemoveButton() {
    const { isCompleted } = this.props;

    return (
      isCompleted && (
        <TouchableOpacity
          onPress={this.handleDeleteClick}
          data-test="remove-todo-btn"
        >
          <Image
            source={require('../img/button_delete.png')}
            style={styles.actionImage}
          />
        </TouchableOpacity>
      )
    );
  }

  renderEditingComponent() {
    const { text, onBlur } = this.props;

    return (
      <View style={styles.textWrapper}>
        <TextInput
          onChangeText={this.handleTextUpdate}
          autoFocus
          value={text}
          style={styles.input}
          onBlur={onBlur}
          multiline
          data-test="todo-edit-input"
        />
      </View>
    );
  }

  render() {
    const { isCompleted, isEditing } = this.props;

    return (
      <View style={styles.container} data-test="todo">
        <CheckBox
          isChecked={isCompleted}
          onClick={this.handleToggleClick}
          checkedImage={
            <Image
              source={require('../img/checkbox_checked.png')}
              style={styles.actionImage}
            />
          }
          unCheckedImage={
            <Image
              source={require('../img/checkbox_unchecked.png')}
              style={styles.actionImage}
            />
          }
          data-test="todo-checkbox"
        />
        {isEditing ? this.renderEditingComponent() : this.renderTextComponent()}
        {!isEditing && this.renderRemoveButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  textWrapper: {
    flex: 1,
    marginLeft: 15
  },
  text: {
    fontSize: 16,
    fontFamily: 'OpenSans-Light'
  },
  isCompleted: {
    textDecorationLine: 'line-through',
    color: colors.mediumGrey
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'OpenSans-Light',
    paddingTop: 0,
    color: colors.primary
  },
  actionImage: {
    marginTop: 4
  }
});

Todo.propTypes = {
  id: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  isCompleted: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  listId: PropTypes.number.isRequired,
  onToggle: PropTypes.func.isRequired,
  onEditToggle: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default Todo;
