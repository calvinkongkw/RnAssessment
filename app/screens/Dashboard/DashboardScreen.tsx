/* eslint-disable react-native/no-inline-styles */
import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  ImageStyle,
  TextStyle,
  VirtualizedList,
  RefreshControl,
  StyleProp,
} from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Icon, Screen, TextField } from "app/components"
import { api } from "app/services/api"
import { movieList } from "app/services/api/movieDashboard/movieDashboard.type"
import Config from "../../config"
import { spacing } from "app/theme"
import FastImage from "react-native-fast-image"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

interface DashboardScreenProps extends AppStackScreenProps<"Dashboard"> {}

export const DashboardScreen: FC<DashboardScreenProps> = observer(function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>()

  const [page, setPage] = useState<number>(1)
  const [movieResponse, setMovieResponse] = useState<movieList[]>([])
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false)
  const [refreshing, setRefreshing] = useState(false)
  const [searchField, setSearchField] = useState("")

  useEffect(() => {
    if (searchField !== "") {
      setMovieResponse([])
      api.getSearchMovieList(searchField).then((data) => {
        if (data.kind === "ok") {
          setMovieResponse(data.movies)
        }
      })
    } else {
      onRefresh()
    }
  }, [searchField])

  useEffect(() => {
    fetchMovies()
  }, [page])

  const onRefresh = () => {
    setRefreshing(true)
    setMovieResponse([])
    setPage(1)
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }

  const fetchMovies = () => {
    if (isFetchingMore) return

    setIsFetchingMore(true)
    api.getMovieList(page).then((data) => {
      if (data.kind === "ok") {
        setMovieResponse((prevMovies) => [...prevMovies, ...data.movies])
        console.log(movieResponse)
        setPage(page + 1)
      }
      setIsFetchingMore(false)
    })
  }

  const renderItem = ({ item }: { item: movieList }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("MovieDetail", { movies: item })
      }}
    >
      <View style={styles.itemContainer}>
        <FastImage
          style={styles.posterImage}
          source={{
            uri: Config.IMG_URL + item.poster_path,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.releaseDate}>{item.release_date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderFooter = () => {
    if (!isFetchingMore || refreshing) return null
    return <ActivityIndicator style={styles.footer} />
  }

  const loadMore = () => {
    setPage(page + 1)
  }

  const headerView = () => {
    return (
      <View style={{ height: 26, margin: spacing.md, marginBottom: spacing.xl }}>
        <TextField
          style={{ flex: 1, alignItems: "center" }}
          placeholder={"Search for movies"}
          onChangeText={(text) => setSearchField(text)}
          RightAccessory={() => (
            <View style={{ marginVertical: spacing.xs, marginHorizontal: spacing.sm }}>
              <Icon icon="search" size={20} />
            </View>
          )}
        />
      </View>
    )
  }

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["top", "bottom"]}
      contentContainerStyle={{ flex: 1, flexDirection: "column" }}
    >
      {headerView()}
      <VirtualizedList
        data={movieResponse}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0}
        getItemCount={() => movieResponse.length}
        getItem={(data, index) => data[index]}
        keyExtractor={(_, index) => String(index)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </Screen>
  )
})

const styles = {
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  } as ViewStyle,
  posterImage: {
    width: 100,
    height: 150,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  } as ViewStyle,
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  } as TextStyle,
  releaseDate: {
    fontSize: 16,
    color: "#888",
  } as TextStyle,
  footer: {
    marginTop: 10,
  } as ViewStyle,
}