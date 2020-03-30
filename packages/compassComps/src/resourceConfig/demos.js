import React from 'react';
import { Form } from 'antd';
import Resource from '.';


export class Demo1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        value: {

        },
      },
    };
  }

  onChange = (key, changeData, allData) => {
    console.log('onChange1 >>>> ', key, changeData, allData);
    // this.setState({
    //   data: { ...allData },
    // });
  }

  render() {
    const { data } = this.state;
    const config = {
      cpu: { max: 50, min: 1 },
      mem: { max: 80*1024, min: 1*1024},
      gpu: { max: 50, min: 1 },
    };
    return (
      <Resource
        // itemStyle={{width:400}}
        sliderConf={{ span: 12, offset: 0 }}
        type="basic-slider-alone"
        data={data}
        advanced={false}
        config={config}
        onChange={this.onChange}
      />
    );
  }
}

export class Demo2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        apply: true,
        value: {
          driverCores: 50,
          driverMemory: 3*1024,
          executorCores: 70,
          executorMemory: 2*1024,
          executorNumber: 1,
        },
      },
    };
  }

  onChange = (key, changeData, allData) => {
    console.log('onChange2 >>>> ', key, changeData, allData);
    this.setState({
      data: { ...allData },
    });
  }

  render() {
    const { data } = this.state;
    const config = {
      driverCores: { max: 30, min: 1 },
      driverMemory: { max: 30*1024, min: 1*1024 },
      executorCores: { max: 30, min: 1 },
      executorMemory: { max: 30*1024, min: 1*1024 },
      executorNumber: { max: 30, min: 1 },
    };
    return (
      <Resource
        itemStyle={{ width: 400 }}
        type="basic-slider-dist"
        data={data}
        config={config}
        onChange={this.onChange}
      />
    );
  }
}

export class Demo3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        apply: true,
        value: {},
      },
    };
  }

  onChange = (key, changeData, allData) => {
    console.log('onChange3 >>>> ', key, changeData, allData);
    this.setState({
      data: { ...allData },
    });
  }

  render() {
    const { data } = this.state;
    const config = {
      cpu: { max: 50, min: 1 },
      mem: { max: 50*1024, min: 1*1024 },
      gpu: { max: 50, min: 1 },
    };
    const applyRules = [
      {
        id: 'cf0a2917-b03f-4d25-bfd0-9e889e908811',
        name: 'test3',
        typeId: 1,
        config: null,
        creator: '00000000-1111-0000-000a-000000000001',
        createdTime: '2020-03-13 18:02:17',
        lastUpdateTime: '2020-03-17 16:47:45',
        cpu: 3.0,
        mem: 1024.0,
        gpu: 0.0,
      },
      {
        id: '2806561e-befd-482c-bf90-77285fa7114a',
        name: 'test2',
        typeId: 1,
        config: null,
        creator: '00000000-1111-0000-000a-000000000001',
        createdTime: '2020-03-16 13:37:49',
        lastUpdateTime: '2020-03-16 13:37:49',
        cpu: 3.0,
        mem: 1024.0,
        gpu: 0.0,
      },
    ];
    return (
      <Resource
        itemStyle={{ width: 400 }}
        type="slider-alone"
        data={data}
        config={config}
        applyRules={applyRules}
        onChange={this.onChange}
      />
    );
  }
}


export class Demo4 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        apply: true,
        runModel:true,
        value: {},
      },
    };
  }

  onChange = (key, changeData, allData) => {
    console.log('onChange4 >>>> ', key, changeData, allData);
    this.setState({
      data: { ...allData },
    });
  }

  render() {
    const { data } = this.state;
    const config = {
      driverCores: { max: 30, min: 1 },
      driverMemory: { max: 30*1024, min: 1*1024 },
      executorCores: { max: 30, min: 1 },
      executorMemory: { max: 30*1024, min: 1*1024 },
      executorNumber: { max: 30, min: 1 },
    };
    const applyRules = [
      {
        id: 'b2c6bebe-c87c-44f9-9ae4-69b7412e8085',
        name: 'test6',
        typeId: 2,
        config: '{"{\\"nodeSelector\\":\\"kubernetes.io/hostname":"172.20.51.16\\"}"}',
        creator: '00000000-1111-0000-000a-000000000001',
        createdTime: '2020-03-17 16:48:03',
        lastUpdateTime: '2020-03-17 16:48:03',
        driverCores: 10000.0,
        driverMemory: 4096.0,
        executorCores: 1.0,
        executorMemory: 1024.0,
        executorNumber: 3,
      },
      {
        id: '602fc6a9-0736-4ede-aed5-6dfe0aadac44',
        name: 'test5',
        typeId: 2,
        config: '{"nodeSelector":"kubernetes.io/hostname=172.20.51.16"}',
        creator: '00000000-1111-0000-000a-000000000001',
        createdTime: '2020-03-16 15:44:06',
        lastUpdateTime: '2020-03-16 15:44:06',
        driverCores: 1.0,
        driverMemory: 1024.0,
        executorCores: 1.0,
        executorMemory: 1024.0,
        executorNumber: 3,
      },
    ];
    return (
      <Resource
        itemStyle={{ width: 400 }}
        type="slider-dist"
        data={data}
        config={config}
        applyRules={applyRules}
        onChange={this.onChange}
      />
    );
  }
}

