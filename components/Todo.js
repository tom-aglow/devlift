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

class Todo extends Component {
  handleToggleClick = () => {
    const { id, onToggle, isCompleted } = this.props;
    const newIsCompleted = !isCompleted;
    onToggle({ id, isCompleted: newIsCompleted });
  };

  handleDeleteClick = () => {
    const { id, onDelete } = this.props;
    onDelete({ id });
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

  render() {
    const { text, isCompleted, isEditing, onBlur } = this.props;

    const textComponent = (
      <TouchableOpacity
        style={styles.textWrapper}
        onLongPress={this.handleEditClick}
      >
        <Text style={[styles.text, isCompleted && styles.isCompleted]}>
          {text}
        </Text>
      </TouchableOpacity>
    );

    const removeButton = isCompleted && (
      <TouchableOpacity onPress={this.handleDeleteClick}>
        <Image source={require('../img/button_delete.png')} />
      </TouchableOpacity>
    );

    const editingComponent = (
      <View style={styles.textWrapper}>
        <TextInput
          onChangeText={this.handleTextUpdate}
          autoFocus
          value={text}
          style={styles.input}
          onBlur={onBlur}
          multiline
        />
      </View>
    );

    return (
      <View style={styles.container}>
        <CheckBox
          isChecked={isCompleted}
          onClick={this.handleToggleClick}
          checkedImage={
            <Image source={require('../img/checkbox_checked.png')} />
          }
          unCheckedImage={
            <Image source={require('../img/checkbox_unchecked.png')} />
          }
        />
        {isEditing ? editingComponent : textComponent}
        {!isEditing && removeButton}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
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
    textDecorationLine: 'line-through'
  },
  input: {
    height: 100,
    flex: 1,
    backgroundColor: '#eaeaa7'
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
