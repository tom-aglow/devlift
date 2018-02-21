import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TextInput, Image } from 'react-native';

import colors from '../utils/colors.json';

class NewTodo extends Component {
  handleSubmit = () => {
    this.props.onAddItem({ list: 'Personal' });
  };

  render() {
    const { inputValue, onChange } = this.props;
    return (
      <View style={styles.header}>
        <TextInput
          value={inputValue}
          onChangeText={onChange}
          onSubmitEditing={this.handleSubmit}
          placeholder="I want to..."
          blurOnSubmit={false}
          returnKeyType="done"
          style={styles.input}
        />
        <Image source={require('../img/button_add.png')} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingBottom: 15,
    paddingTop: 15,
    elevation: 4
  },
  input: {
    flex: 1,
    height: 30,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    paddingHorizontal: 15,
    marginRight: 20
  }
});

NewTodo.propTypes = {
  inputValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onAddItem: PropTypes.func.isRequired
};

export default NewTodo;
