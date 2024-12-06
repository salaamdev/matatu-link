// src\screens\matatu\components\MatatuActionButton.jsx
import React, { useState, useEffect } from "react";
import { StyleSheet, Animated, View, Platform, Dimensions } from "react-native";
import { FAB, Portal, Provider } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

const MatatuActionButton = ({ onAdd, onUpdate, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const animation = useState(new Animated.Value(0))[0];
  const backdropAnimation = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.spring(animation, {
        toValue: isOpen ? 1 : 0,
        useNativeDriver: true,
        friction: 5,
        tension: 80,
      }),
      Animated.timing(backdropAnimation, {
        toValue: isOpen ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const createAnimatedButton = (translateY, icon, onPress, label, color) => {
    const scale = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return (
      <Animated.View
        style={[
          styles.actionButton,
          {
            opacity: animation,
            transform: [{ translateY }, { scale }],
          },
        ]}
      >
        <FAB
          icon={() => <MaterialIcons name={icon} size={24} color="white" />}
          onPress={onPress}
          label={label}
          color="white"
          style={[styles.fab, { backgroundColor: color }]}
          labelStyle={styles.fabLabel}
          accessibilityLabel={`${label} item`}
        />
      </Animated.View>
    );
  };

  return (
    <Provider>
      <Portal>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
              }),
            },
          ]}
        >
          <BlurView intensity={20} style={StyleSheet.absoluteFill} />
        </Animated.View>
        <View style={styles.container}>
          {createAnimatedButton(
            animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -180],
            }),
            "delete",
            onDelete,
            "",
            "#FF3B30"
          )}
          {createAnimatedButton(
            animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -120],
            }),
            "edit",
            onUpdate,
            "",
            "#FF9500"
          )}
          {createAnimatedButton(
            animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -60],
            }),
            "add",
            onAdd,
            "",
            "#34C759"
          )}
          <Animated.View
            style={[
              styles.mainFabContainer,
              {
                transform: [
                  {
                    rotate: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "45deg"],
                    }),
                  },
                ],
              },
            ]}
          >
            <FAB
              icon={() => <MaterialIcons name="add" size={24} color="white" />}
              onPress={toggleMenu}
              style={styles.mainFab}
              color="white"
              accessibilityLabel="Toggle menu"
            />
          </Animated.View>
        </View>
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 16,
    right: 16,
    alignItems: "center",
  },
  actionButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  fab: {
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabLabel: {
    fontWeight: "bold",
    fontSize: 14,
    marginHorizontal: 8,
  },
  mainFabContainer: {
    borderRadius: 28,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
  mainFab: {
    backgroundColor: "#007AFF",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default MatatuActionButton;
