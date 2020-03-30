import React from 'react';
import 'antd/dist/antd.min.css';

export default function Wrapper(props) {
  return <div id={'warpper'}>{props.children}</div>;
}
