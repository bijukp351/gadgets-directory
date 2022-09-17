import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Checkbox from "expo-checkbox";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { nanoid } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { addNewPost } from "../features/gadgetSlice";

export default function NotesScreenAdd() {
  const navigation = useNavigation();
  const [gadgetName, setGadgetName] = useState("");
  const [gadgetBrand, setGadgetBrand] = useState("");
  const [gadgetPrice, setGadgetPrice] = useState("");
  const [gadgetSpec, setGadgetSpec] = useState("");
  const [gadgetLaunch, setGadgetLaunch] = useState("");
  const [isFeatured, setFeatured] = useState();

  const [gadgetPic1, setGadgetPic1] = useState("");
  const [gadgetPic2, setGadgetPic2] = useState("");

  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.1,
      base64: true,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      // setGadgetPic(result);

      const img64 = result.base64;

      const half1 = img64.substring(0, img64.length / 2);
      const half2 = img64.substring(img64.length / 2);
      setGadgetPic1(half1);
      setGadgetPic2(half2);
    }
  };

  const dispatch = useDispatch();

  const canSave = [
    gadgetName,
    gadgetBrand,
    gadgetPrice,
    gadgetSpec,
    gadgetLaunch,
    gadgetPic1,
    gadgetPic2,
    isFeatured,
  ].every(Boolean);

  async function savePost() {
    if (canSave) {
      try {
        const post = {
          id: nanoid(),
          brand: gadgetBrand,
          datelaunch: gadgetLaunch,
          name: gadgetName,
          pic1: gadgetPic1,
          pic2: gadgetPic2,
          price: gadgetPrice,
          spec: gadgetSpec,
          fet: isFeatured,
        };
        await dispatch(addNewPost(post));
      } catch (error) {
        console.error("Failed to save the post: ", error);
      } finally {
        navigation.goBack();
      }
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <FontAwesome name={"arrow-left"} size={24} color={"black"} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.pickedImage}>
          <TouchableOpacity onPress={pickImage} style={styles.pickButton}>
            <Text style={styles.pickButtonText}>Pick an image</Text>
          </TouchableOpacity>

          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 100, height: 100 }}
            />
          )}
        </View>

        <TextInput
          style={styles.gadgetName}
          placeholder={"Name"}
          value={gadgetName}
          onChangeText={(text) => setGadgetName(text)}
          selectionColor={"gray"}
        />

        <TextInput
          style={styles.noteBody}
          placeholder={"Launch Date"}
          value={gadgetLaunch}
          onChangeText={(text) => setGadgetLaunch(text)}
          selectionColor={"gray"}
        />

        <TextInput
          style={styles.noteBody}
          placeholder={"Brand"}
          value={gadgetBrand}
          onChangeText={(text) => setGadgetBrand(text)}
          selectionColor={"gray"}
        />
        <TextInput
          style={styles.noteBody}
          placeholder={"Price"}
          value={gadgetPrice}
          onChangeText={(text) => setGadgetPrice(text)}
          selectionColor={"gray"}
        />

        <TextInput
          style={styles.noteBody}
          placeholder={"Specification"}
          value={gadgetSpec}
          onChangeText={(text) => setGadgetSpec(text)}
          selectionColor={"gray"}
          multiline={true}
          numberOfLines={5}
        />
        <View style={styles.checkboxContainer}>
          <Checkbox
            value={isFeatured}
            onValueChange={setFeatured}
            style={styles.checkbox}
          />
          <Text style={styles.label}> Featured</Text>
        </View>

        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={styles.button}
          onPress={async () => await savePost()}
        >
          <Text style={styles.buttonText}>Add Gadget</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    padding: 25,
  },
  textContainer: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 10,
  },
  checkbox: {
    alignSelf: "center",
  },
  pickedImage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  gadgetName: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 50,
    marginBottom: 10,
    borderColor: "gray",
    borderWidth: "1px",
    padding: 15,
    borderRadius: 5,
  },
  noteBody: {
    fontSize: 15,
    fontWeight: "400",
    marginTop: 10,
    marginBottom: 10,
    borderColor: "gray",
    borderWidth: "1px",
    padding: 15,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "black",
    borderRadius: 15,
    width: "100%",
    marginBottom: 20,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "400",
    fontSize: 17,
    padding: 20,
    color: "white",
  },
  pickButton: {
    backgroundColor: "#ccc",
    borderRadius: 8,
    // width: "100%",
    marginBottom: 10,
  },
  pickButtonText: {
    textAlign: "center",
    fontWeight: "400",
    fontSize: 14,
    padding: 8,
    // color: "white",
  },
});
