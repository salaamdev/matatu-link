// src/components/common/CommunityAdminActionButton.jsx
import React, { useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { FAB } from "react-native-paper";

const CommunityAdminActionButton = ({
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
          // src/components/common/CommunityAdminActionButton.jsx
import React, { useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { FAB } from "react-native-paper";

const CommunityAdminActionButton = ({
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
          