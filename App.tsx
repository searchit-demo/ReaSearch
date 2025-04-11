import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';

interface Result {
  key: string;
  size: number;
  uploaded: string;
  url?: string;
}

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchResults = async (searchTerm: string): Promise<void> => {
    if (!searchTerm) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://fileupload.rick-and-friends.site/search?keyword=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      const result: Result[] = data.results.map((doc: any) => ({
        key: doc.key,
        title: doc.title,
        author_name: doc.author_name,
      }));
      setResults(result);
    } catch (error) {
      console.error('Fetch error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchResults(query);
    }, 500);

    return () => clearTimeout(debounce);
  }, [query]);

  const renderItem = ({ item }: { item: Result }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.key}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        value={query}
        onChangeText={setQuery}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) => `${item.key}_${index}`}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  item: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  author: {
    marginTop: 4,
    color: '#666',
  },
});

export default App;
