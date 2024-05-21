import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const DateTimePickerComponent = ({ onDateChange }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    onDateChange(date);
    hideDatePicker();
  };

  return (
    <View>
      <TouchableOpacity style={styles.input} onPress={showDatePicker}>
        {!selectedDate && (<Text>Entrer la date de départ</Text>)}
        {selectedDate && (
          <Text>Date sélectionnée : {selectedDate}</Text>
        )}
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        locale="fr"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    justifyContent: "center",
    alignSelf: "center",
    width: '100%',
    height: "auto",
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
  },
});

export default DateTimePickerComponent;
