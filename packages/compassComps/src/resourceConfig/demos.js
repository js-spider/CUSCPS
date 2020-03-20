import React from 'react';
import { Form } from 'antd';
import Resource from './';

@Form.create({
  mapPropsToFields(props){
    const { apply,data } = props;
    return {
      apply: Form.createFormField({value:apply}),
      cpu: Form.createFormField({value:data.cpu}),
      mem: Form.createFormField({value:data.mem}),
      gpu: Form.createFormField({value:data.gpu})
    }
  },
  onValuesChange(props, changedValues, allValues){
    console.log('onValuesChange >>> ',changedValues,allValues);
  }
})
export class Demo1 extends React.Component{
  constructor(props){
    super(props);
  }
  onChange = (key,changeData,allData)=>{
    console.log('onChange >>>> ',key,changeData,allData)
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


@Form.create({
  mapPropsToFields(props){
    const { apply,data } = props;
    return {
      apply: Form.createFormField({value:apply}),
      driverCpu: Form.createFormField({value:data.driverCpu}),
      driverMem: Form.createFormField({value:data.driverMem}),
      executorCpu: Form.createFormField({value:data.executorCpu}),
      executorMem: Form.createFormField({value:data.executorMem}),
      executorNum: Form.createFormField({value:data.executorNum})

    }
  },
  onValuesChange(props, changedValues, allValues){
    console.log('onValuesChange >>> ',changedValues,allValues);
  }
})
export class Demo2 extends React.Component{
  constructor(props){
    super(props);
  }
  onChange = (key,changeData,allData)=>{
    console.log('onChange >>>> ',key,changeData,allData)
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
      apply: false,
      type: 'alone',
      data: {},
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
    console.log('onChange >>>> ',key,changeData,allData);
    this.setState({
      ...allData
    })

  }
  render(){
    const layout = {labelCol: { span: 4 }, wrapperCol: { span: 20 }};
    const {apply,type,data,applyRules,rule, config} = this.state;
    return (
      <Resource
        apply={apply}
        applyRules = {applyRules}
        type={type}
        data={data}
        rule={rule}
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
      apply: false,
      type: 'distributed',
      data: {},
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
    console.log('onChange >>>> ',key,changeData,allData);
    this.setState({
      ...allData
    })
  }
  render(){
    const layout = {labelCol: { span: 4 }, wrapperCol: { span: 20 }};
    const {apply,data,applyRules,type, config} = this.state;
    return (
      <Resource
        apply={apply}
        applyRules = {applyRules}
        type={type}
        data={data}
        config={config}
        layout={layout}
        onChange={this.onChange}></Resource>
    )
  }
}


