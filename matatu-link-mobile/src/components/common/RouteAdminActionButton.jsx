// src/components/common/RouteAdminActionButton.jsx
import React, { useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { FAB } from "react-native-paper";

const RouteAdminActionButton = ({
  onAdd,
  onEdit,
  onDelete,
  selectionMode,
  setSelectionMode,
  selectedId,
  setSelectedId,
}) => {
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const toggleAdminMenu = () => {
    if (isAdminMenuOpen) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
    setIsAdminMenuOpen(!isAdminMenuOpen);
  };

  return (
    <View style={styles.fabContainer}>
      {selectionMode ? (
        <>
          <FAB
            style={[styles.fab, styles.fabCancel]}
            icon="close"
            onPress={() => {
              setSelectionMode(false);
              setSelectedId(null);
              setIsAdminMenuOpen(false);
            }}
            label="Cancel"
          />
          <FAB
            style={[styles.fab, styles.fabDelete]}
            icon="delete"
            onPress={onDelete}
            label="Delete"
          />
          <FAB
            style={[styles.fab, styles.fabEdit]}
            icon="pencil"
            onPress={onEdit}
            label="Edit"
          />
        </>
      ) : (
        <>
          <FAB
            style={[styles.fab, styles.fabAdmin]}
            icon="shield-account"
            onPress={toggleAdminMenu}
            label="Admin"
          />
          <Animated.View
            style={[
              styles.adminMenuContainer,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateX: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [100, 0],
                    }),
                  },
                ],
              },
            ]}
            pointerEvents={isAdminMenuOpen ? "auto" : "none"}
          >
            <FAB
              style={[styles.fab, styles.fabAdd]}
              icon="plus"
              onPress={onAdd}
              label="Add"
            />
            <FAB
              style={[styles.fab, styles.fabEdit]}
              icon="pencil"
              onPress={() => setSelectionMode(true)}
              label="Select"
            />
          </Animated.View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    right: 16,
    bottom: 16,
    alignItems: "flex-end",
  },
  adminMenuContainer: {
    position: "absolute",
    right: 0,
    bottom: 70,
    flexDirection: "column",
    alignItems: "flex-end",
  },
  fab: {
    margin: 8,
    marginBottom: 16,
    width: 110,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  fabAdmin: {
    backgroundColor: "#6200EE",
  },
  fabAdd: {
    backgroundColor: "#34C759",
  },
  fabEdit: {
    backgroundColor: "#007AFF",
  },
  fabDelete: {
    backgroundColor: "#FF3B30",
  },
  fabCancel: {
    backgroundColor: "#FF9500",
  },
});

export default RouteAdminActionButton;