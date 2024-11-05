import { Serving } from "@/types/openAi.types";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import React from "react";

export type ServingPickerProps = {
  possibleServings: Serving[];
  onAmountChange: (amount: number) => void;
  onServingIndexChange: (newIndex: number) => void;
};

export const ServingPicker = ({
  possibleServings,
  onAmountChange,
  onServingIndexChange,
}: ServingPickerProps) => {
  let numericOptions: number[] = [];
  for (let i = 0.05; i < 1000; i += 0.05) {
    numericOptions.push(parseFloat(i.toFixed(2)));
  }

  const getInitialAmount = () => {
    const amountToLookFor = parseFloat(possibleServings[0].number_of_units);
    const existsAlready = numericOptions.findIndex(
      (num) => num === amountToLookFor
    );
    if (existsAlready === -1) {
      numericOptions.push(amountToLookFor);
      numericOptions = numericOptions.sort((a, b) => a - b);
    }
    return amountToLookFor;
  };

  const [selectedUnitIndex, selectUnitIndex] = React.useState(0);
  const [amount, setAmount] = React.useState(getInitialAmount());

  const changeAmount = (newAmount: number) => {
    setAmount(newAmount);
    onAmountChange(parseFloat(newAmount));
  };

  const changeIndex = (newIndex: number) => {
    selectUnitIndex(newIndex);
    onServingIndexChange(parseFloat(newIndex));
  };

  React.useEffect(() => {
    if (possibleServings) {
      setAmount(
        parseFloat(possibleServings[selectedUnitIndex].number_of_units)
      );
    }
  }, [selectedUnitIndex]);

  return (
    <View style={styles.servingContainer}>
      <Picker
        selectedValue={amount}
        style={styles.servingTypePicker}
        onValueChange={(itemValue: number) => {
          changeAmount(itemValue);
        }}
      >
        {numericOptions.map((option) => (
          <Picker.Item label={option.toString()} value={option} />
        ))}
      </Picker>
      <Picker
        style={styles.servingTypePicker}
        selectedValue={selectedUnitIndex}
        onValueChange={(itemValue: number) => {
          changeIndex(itemValue);
        }}
      >
        {possibleServings.map((serving, index) => (
          <Picker.Item label={serving.measurement_description} value={index} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  servingContainer: {
    flexDirection: "row",
    width: "100%",
  },
  servingTypePicker: {
    width: "50%",
  },
});
