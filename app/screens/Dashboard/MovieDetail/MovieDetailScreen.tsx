/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/sort-styles */
import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet, View } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import { movieList } from "app/services/api/movieDashboard/movieDashboard.type"
import FastImage from "react-native-fast-image"
import Config from "app/config"
import { spacing } from "app/theme"

interface MovieDetailScreenProps extends AppStackScreenProps<"MovieDetail"> {}

export const MovieDetailScreen: FC<MovieDetailScreenProps> = observer(function MovieDetailScreen({
  route,
}) {
  const movie = route.params

  const item = movie.movies as movieList

  return (
    <Screen contentContainerStyle={styles.root} preset="scroll" safeAreaEdges={["bottom"]}>
      <View style={styles.bannerImageViewStyle}>
        <FastImage
          style={{ flex: 1 }}
          source={{
            uri: Config.IMG_URL + item.backdrop_path,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
      <View style={{ padding: spacing.md }}>
        <Text text={item.title} preset={"heading"} />
        <Text text={item.release_date} />
        <Text style={{ textAlignVertical: "center" }}>
          Rating: {item.vote_average?.toFixed(2).toString()} ({item.vote_count?.toString()} votes){" "}
        </Text>
        <Text text="Overview" preset="subheading" style={{ marginTop: spacing.md }} />
        <Text text={item.overview} />
      </View>
    </Screen>
  )
})

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  bannerImageViewStyle: {
    width: "100%",
    height: 300,
    backgroundColor: "black",
  },
})
