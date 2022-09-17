import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import Checkbox from "expo-checkbox";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { deletePostThunk, updatePostThunk } from "../features/gadgetSlice";
import * as ImagePicker from "expo-image-picker";
export default function NotesScreenDetails() {
  const route = useRoute();
  const titleInputRef = useRef();
  const navigation = useNavigation();
  const params = route.params;
  const [gadgetName, setGadgetname] = useState(params.name);
  const [gadgetLaunch, setGadgetLaunch] = useState(params.datelaunch);

  const [gadgetPic1, setGadgetPic1] = useState(params.pic1);
  const [gadgetPic2, setGadgetPic2] = useState(params.pic2);

  const [gadgetPrice, setGadgetPrice] = useState(params.price);
  const [gadgetSpec, setGadgetSpec] = useState(params.spec);
  const [gadgetBrand, setGadgetBrand] = useState(params.brand);
  const [isFeatured, setFeatured] = useState(params.fet);
  const [editable, setEditable] = useState(false);
  const dispatch = useDispatch();
  const id = params.id;
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

  async function updatePost(id) {
    try {
      const updatedPost = {
        id,
        brand: gadgetBrand,
        datelaunch: gadgetLaunch,
        name: gadgetName,
        pic1: gadgetPic1,
        pic2: gadgetPic2,
        price: gadgetPrice,
        spec: gadgetSpec,
        fet: isFeatured,
      };
      await dispatch(updatePostThunk(updatedPost));
    } catch (error) {
      console.error("Failed to update the post: ", error);
    } finally {
      navigation.goBack();
    }
  }

  async function deletePost(id) {
    try {
      await dispatch(deletePostThunk(id));
    } catch (error) {
      console.error("Failed to update the post: ", error);
    } finally {
      navigation.goBack();
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name={"arrow-left"} size={24} color={"black"} />
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          onPress={() => {
            setEditable(!editable);
            if (!editable) {
              setTimeout(() => titleInputRef.current.focus(), 100);
            } else {
              setTimeout(() => titleInputRef.current.blur(), 100);
            }
          }}
        >
          <FontAwesome
            name={"pencil"}
            size={24}
            color={editable ? "forestgreen" : "black"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => deletePost(id)}
          style={{ marginLeft: 15 }}
        >
          <FontAwesome name={"trash"} size={24} color={"black"} />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.pickedImage}>
          {editable && (
            <TouchableOpacity onPress={pickImage} style={styles.pickButton}>
              <Text style={styles.pickButtonText}>Change Image</Text>
            </TouchableOpacity>
          )}

          {image && <Image source={{ uri: image }} style={styles.image} />}
          {!image && (
            <Image
              source={{
                uri: `data:image/png;base64,${gadgetPic1 + gadgetPic2}`,
              }}
              style={styles.image}
            />
          )}
        </View>

        <TextInput
          style={styles.gadgetName}
          placeholder={"Gadget Name"}
          value={gadgetName}
          onChangeText={(text) => setGadgetname(text)}
          selectionColor={"gray"}
          editable={editable}
          ref={titleInputRef}
        />
        <TextInput
          style={styles.gadgetLaunch}
          placeholder={"Launch Date"}
          value={editable ? gadgetLaunch : "Released " + gadgetLaunch}
          onChangeText={(text) => setGadgetLaunch(text)}
          selectionColor={"gray"}
          editable={editable}
          ref={titleInputRef}
        />
        <TextInput
          style={styles.gadgetPrice}
          placeholder={"Price"}
          value={editable ? gadgetPrice : "$" + gadgetPrice}
          onChangeText={(text) => setGadgetPrice(text)}
          selectionColor={"gray"}
          editable={editable}
          ref={titleInputRef}
        />
        <TextInput
          style={styles.gadgetBrand}
          placeholder={"Brand"}
          value={gadgetBrand}
          onChangeText={(text) => setGadgetBrand(text)}
          selectionColor={"gray"}
          editable={editable}
          ref={titleInputRef}
        />
        <TextInput
          style={styles.noteBody}
          placeholder={"Specification"}
          value={gadgetSpec}
          onChangeText={(text) => setGadgetSpec(text)}
          selectionColor={"gray"}
          editable={editable}
          multiline={true}
          numberOfLines={5}
        />
        <View style={styles.checkboxContainer}>
          {editable && (
            <Checkbox
              value={isFeatured}
              onValueChange={setFeatured}
              style={styles.checkbox}
            />
          )}
          {!isFeatured && <Text style={styles.label}> Not Featured</Text>}
          {isFeatured && <Text style={styles.label}> Featured</Text>}
        </View>
        <View style={{ flex: 1 }} />
        {editable && (
          <TouchableOpacity
            style={styles.button}
            onPress={async () => updatePost(id)}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 10,
  },
  checkbox: {
    alignSelf: "center",
  },
  imgContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  pickedImage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    resizeMode: "contain",
    flex: 1,
    aspectRatio: 1, // Your aspect ratio
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    padding: 25,
  },
  gadgetName: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 5,
    marginBottom: 5,
  },
  gadgetLaunch: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 5,
    marginBottom: 5,
  },
  gadgetBrand: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 5,
    color: "grey",
    marginBottom: 5,
  },
  gadgetPrice: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 5,
    marginBottom: 5,
  },
  noteBody: {
    fontSize: 15,
    fontWeight: "400",
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
