import React from 'react';
import { Form } from 'antd';
import Resource from './';

@Form.create({
  mapPropsToFields(props){
    const { data } = props;
    const { value } = data;
    return {
      apply: Form.createFormField({value:data.apply}),
      cpu: Form.createFormField({value:value.cpu}),
      mem: Form.createFormField({value:value.mem}),
      gpu: Form.createFormField({value:value.gpu})
    }
  },
  onValuesChange(props, changedValues, allValues){
    // console.log('onValuesChange >>> ',changedValues,allValues);
  }
})
export class Demo1 extends React.Component{
  constructor(props){
    super(props);
  }
  onChange = (key,changeData,allData)=>{
    console.log('onChange1 >>>> ',key,changeData,allData)
  }
  render(){
    const layout = {labelCol: { span: 4 }, wrapperCol: { span: 20 }};
    return (
      <Form {...layout} name="demo1">
        <Resource {...this.props} notForm={true} onChange={this.onChange}></Resource>
      </Form>
    )
  }
}


@Form.create({
  mapPropsToFields(props){
    const { data } = props;
    const { value, apply } = data;
    return {
      apply: Form.createFormField({value:apply}),
      driverCpu: Form.createFormField({value:value.driverCpu}),
      driverMem: Form.createFormField({value:value.driverMem}),
      executorCpu: Form.createFormField({value:value.executorCpu}),
      executorMem: Form.createFormField({value:value.executorMem}),
      executorNum: Form.createFormField({value:value.executorNum})

    }
  },
  onValuesChange(props, changedValues, allValues){
    // console.log('onValuesChange >>> ',changedValues,allValues);
  }
})
export class Demo2 extends React.Component{
  constructor(props){
    super(props);
  }
  onChange = (key,changeData,allData)=>{
    console.log('onChange2 >>>> ',key,changeData,allData)
  }
  render(){
    const layout = {labelCol: { span: 4 }, wrapperCol: { span: 20 }};
    return (
      <Form {...layout} name="demo1">
        <Resource {...this.props} onChange={this.onChange}></Resource>
      </Form>
    )
  }
}

export class Demo3 extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      type: 'alone',
      data: {
        apply: false,
        value:{}
      },
      applyRules:[
        {id:1,cpu: 10, mem: 30, gpu: 2},
        {id:2,cpu: 20, mem: 30, gpu: 2},
        {id:3,cpu: 30, mem: 30, gpu: 2},
        {id:4,cpu: 40, mem: 30, gpu: 2},
        {id:5,cpu: 50, mem: 30, gpu: 2}
      ],
      config:{cpu: 10, mem: 30, gpu: 2}
    }
  }
  onChange = (key,changeData,allData)=>{
    console.log('onChange3 >>>> ',key,changeData,allData);
    this.setState({
      data:{...allData}
    })

  }
  render(){
    const layout = {labelCol: { span: 4 }, wrapperCol: { span: 20 }};
    const {type,data, config} = this.state;
    const applyRules = [
      {
        "id": "cf0a2917-b03f-4d25-bfd0-9e889e908811",
        "name": "test3",
        "typeId": 1,
        "config": null,
        "creator": "00000000-1111-0000-000a-000000000001",
        "createdTime": "2020-03-13 18:02:17",
        "lastUpdateTime": "2020-03-17 16:47:45",
        "cpu": 3.0,
        "mem": 1024.0,
        "gpu": 0.0
      },
      {
        "id": "2806561e-befd-482c-bf90-77285fa7114a",
        "name": "test2",
        "typeId": 1,
        "config": null,
        "creator": "00000000-1111-0000-000a-000000000001",
        "createdTime": "2020-03-16 13:37:49",
        "lastUpdateTime": "2020-03-16 13:37:49",
        "cpu": 3.0,
        "mem": 1024.0,
        "gpu": 0.0
      }
    ];
    return (
      <Resource
        applyRules = {applyRules}
        type={type}
        data={data}
        config={config}
        layout={layout}
        onChange={this.onChange}></Resource>
    )
  }
}

export class Demo4 extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      type: 'distributed',
      data: {
        apply:false,
        value:{}
      },
      applyRules:[
        {driverCpu:10,driverMem:30,executorCpu:2,executorMem:12,executorNum:21},
        {driverCpu:20,driverMem:30,executorCpu:2,executorMem:12,executorNum:21},
        {driverCpu:30,driverMem:30,executorCpu:2,executorMem:12,executorNum:21},
        {driverCpu:40,driverMem:30,executorCpu:2,executorMem:12,executorNum:21}
      ],
      config:{driverCpu:10,driverMem:30,executorCpu:2,executorMem:12,executorNum:21},
    }
  }
  onChange = (key,changeData,allData)=>{
    console.log('onChange4 >>>> ',key,changeData,allData);
    this.setState({
      data:{...allData}
    })
  }
  render(){
    const layout = {labelCol: { span: 4 }, wrapperCol: { span: 20 }};
    const {apply,data,type, config,model} = this.state;
    const applyRules = [
      {
        "id": "b2c6bebe-c87c-44f9-9ae4-69b7412e8085",
        "name": "test6",
        "typeId": 2,
        "config": "{\"{\\\"nodeSelector\\\":\\\"kubernetes.io/hostname\":\"172.20.51.16\\\"}\"}",
        "creator": "00000000-1111-0000-000a-000000000001",
        "createdTime": "2020-03-17 16:48:03",
        "lastUpdateTime": "2020-03-17 16:48:03",
        "dirverCpu": 10000.0,
        "dirverMem": 4096.0,
        "executorCpu": 1.0,
        "executorMem": 1024.0,
        "executorCount": 3
      },
      {
        "id": "602fc6a9-0736-4ede-aed5-6dfe0aadac44",
        "name": "test5",
        "typeId": 2,
        "config": "{\"nodeSelector\":\"kubernetes.io/hostname=172.20.51.16\"}",
        "creator": "00000000-1111-0000-000a-000000000001",
        "createdTime": "2020-03-16 15:44:06",
        "lastUpdateTime": "2020-03-16 15:44:06",
        "dirverCpu": 1.0,
        "dirverMem": 1024.0,
        "executorCpu": 1.0,
        "executorMem": 1024.0,
        "executorCount": 3
      }
    ]
    return (
      <Resource
        itemWidth={320}
        applyRules={applyRules}
        type={type}
        data={data}
        config={config}
        layout={layout}
        model={model}
        onChange={this.onChange}></Resource>
    )
  }
}


