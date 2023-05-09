import { FlatList, Text, View } from "react-native";
import Slider from "./Slider";
import Separator from "./Separator";
import PostListItem from "./PostListItem";
import { useEffect, useState } from "react";
import { getFeaturedPosts, getLatestPosts, getSinglePosts } from "../api/post";
import Constants from "expo-constants";

let pageNo = 0;
const limit = 5;

export default function Home({ navigation }) {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);
  const [busy, setBusy] = useState(false);

  const fetchFeaturedPosts = async () => {
    const { error, posts } = await getFeaturedPosts();
    if (error) return console.log(error);
    setFeaturedPosts(posts);
  };

  const fetchLatestPosts = async () => {
    const { error, posts } = await getLatestPosts(limit, pageNo);
    if (error) return console.log(error);
    setLatestPosts(posts);
  };
  const fetchMorePosts = async () => {
    if (reachedToEnd || busy) return;
    pageNo += 1;
    setBusy(true);
    const { error, posts, postCount } = await getLatestPosts(limit, pageNo);
    setBusy(false);
    if (error) return console.log(error);

    if (postCount.length === latestPosts.length) return setReachedToEnd(true);
    setLatestPosts([...latestPosts, ...posts]);
  };

  useEffect(() => {
    fetchFeaturedPosts();
    fetchLatestPosts();
  }, []);

  const ListHeaderComponent = () => {
    return (
      <View style={{ paddingTop: Constants.statusBarHeight }}>
        {featuredPosts.length ? (
          <Slider data={featuredPosts} title="Featured News" />
        ) : null}
        <View style={{ marginTop: 15 }}>
          <Separator />
          <Text
            style={{
              fontWeight: "700",
              color: "#383838",
              fontSize: 22,
              marginTop: 15,
            }}
          >
            Latest News
          </Text>
        </View>
      </View>
    );
  };

  const ItemSeparatorComponent = () => (
    <Separator width="90%" style={{ marginTop: 5 }} />
  );

  const fetchSinglePost = async (slug) => {
    const { error, post } = await getSinglePosts(slug);

    if (error) console.log(error);
    navigation.navigate("PostDetail", { post });
  };

  const renderItem = ({ item }) => {
    return (
      <View style={{ marginTop: 15 }}>
        <PostListItem onPress={() => fetchSinglePost(item.slug)} post={item} />
      </View>
    );
  };

  return (
    <FlatList
      data={latestPosts}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
      ListHeaderComponent={ListHeaderComponent}
      ItemSeparatorComponent={ItemSeparatorComponent}
      renderItem={renderItem}
      onEndReached={async () => await fetchMorePosts()}
      onEndReachedThreshold={0}
      ListFooterComponent={() => {
        return reachedToEnd ? (
          <Text
            style={{
              fontWeight: "700",
              color: "#383838",
              textAlign: "center",
              paddingVertical: 15,
            }}
          >
            You reached to the end!
          </Text>
        ) : null;
      }}
    />
  );
}
