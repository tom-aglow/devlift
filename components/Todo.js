import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import CheckBox from 'react-native-check-box';

class Row extends Component {
  handleToggleClick = () => {
    const { list, id, onToggle, isCompleted } = this.props;
    const newIsCompleted = !isCompleted;
    onToggle({ list, id, isCompleted: newIsCompleted });
  };

  handleDeleteClick = () => {
    const { id, onDelete, list } = this.props;
    onDelete({ list, id });
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

Row.propTypes = {
  list: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  isCompleted: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default Row;
