
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';

export async function getServerSideProps({ locale }){
  return { props: { ...(await serverSideTranslations(locale, ['common'])) } };
}

export default function Home(){
  const { t, i18n } = useTranslation('common');
  const [token, setToken] = useState(null);
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');

  const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_BASE });

  useEffect(()=>{
    const tok = localStorage.getItem('token');
    if(tok) setToken(tok);
  },[]);

  async function load(){
    if(!token) return;
    const { data } = await api.get('/posts', { headers: { Authorization: `Bearer ${token}` } });
    setPosts(data);
  }

  useEffect(()=>{ load(); },[token]);

  async function createPost(){
    const { data: fix } = await api.post('/ai/fix', { text: content });
    const { data } = await api.post('/posts', { content: fix.fixed }, { headers: { Authorization: `Bearer ${token}` } });
    setContent('');
    setPosts([data, ...posts]);
  }

  function changeLang(l){ i18n.changeLanguage(l); }

  return (
    <div className="container">
      <div className="nav">
        <b>{t('appName')}</b>
        <div className="lang">
          {['ku','en','fa','tr','ar'].map(l => (
            <button key={l} className="btn" onClick={()=>changeLang(l)}>{l.toUpperCase()}</button>
          ))}
          {!token ? <Link href="/login" className="btn btn-primary">{t('login')}</Link> : <button className="btn" onClick={()=>{localStorage.removeItem('token'); location.reload();}}>{t('logout')}</button>}
        </div>
      </div>

      <div className="card">
        <h3>{t('createPost')}</h3>
        {!token ? <p className="muted">{t('login')} / {t('signup')} </p> : (
          <>
            <textarea rows="3" placeholder={t('writeSomething')} value={content} onChange={e=>setContent(e.target.value)} />
            <br/>
            <button className="btn btn-primary" onClick={createPost}>{t('submit')}</button>
          </>
        )}
      </div>

      <div className="card">
        <h3>{t('feed')}</h3>
        {posts.map(p => (
          <div className="post" key={p.id}>
            <div>{p.content}</div>
            <small>{new Date(p.createdAt).toLocaleString()} — {p.author?.email}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
