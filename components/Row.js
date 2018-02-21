import React, { Component } from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, View, Image } from "react-native";
import CheckBox from "react-native-check-box";

class Row extends Component {
  handleOnClick = () => {
    const { id, onToggle, isCompleted } = this.props;
    const newIsCompleted = !isCompleted;
    onToggle(id, newIsCompleted);
  };

  render() {
    const { text, isCompleted } = this.props;
    return (
      <View style={styles.container}>
        <CheckBox
          isChecked={isCompleted}
          onClick={this.handleOnClick}
          checkedImage={
            <Image source={require("../img/checkbox_checked.png")} />
          }
          unCheckedImage={
            <Image source={require("../img/checkbox_unchecked.png")} />
          }
        />
        <View style={styles.textWrapper}>
          <Text style={[styles.text, isCompleted && styles.isCompleted]}>
            {text}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  textWrapper: {
    flex: 1,
    marginLeft: 15
  },
  text: {
    fontSize: 16
  },
  isCompleted: {
    textDecorationLine: "line-through"
  }
});

Row.propTypes = {
  id: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  isCompleted: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
};

export default Row;
