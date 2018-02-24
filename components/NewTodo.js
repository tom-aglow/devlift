import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  TextInput,
  Image,
  TouchableOpacity
} from 'react-native';
import RadioForm, {
  RadioButton,
  RadioButtonLabel
} from 'react-native-simple-radio-button';

import colors from '../utils/colors.json';

class NewTodo extends Component {
  state = {
    listId: 1,
    areChipsVisible: false
  };

  handleSubmit = () => {
    this.props.onAddItem({ listId: this.state.listId });
  };

  handleRadioButtonSelect = value => {
    const newState = Object.assign({}, this.state, { listId: value });
    this.setState(newState);
  };

  handleInputFocus = () => {
    const newState = Object.assign({}, this.state, { areChipsVisible: true });
    this.setState(newState);
  };

  handleInputBlur = () => {
    const newState = Object.assign({}, this.state, { areChipsVisible: false });
    this.setState(newState);
    this.props.onChange('');
  };

  renderInput() {
    const { inputValue, onChange } = this.props;

    return (
      <View style={styles.inputWrapper}>
        <TextInput
          value={inputValue}
          onChangeText={onChange}
          onSubmitEditing={this.handleSubmit}
          onFocus={this.handleInputFocus}
          onBlur={this.handleInputBlur}
          placeholder="I want to..."
          blurOnSubmit={false}
          returnKeyType="done"
          style={styles.input}
        />
        <TouchableOpacity onPress={this.handleSubmit}>
          <Image source={require('../img/button_add.png')} />
        </TouchableOpacity>
      </View>
    );
  }

  renderListChips() {
    const chips = this.props.lists.map(({ title, id }) => {
      const isActive = this.state.listId === id;

      return (
        <RadioButton labelHorizontal={true} key={id}>
          <RadioButtonLabel
            obj={{ label: title, value: id }}
            index={id}
            labelHorizontal={true}
            onPress={this.handleRadioButtonSelect}
            labelStyle={[
              styles.radioButton,
              isActive && styles.radioButtonActive
            ]}
            labelWrapStyle={[
              styles.radioButtonWrapper,
              isActive && styles.radioButtonWrapperActive
            ]}
          />
        </RadioButton>
      );
    });

    return (
      <View>
        <RadioForm formHorizontal={true}>{chips}</RadioForm>
      </View>
    );
  }

  render() {
    const { areChipsVisible } = this.state;

    return (
      <View style={styles.header}>
        {this.renderInput()}
        {areChipsVisible && this.renderListChips()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 10,
    flexDirection: 'column',
    backgroundColor: colors.white,
    paddingBottom: 5,
    paddingTop: 15,
    elevation: 4
  },
  inputWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 15
  },
  input: {
    flex: 1,
    height: 30,
    fontFamily: 'OpenSans-Light',
    borderColor: colors.lightGrey,
    borderWidth: 1,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    paddingHorizontal: 15,
    marginRight: 20
  },
  radioButtonWrapper: {
    height: 30,
    marginLeft: 10,
    borderColor: colors.primary,
    borderWidth: 1,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5
  },
  radioButtonWrapperActive: {
    backgroundColor: colors.primary
  },
  radioButton: {
    color: colors.primary,
    fontFamily: 'OpenSans-Light',
    paddingLeft: 0
  },
  radioButtonActive: {
    color: colors.white
  }
});

NewTodo.propTypes = {
  inputValue: PropTypes.string.isRequired,
  lists: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired
    })
  ),
  onChange: PropTypes.func.isRequired,
  onAddItem: PropTypes.func.isRequired
};

export default NewTodo;
