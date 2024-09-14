import React from "react"

import { Input} from "antd"
import type { MenuProps } from 'antd';
import { Menu } from 'antd';

// for shared cart dropdown
type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
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

const Home:React.FC = () => {
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
  };
  const [container, setContainer] = React.useState(null);
  return <div>
    <div className="flex justify-around">
      <Input placeholder="Enter your request" className="w-1/2"/>
    </div>
    <div className="flex justify-end">
      <Menu
        onClick={onClick}
        style={{ width: 256 }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        items={items}
      />
    </div>
  </div>
}
export default Home
