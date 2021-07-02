import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { ArticleRow } from './app/components/ArticleRow';
import { client } from './app/graphql/client';
import { TopHeadlines } from './app/graphql/queries';

export default function App() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  const requestApollo = () => {
    client
      .query({ query: TopHeadlines })
      .then(response => {
        console.log(response);
        setArticles(response.data.headlines.articles);
        setLoading(response.loading);
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  useEffect(() => {
    requestApollo();
  })

  const renderFooter = () => {
    if (loading) {
      return <ActivityIndicator size="large" />;
    }

    return null;
  };

  return (
    <SafeAreaView>
      <FlatList
        data={articles}
        ListHeaderComponent={
          <Text style={styles.headerText}>Top Headlines</Text>
        }
        renderItem={({ item, index }) => (
          <ArticleRow index={index} {...item} />
        )}
        keyExtractor={item => `${item.publishedAt}-${item.title}`}
        ListFooterComponent={renderFooter()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerText: {
    color: '#ff8d01',
    fontWeight: '900',
    fontSize: 40,
    paddingHorizontal: 10,
    marginBottom: 30,
    marginTop: 10,
  },
});