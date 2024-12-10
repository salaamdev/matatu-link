// src/components/common/CommunityActionButton.jsx
import React, { useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { FAB, Portal, Provider } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";

const CommunityActionButton = ({
  onAdd,
  onEdit,
  onDelete,
  selectionMode,
  setSelectionMode,
  selectedId,
  setSelectedId,
  type,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const animation = useState(new Animated.Value(0))[0];
  const { user } = useAuth();
  const isAdmin = user?.roleName === "admin";

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      friction: 5,
      tension: 80,
    }).start();
    setIsOpen(!isOpen);
  };

  const createAnimatedButton = (
    translateY,
    icon,
    onPress,
    label,
    color,
    disabled = false
  ) => {
    const scale = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return (
      <Animated.View
        style={[
          styles.actionButton,
          {
            transform: [{ translateY }, { scale }],
          },
        ]}
      >
        <FAB
          icon={() => <MaterialIcons name={icon} size={24} color="white" />}
          onPress={onPress}
          label={label}
          style={[styles.fab, { backgroundColor: color }]}
          disabled={disabled}
        />
      </Animated.View>
    );
  };

  return (
    <Provider>
      <Portal>
        <View style={styles.container}>
          {selectionMode ? (
            <>
              <FAB
                style={[styles.fab, { backgroundColor: "#8E8E93" }]}
                icon="close"
                onPress={() => {
                  setSelectionMode(false);
                  setSelectedId(null);
                }}
                label="Cancel"
              />
              {isAdmin &&
                createAnimatedButton(
                  -60,
                  "delete",
                  onDelete,
                  "Delete",
                  "#FF3B30",
                  !selectedId
                )}
              {createAnimatedButton(
                -120,
                "edit",
                onEdit,
                "Edit",
                "#007AFF",
                !selectedId
              )}
            </>
          ) : (
            <>
              {createAnimatedButton(-60, "add", onAdd, "Add", "#34C759")}
              <FAB
                style={[styles.fab, styles.mainFab]}
                icon={() => (
                  <Animated.View
                    style={{
                      transform: [
                        {
                          rotate: animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: ["0deg", "45deg"],
                          }),
                        },
                      ],
                    }}
                  >
                    <MaterialIcons name="more-vert" size={24} color="white" />
                  </Animated.View>
                )}
                onPress={toggleMenu}
              />
            </>
          )}
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
  },
  actionButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  fab: {
    margin: 8,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  mainFab: {
    backgroundColor: "#007AFF",
  },
});

export default CommunityActionButton;
