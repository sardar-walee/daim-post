
import axios from 'axios';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export async function getServerSideProps({ locale }){
  return { props: { ...(await serverSideTranslations(locale, ['common'])) } };
}

export default function Login(){
  const { t } = useTranslation('common');
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('demodemo');
  const [mode, setMode] = useState('login');
  const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_BASE });

  async function submit(){
    const route = mode === 'login' ? '/auth/login' : '/auth/signup';
    const { data } = await api.post(route, { email, password });
    localStorage.setItem('token', data.token);
    location.href = '/';
  }

  return (
    <div className="container">
      <div className="card">
        <h2>{mode === 'login' ? t('login') : t('signup')}</h2>
        <input className="input" placeholder={t('email')} value={email} onChange={e=>setEmail(e.target.value)} />
        <br/>
        <input className="input" placeholder={t('password')} type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <br/>
        <button className="btn btn-primary" onClick={submit}>{mode === 'login' ? t('login') : t('signup')}</button>
        <br/><br/>
        <button className="btn" onClick={()=>setMode(mode === 'login' ? 'signup' : 'login')}>
          {mode === 'login' ? t('signup') : t('login')}
        </button>
      </div>
    </div>
  );
}
