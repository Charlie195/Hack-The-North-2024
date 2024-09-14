import logo from './logo.svg';
import './App.css';

import React from 'react';
import { Flex, Input } from 'antd'
import { Button } from "antd";

function App() {
  return (
    <Flex gap={12}>
      <Input placeholder="Outlined" />
    </Flex>
  );
}

export default App;
