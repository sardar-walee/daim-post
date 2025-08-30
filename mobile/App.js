
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TextInput, Button, FlatList, View } from 'react-native';
import axios from 'axios';

const API = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:4000';

export default function App(){
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('demodemo');
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);

  const api = axios.create({ baseURL: API });

  async function login(){
    const { data } = await api.post('/auth/login', { email, password });
    setToken(data.token);
  }

  async function signup(){
    const { data } = await api.post('/auth/signup', { email, password });
    setToken(data.token);
  }

  async function load(){
    if(!token) return;
    const { data } = await api.get('/posts', { headers: { Authorization: `Bearer ${token}` } });
    setPosts(data);
  }

  async function createPost(){
    const { data: fix } = await api.post('/ai/fix', { text: content });
    const { data } = await api.post('/posts', { content: fix.fixed }, { headers: { Authorization: `Bearer ${token}` } });
    setContent('');
    setPosts([data, ...posts]);
  }

  useEffect(()=>{ load(); }, [token]);

  return (
    <SafeAreaView style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Daim Post</Text>
      {!token ? (
        <View>
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderWidth:1, padding:8, marginVertical:8 }} />
          <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={{ borderWidth:1, padding:8, marginVertical:8 }} />
          <Button title="Login" onPress={login} />
          <View style={{ height: 8 }} />
          <Button title="Sign up" onPress={signup} />
        </View>
      ) : (
        <View>
          <TextInput placeholder="Write something..." value={content} onChangeText={setContent} style={{ borderWidth:1, padding:8, marginVertical:8 }} />
          <Button title="Submit" onPress={createPost} />
          <FlatList
            data={posts}
            keyExtractor={(item)=>item.id}
            renderItem={({ item }) => (
              <View style={{ paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee' }}>
                <Text>{item.content}</Text>
                <Text>{new Date(item.createdAt).toLocaleString()}</Text>
              </View>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
