import React from "react"

import { Input} from "antd"
import { Menu } from 'antd';

const items = [
  {
    key: 'sub1',
    label: 'Shared Cart',
    children: [
      {
        key: '1',
        label: 'Item 1',
      },
    ],
  },
];


// the following two are for the scroll box
const containerStyle = {
  width: '25%',
  height: 100,
  overflow: 'auto',
  boxShadow: '0 0 0 1px #1677ff',
  scrollbarWidth: 'thin',
  scrollbarColor: 'unset',
};
const style = {
  width: '100%',
  height: 1000, // change it later
};

const Home = () => {
  const onClick = (e) => {
    console.log('click ', e);
  };
  const [container, setContainer] = React.useState(null);
  
  return (
    <div className="flex flex-col bg-gray-300 min-h-screen">
      <div className="flex-1 overflow-auto">
        {/* <Menu
          onClick={onClick}
          style={{ width: 256 }}
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          items={items}
        /> */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12 m-4 p-2 bg-white rounded-lg shadow-lg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>

      </div>
      <div className="p-4">
        <Input placeholder="Enter your request" className="w-full shadow-lg"/>
      </div>
    </div>
  );
};

export default Home;
