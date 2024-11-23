import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { DataTable } from "react-native-paper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import callReqResAPI from "@/api/callReqResAPI";
import { useRouter } from "expo-router";
import ButtonSubmit from "@/components/ui/ButtonSubmit";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

const HomeScreen: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isTableView, setIsTableView] = useState<boolean>(false);

  const router = useRouter();

  const fetchUsers = async (currentPage: number, append = false) => {
    if (!append) setLoading(true);
    try {
      const response = await callReqResAPI.get(`/users?page=${currentPage}&per_page=5`);
      if (response && response.data) {
        setUsers((prevUsers) =>
          append ? [...prevUsers, ...response.data.data] : response.data.data
        );
        setTotalPages(response.data.total_pages);
      } else {
        console.error("Invalid API response:", response);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const loadMoreUsers = () => {
    if (page < totalPages && !loadingMore) {
      setPage((prevPage) => prevPage + 1);
      setLoadingMore(true);
      fetchUsers(page + 1, true);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      fetchUsers(newPage);
    }
  };

  const toggleView = () => {
    setIsTableView((prev) => !prev);
    setPage(1);
    fetchUsers(1);
  };

  const handleNavigateToDetail = (id: number) => {
    router.push(`/details/${id}`);
  };

  return (
    <View style={styles.container}>

      <ButtonSubmit
        loading={loading}
        onPress={toggleView}
        textStyle={{ color: "white" }}
        buttonStyle={{ marginBottom: "8%" }}
        text={isTableView ? "Switch to List View" : "Switch to Table View"}
      />

      {loading && !loadingMore ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : isTableView ? (
        <ScrollView horizontal showsHorizontalScrollIndicator>
          <DataTable style={styles.dataTable}>
            <DataTable.Header>
              <DataTable.Title>ID</DataTable.Title>
              <DataTable.Title>Name</DataTable.Title>
              <DataTable.Title>Email</DataTable.Title>
              <DataTable.Title>Avatar</DataTable.Title>
            </DataTable.Header>

            {users.map((user) => (
              <DataTable.Row key={user.id}>
                <DataTable.Cell>{user.id}</DataTable.Cell>
                <DataTable.Cell>
                  {user.first_name} {user.last_name}
                </DataTable.Cell>
                <DataTable.Cell>{user.email}</DataTable.Cell>
                <DataTable.Cell>
                  <Image
                    source={{ uri: user.avatar }}
                    style={styles.avatar}
                  />
                </DataTable.Cell>
              </DataTable.Row>
            ))}

            <DataTable.Pagination
              page={page - 1}
              numberOfPages={totalPages}
              onPageChange={(newPage) => handlePageChange(newPage + 1)}
              label={`Page ${page} of ${totalPages}`}
              style={styles.pagination}
            />
          </DataTable>
        </ScrollView>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleNavigateToDetail(item.id)}>
              <View style={styles.row}>
                <Image
                  style={styles.image}
                  source={{ uri: item.avatar }}
                  onError={(e) =>
                    console.log("Error loading image:", e.nativeEvent.error)
                  }
                />
                <View style={styles.details}>
                  <Text style={styles.name}>
                    {item.first_name} {item.last_name}
                  </Text>
                  <Text style={styles.email}>{item.email}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          onEndReached={loadMoreUsers}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator size="small" color="#0000ff" /> : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp("5%"),
    backgroundColor: "#fff",
  },
  dataTable: {
    width: 860,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  pagination: {
    justifyContent: "flex-start",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp("3%"),
    marginBottom: wp("2%"),
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    gap: wp("3%"),
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  email: {
    color: "#555",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});

export default HomeScreen;
