import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Button } from "react-native-paper";

const App = () => {
    return (
        <View style={StyleSheet.container}>
            <Button mode="contained"  onPress={() => alert('Lgeandose')}> Login</Button>
            <Button mode="contained"  onPress={() => alert('Registrandose')}> Registro</Button>
        </View>
    );
};

const stykes = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" }
})

export default App;