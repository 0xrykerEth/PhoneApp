import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image, Dimensions } from "react-native";
import React from "react";
import dateFormat from "dateformat";
import Markdown from "react-native-markdown-display";
import * as Linking from "expo-linking";
import { getSinglePosts } from "../api/post";
import RelatedPosts from "./RelatedPosts";
import Separator from "./Separator";

const { width } = Dimensions.get("window");

const MY_WEBSITE_LINK = "myblog.com/blog";

export default function PostDetail({ route, navigation }) {
  const post = route.params?.post;

  const getImage = (uri) => {
    if (uri) return { uri };

    return require("../../assets/blank.jpg");
  };

  const handleSinglePostFetch = async (slug) => {
    const { error, post } = await getSinglePosts(slug);

    if (error) return console.log(error);
    navigation.push("PostDetail", { post });
  };

  const handleOnLinkPress = async (url) => {
    if (url.includes(MY_WEBSITE_LINK)) {
      const slug = url.split(MY_WEBSITE_LINK + "/")[1];

      if (!slug) return false;
      handleSinglePostFetch(slug);

      return false;
    }

    const res = await Linking.canOpenURL(url);
    if (res) Linking.openURL(url);
    else Alert.alert("Invalid URL", "Cannot open broken link!");
  };

  if (!post) return null;

  const { title, thumbnail, tags, createdAt, author, content } = post;

  return (
    <ScrollView>
      <Image
        source={getImage(thumbnail)}
        style={{ width, height: width / 1.7 }}
      />
      <View style={{ padding: 10 }}>
        <Text
          style={{
            fontWeight: "700",
            color: "#383838",
            fontSize: 22,
          }}
        >
          {title}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 3,
          }}
        >
          <Text style={{ color: "#827E7E" }}>By {author}</Text>
          <Text style={{ color: "#827E7E" }}>
            {dateFormat(createdAt, "mediumDate")}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color: "#827E7E" }}>Tags</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {tags.map((tag, index) => (
              <Text style={{ marginLeft: 5, color: "blue" }} key={tag + index}>
                #{tag}
              </Text>
            ))}
          </View>
        </View>
        <Markdown onLinkPress={handleOnLinkPress} style={styles}>
          {content}
        </Markdown>
      </View>
      <View style={{ padding: 10 }}>
        <Text
          style={{
            fontWeight: "700",
            color: "#383838",
            fontSize: 22,
            marginBottom: 10,
          }}
        >
          Related News
        </Text>
        <Separator width="100%" />

        <RelatedPosts onPostPress={handleSinglePostFetch} postId={post.id} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 22,
    lineHeight: 22,
    color: "#545050",
    letterSpacing: 0.8,
  },
  body: {
    fontSize: 16,
  },
  link: {
    color: "#7784f8",
  },
  list_item: {
    color: "#545050",
    paddingVertical: 5,
  },
});
