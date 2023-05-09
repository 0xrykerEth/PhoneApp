import { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import { FlatList } from "react-native";

const width = Dimensions.get("window").width - 20;
let currentSlideIndex = 0;
let intervalId;

export default function Slider({ data, title }) {
  const [dataToRender, setDataToRender] = useState([]);
  const [VisibleSlideIndex, setVisibleSlideIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    currentSlideIndex = viewableItems[0]?.index || 0;
    setVisibleSlideIndex(currentSlideIndex);
  });

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  const flatList = useRef();

  const handleScrollTo = (index) => {
    if (flatList.current) {
      flatList.current.scrollToIndex({ animated: false, index });
    }
  };

  const startSlider = () => {
    if (currentSlideIndex <= dataToRender.length - 2) {
      intervalId = setInterval(() => {
        flatList.current.scrollToIndex({
          animated: false,
          index: currentSlideIndex + 1,
        });
      }, 2000);
    } else {
      pauseSlider();
    }
  };
  const pauseSlider = () => {
    clearInterval(intervalId);
  };

  useEffect(() => {
    if (dataToRender.length && flatList.current) {
      startSlider();
    }
  }, [dataToRender.length]);

  useEffect(() => {
    const newDate = [[...data].pop(), ...data, [...data].shift()];
    setDataToRender([...newDate]);
  }, [data.length]);

  useEffect(() => {
    const length = dataToRender.length;
    // reset slide to first
    if (VisibleSlideIndex === length - 1 && length) handleScrollTo(1);

    //reset slide to end
    if (VisibleSlideIndex === 0 && length) handleScrollTo(length - 2);

    const lastSlide = currentSlideIndex === length - 1;
    const firstSlide = currentSlideIndex === 0;

    if (lastSlide && length) setActiveSlideIndex(0);
    else if (firstSlide && length) setActiveSlideIndex(length - 2);
    else setActiveSlideIndex(currentSlideIndex - 1);
  }, [VisibleSlideIndex]);

  return (
    <View style={styles.container}>
      <View style={styles.sliderHead}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.slideIndicatorContainer}>
          {data.map((item, index) => {
            return (
              <View
                key={item.id}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  borderWidth: 2,
                  marginLeft: 5,
                  backgroundColor:
                    activeSlideIndex === index ? "#383838" : "transparent",
                }}
              />
            );
          })}
        </View>
      </View>
      <FlatList
        ref={flatList}
        data={dataToRender}
        keyExtractor={(item, index) => item.id + index}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={0}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
        onScrollBeginDrag={pauseSlider}
        onScrollEndDrag={startSlider}
        renderItem={({ item }) => (
          <View>
            <Image
              source={{ uri: item.thumbnail }}
              style={{ width, height: width / 1.7, borderRadius: 7 }}
            />
            <View style={{ width }}>
              <Text
                numberOfLines={2}
                style={{
                  fontWeight: "700",
                  color: "#383838",
                  fontSize: 22,
                  marginTop: 5,
                  marginLeft: 10,
                }}
              >
                {item.title}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    width,
    paddingTop: 50,
  },
  sliderHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  title: { fontWeight: "700", color: "#383838", fontSize: 22 },
  slideIndicatorContainer: { flexDirection: "row", alignItems: "center" },
  slides: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    marginLeft: 5,
  },
  slideImage: {
    width,
    height: width / 1.7,
    borderRadius: 7,
  },
});
