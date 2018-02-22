import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
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

  render() {
    const { text, isCompleted } = this.props;
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
        <View style={styles.textWrapper}>
          <Text style={[styles.text, isCompleted && styles.isCompleted]}>
            {text}
          </Text>
        </View>
        {isCompleted && (
          <TouchableOpacity onPress={this.handleDeleteClick}>
            <Image source={require('../img/button_delete.png')} />
          </TouchableOpacity>
        )}
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
  }
});

Todo.propTypes = {
  id: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  isCompleted: PropTypes.bool.isRequired,
  listId: PropTypes.number.isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default Todo;
