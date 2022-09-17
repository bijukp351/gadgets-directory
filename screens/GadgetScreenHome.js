import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { API_STATUS, NOTES_SCREEN } from "../constants";
import { fetchPosts } from "../features/gadgetSlice";
import { FontAwesome } from "@expo/vector-icons";

export default function NotesScreenHome() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.notes.posts);
  const notesStatus = useSelector((state) => state.notes.status);
  const isLoading = notesStatus === API_STATUS.pending;

  useEffect(() => {
    if (notesStatus === API_STATUS.idle) {
      dispatch(fetchPosts());
    }
  }, [notesStatus, dispatch]);

  function renderItem({ item }) {
    return (
      <TouchableOpacity
        style={styles.noteCard}
        onPress={() => navigation.navigate(NOTES_SCREEN.Details, item)}
      >
        <View
          style={[
            {
              flexDirection: "row",
            },
          ]}
        >
          <View style={{ width: 55 }}>
            <Image
              source={{
                uri: `data:image/png;base64,${item.pic1 + item.pic2}`,
              }}
              style={{ height: 60, width: 50 }}
            />
          </View>
          <View style={{ flex: 2 }}>
            <Text style={styles.noteCardTitle}>{item.name}</Text>
            <Text style={styles.noteCardBodyText}>{item.brand}</Text>
          </View>
          <View
            style={{
              flex: 1,
              textAlignVertical: "center",
              justifyContent: "center",
            }}
          >
            <Text style={styles.gadgetPrice}>${item.price}</Text>
            {item.fet && (
              <FontAwesome
                name={"star"}
                size={24}
                color={"orange"}
                style={{ textAlign: "right" }}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gadgets Directory</Text>

      {isLoading && <ActivityIndicator />}

      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(post) => post.id.toString()}
      />

      <View style={{ flex: 1 }} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate(NOTES_SCREEN.Add)}
      >
        <Text style={styles.buttonText}>Add Gadget</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  noteCard: {
    borderColor: "gray",
    borderWidth: "1px",
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  noteCardTitle: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 7,
  },
  gadgetPrice: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 7,
    textAlign: "right",
    alignItems: "center",
    textAlignVertical: "center",
  },

  noteCardBodyText: {
    fontSize: 12,
    fontWeight: "300",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 100,
    padding: 25,
  },
  title: {
    fontWeight: "bold",
    fontSize: 40,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "black",
    borderRadius: 15,
    width: "100%",
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "400",
    fontSize: 17,
    padding: 20,
    color: "white",
  },
});
