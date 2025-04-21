import { useState } from 'react';
import './App.css';
import React from 'react';
import { Grid } from '@mui/material';
import NetworkGraphComponent from './components/NetworkGraph/NetworkGraphComponent';
import HeaderComponent from './components/Header/HeaderComponent';
import DetailsComponent from './components/Details/DetailsComponent';
import Layout from './Layout';

export default function App() {
  return (
    <Layout>
      <NetworkGraphComponent />
    </Layout>
  );
}
