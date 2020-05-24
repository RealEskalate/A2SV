import React from "react";
import { StyleSheet, View, Share } from "react-native";
import { Button, Card, List, Text } from "@ui-kitten/components";
import { ImageOverlay } from "../../components/ImageOverlay/image-overlay.component";
import { PlusIcon, ShareIcon } from "./extra/icons";
import {
  symptoms,
  preventions,
  spread,
  message,
  whatsIsCovid,
} from "./extra/data";

const data = [whatsIsCovid, symptoms, preventions, spread, message];

export default InformationScreen = (props) => {
  const renderItemHeader = (info) => (
    <ImageOverlay style={styles.itemHeader} source={info.item.photo}>
      <Text style={styles.itemTitle} category="h4" status="control">
        {info.item.name}
      </Text>
    </ImageOverlay>
  );

  const onShare = async (message) => {
    try {
      const result = await Share.share({
        message,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const renderItemFooter = (message, route) => (
    <View style={styles.itemFooter}>
      <View style={styles.itemReactionsContainer}>
        <Button
          style={styles.iconButton}
          appearance="ghost"
          status="primary"
          onPress={() => onShare(message + "\n\nTrack Sym 2020.")}
          accessoryLeft={ShareIcon}
        />
      </View>
      <Button
        onPress={() => props.navigation.navigate(route)}
        style={styles.itemAddButton}
        appearance="ghost"
        icon={PlusIcon}
      >
        READ MORE
      </Button>
    </View>
  );

  const renderItem = (info) => (
    <Card
      style={styles.item}
      header={() => renderItemHeader(info)}
      footer={() => renderItemFooter(info.item.description, info.item.link)}
    >
      <Text style={styles.itemDescription} category="s1">
        {info.item.description}
      </Text>
    </Card>
  );

  return (
    <List
      style={styles.list}
      contentContainerStyle={styles.listContent}
      data={data}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: "#eee",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  item: {
    marginVertical: 8,
    borderRadius: 10,
  },
  itemHeader: {
    minHeight: 220,
  },
  itemTitle: {
    position: "absolute",
    left: 24,
    bottom: 24,
  },
  itemDescription: {
    marginHorizontal: -8,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemReactionsContainer: {
    flexDirection: "row",
  },
  itemAddButton: {
    flexDirection: "row-reverse",
    paddingHorizontal: 0,
  },
  iconButton: {
    paddingHorizontal: 0,
  },
});
