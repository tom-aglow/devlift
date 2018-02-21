import React, { Component } from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, TextInput } from "react-native";

class NewTodo extends Component {
  handleSubmit = () => {
    this.props.onAddItem({ list: "Personal" });
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#ffcfcc"
  },
  input: {
    flex: 1,
    height: 50
  }
});

NewTodo.propTypes = {
  inputValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onAddItem: PropTypes.func.isRequired
};

export default NewTodo;
