import React from "react";
import { View, StyleSheet } from "react-native";
import { DrawerItem, DrawerContentScrollView } from "@react-navigation/drawer";
import { Avatar, Title, Caption, Drawer } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Image from "../../assets/man.png";
import userIDStore from "../data-management/user-id-data/userIDStore";
import * as actions from "../data-management/user-id-data/userIDActions";
import symptomStore from "../data-management/user-symptom-data/symptomStore";

const NavigatorDrawer = (props) => {
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.draweContent}>
          <View style={styles.userInfoSection}>
            <View
              style={{
                flexDirection: "row",
                marginTop: 15,
              }}
            >
              <Avatar.Image
                source={Image}
                size={65}
                style={{ backgroundColor: "#5d99c6" }}
              />
              <View style={{ marginLeft: 15 }}>
                <Title style={styles.title}></Title>
                <Caption style={styles.caption}>
                  {userIDStore.getState().userName}
                </Caption>
              </View>
            </View>
          </View>

          <Drawer.Section style={styles.drawerSetion}>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="account-outline" color={color} size={size} />
              )}
              label="My Profile"
              onPress={() => props.navigation.closeDrawer()}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon
                  name="frequently-asked-questions"
                  color={color}
                  size={size}
                />
              )}
              label="Information"
              //   onPress={() => {
              //     props.navigation.navigate("page 11");
              //   }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="newspaper" color={color} size={size} />
              )}
              label="News"
              //   onPress={() => {
              //     props.navigation.navigate("page 10");
              //   }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="information-outline" color={color} size={size} />
              )}
              label="About"
              //   onPress={() => {
              //     props.navigation.navigate("Favorite");
              //   }}
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          label="Sign Out"
          onPress={() => {
            userIDStore.dispatch(actions.removeUser());
            // props.navigation.navigate("Page 4");
            console.log(
              userIDStore.getState().userId +
                " , " +
                userIDStore.getState().userName
            );
          }}
        />
      </Drawer.Section>
    </View>
  );
};

export default NavigatorDrawer;

const styles = StyleSheet.create({
  draweContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 20,
    color: "#000000",
    lineHeight: 20,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSetion: {
    marginTop: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
