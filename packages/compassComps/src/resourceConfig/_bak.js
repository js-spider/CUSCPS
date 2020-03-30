import React from "react";
import {Form, InputNumber} from "antd";

export default class Test extends React.Component{
  render(){
    const comp = {
      // 单机基础组件
      standAloneBase: (currentForm) => (
        <React.Fragment>
          <Form.Item
            key="cpu"
            label="CPU (Cores)"
          >
            {
              currentForm.getFieldDecorator('cpu', {
                rules: [{
                  required: true,
                }],
              })(
                <InputNumber disabled={disabled} style={itemStyle} onChange={(e) => { this.onChange('cpu', e, currentForm); }} max={config.cpu.max} min={config.cpu.min} />
              )
            }
            {extra && <span style={{ marginLeft: 15 }}> {`CPU 可配置资源 ${config.cpu.max} 核`}</span>}
          </Form.Item>
          <Form.Item
            key="mem"
            label="MEM（GB)"
          >
            {
              currentForm.getFieldDecorator('mem', {
                rules: [{ required: true }],
              })(
                <InputNumber disabled={disabled} style={itemStyle} onChange={(e) => { this.onChange('mem', e, currentForm); }} max={config.mem.max} min={config.mem.min} />
              )
            }
            {extra && <span style={{ marginLeft: 15 }}> {`MEM可配置资源 ${config.mem.max} GB`}</span>}
          </Form.Item>
          <Form.Item
            key="gpu"
            label="GPUs"
          >
            {
              currentForm.getFieldDecorator('gpu', {
              })(
                <InputNumber disabled={disabled} style={itemStyle} onChange={(e) => (this.onChange('gpu', e, currentForm))} max={config.gpu.max} min={config.gpu.min} />
              )
            }
            {extra && <span style={{ marginLeft: 15 }}> {`GPU可配置资源 ${config.gpu.max}`}</span>}
          </Form.Item>
        </React.Fragment>
      ),
      // 分布式 基础组件
      distributedBase: (currentForm) => (
        <React.Fragment>
          <Form.Item
            key="driverCores"
            label="Driver CPU核数"
          >
            {
              currentForm.getFieldDecorator('driverCores', {
                rules: [{ required: true }],
              })(
                <InputNumber disabled={disabled} style={itemStyle} onChange={(e) => (this.onChange('driverCores', e, currentForm))} max={config.driverCores.max} min={config.driverCores.min} />
              )
            }
            {extra && <span style={{ marginLeft: 15 }}> {`可配置资源 ${config.driverCores.max} 核`} </span>}
          </Form.Item>
          <Form.Item
            label="Driver分配内存"
            key="driverMemory"
          >
            {
              currentForm.getFieldDecorator('driverMemory', {
                rules: [{ required: true }],
              })(
                <InputNumber disabled={disabled} style={itemStyle} onChange={(e) => (this.onChange('driverMemory', e, currentForm))} max={config.driverMemory.max} min={config.driverMemory.min} />
              )
            }
            {extra && <span style={{ marginLeft: 15 }}> {`配置资源 ${config.driverMemory.max} GB`}</span>}
          </Form.Item>
          <Form.Item
            key="executorCores"
            label="Executor CPU核数"
          >
            {
              currentForm.getFieldDecorator('executorCores', {
                rules: [{ required: true }],
              })(
                <InputNumber disabled={disabled} style={itemStyle} onChange={(e) => (this.onChange('executorCores', e, currentForm))} max={config.executorCores.max} min={config.executorCores.min} />
              )
            }
            {extra && <span style={{ marginLeft: 15 }}> {`可配置资源 ${config.executorCores.max} 核`}</span>}
          </Form.Item>
          <Form.Item
            key="executorMemory"
            label="Executor 分配内存"
          >
            {
              currentForm.getFieldDecorator('executorMemory', {
                rules: [{ required: true }],
              })(
                <InputNumber disabled={disabled} style={itemStyle} onChange={(e) => (this.onChange('executorMemory', e, currentForm))} max={config.executorMemory.max} min={config.executorMemory.max} />
              )
            }
            {extra && <span style={{ marginLeft: 15 }}> {`可配置资源 ${config.executorMemory.max} GB`}</span>}
          </Form.Item>
          <Form.Item
            key="executorNumber"
            label="Executor 数量"
          >
            {
              currentForm.getFieldDecorator('executorNumber', {
                rules: [{ required: true }],
              })(
                <InputNumber disabled={disabled} style={itemStyle} onChange={(e) => (this.onChange('executorNumber', e, currentForm))} max={config.executorNumber.max} min={config.executorNumber.min} />
              )
            }
            {extra && <span style={{ marginLeft: 15 }}> {`可配置资源 ${config.executorNumber.max}`}</span>}
          </Form.Item>
        </React.Fragment>
      ),
    }
    return (
      <div></div>
    )
  }
}
