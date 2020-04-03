import React from 'react';
import TableSelect from '.';

export class Demos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name1',
        key: 'name1',
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '住址',
        dataIndex: 'address',
        key: 'address',
        ellipsis: true,
      },
    ];
    const dataSource = [
      {
        key: '1',
        name1: '胡彦斌1',
        age: 32,
        address: '西湖区湖底公园1号',
      },
      {
        key: '2',
        name1: '胡彦祖2',
        age: 42,
        address: '西湖区湖底公园1号',
      },
      {
        key: '3',
        name1: '胡彦斌3',
        age: 32,
        address: '西湖区湖底公园1号',
      },
      {
        key: '4',
        name1: '胡彦祖4',
        age: 42,
        address: '西湖区湖底公园1号',
      },
      {
        key: '5',
        name1: '胡彦斌5',
        age: 32,
        address: '西湖区湖底公园1号',
      },
      {
        key: '6',
        name1: '胡彦祖6',
        age: 42,
        address: '西湖区湖底公园1号',
      },
    ];
    return (
      <TableSelect
        tableConfig={{
          nameKey: 'name1', // nameKey 默认值为 name
          idKey: 'key', // idKey  默认值为 id
          columns,
          dataSource,
          pagination: false,
        }}

      />
    );
  }
}
