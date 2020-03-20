import React from 'react';
import Pt from 'prop-types';
import { Form, Input,InputNumber,Tooltip, Icon, Switch, Select } from 'antd';
import { ResourceBasic , ResourceFormBasic} from './ResourceBasic';

const createForm = (component)=> {
  return Form.create({
    mapPropsToFields(props){
      const { apply,data,model,rule } = props;
      const fields = {
        apply: Form.createFormField({value:apply}),
      };
      if(model){
        fields.model = Form.createFormField({value:model})
      }
      if(apply){
        fields.rule = Form.createFormField({value:rule})
      }
      Object.keys(data).forEach(key=>{
        fields[key] = Form.createFormField({value:data[key]})
      });
      return fields;
    },
    onValuesChange(props, changedValues, allValues){
      console.log('onValuesChange >>> ',changedValues,allValues);
      // props.form.validateFields(Object.keys(changedValues))
    }
  })(component)
}


const applyKey = 'id';

export default class Resource extends React.Component{
  static propTypes = {
    /** 组件类型 */
    type:Pt.oneOf(['basic-alone','basic-dis','alone','distributed']),

    /** 是否启用 引用规格 默认值: true */
    apply:Pt.bool,

    /** 输入框的配置说明 设置输入框的最大限额 */
    config:Pt.object,

    /** 输入框data */
    data:Pt.object,

    /** 启用引用规则时 规格列表 */
    applyRules:Pt.array,

    /** 输入框的 宽度设置 默认值: 260px */
    itemWidth:Pt.number,

    /** 是否显示 输入框后的提示信息 默认值: true */
    extra:Pt.bool,

    /** 设置Form label 以及输入框的样式 */
    layout:Pt.object,

  };
  static defaultProps = {
    apply:false,
    itemWidth:260,
    extra:true,
    type:'basic-alone',
    config:{},
    data:{}
  };

  constructor(props){
    super(props);
    this.state = {
      resourceType:null
    }
    this.timer = null;
  }
  componentDidMount() {
    const { type, form } = this.props;
    // const resourceType = form || type.startsWith('basic-') ? ResourceBasic : createForm(ResourceFormBasic)  ;
    const resourceType = form ? ResourceBasic : createForm(ResourceFormBasic)  ;
    this.setState({
      resourceType:resourceType
    }) ;
  }
  componentWillUnmount() {
    this.timer = null;
    this.resourceType = null;
  }

  onChange=(key,e, currentForm) => {
    const { data, onChange } = this.props;
    const val = e && e.currentTarget ? {[key]:e.currentTarget.value} : {[key]:e};
    setTimeout(()=>{
      currentForm.validateFields([key],(err)=>{
        if(!err){
          onChange(key,val,{data:{...data,...val}})
        }
      })
    },0)
  }

  onSwitchChange = (key,val) => {
    const { data, onChange } = this.props;
    const changeData = {[key]:val};
    onChange(key,changeData,{data:{...data},...changeData});
  }

  onSelectChange = (key,val) => {
    const { applyRules, onChange, apply } = this.props;
    const data = applyRules.filter(item=>(item[applyKey] === val))[0] || {};
    const allData = {data:{...data},apply};
    allData[key] = val;
    onChange('rule',{[key]:val},allData)
  }

  render(){
    const ResourceType  = this.state.resourceType;
    const layout = {labelCol: { span: 4 }, wrapperCol: { span: 20 }};
    const { apply,itemWidth, extra, type,applyRules, config }  = this.props;
    // if(!form && type.startsWith('basic-')) throw new Error('type 为 基础组件时 必须使用在Form中')

    const itemBase = {
      // 单机基础组件
      standAloneBase: (currentForm)=>(<React.Fragment>
        <Form.Item
          key={'cpu'}
          label="CPU (Cores)"
        >
          {
            currentForm.getFieldDecorator('cpu',{
              rules:[{
                required: true,
              }],
            })(
              <InputNumber style={{width:itemWidth}} onChange={(e)=>{this.onChange('cpu',e,currentForm)}} max={config.cpu}></InputNumber>
            )
          }
          {extra && <span style={{marginLeft:15}}> {`CPU 可配置资源 ${config.cpu} 核`}</span>}
        </Form.Item>
        <Form.Item
          key={'mem'}
          label="MEM（GB)"
        >
          {
            currentForm.getFieldDecorator('mem',{
              rules:[{required: true}]
            })(
              <InputNumber style={{width:itemWidth}} onChange={(e)=>{this.onChange('mem',e,currentForm)}} max={config.mem}></InputNumber>
            )
          }
          {extra && <span style={{marginLeft:15}}> {`MEM可配置资源 ${config.mem} GB`}</span>}
        </Form.Item>
        <Form.Item
          key={'gpu'}
          label="GPUs"
        >
          {
            currentForm.getFieldDecorator('gpu',{
            })(
              <InputNumber style={{width:itemWidth}} onChange={(e)=>(this.onChange('gpu',e,currentForm))} max={config.gpu}></InputNumber>
            )
          }
          {extra && <span style={{marginLeft:15}}> {`GPU可配置资源 ${config.gpu}`}</span>}
        </Form.Item>
      </React.Fragment>),

      // 分布式 基础组件
      distributedBase:(currentForm)=>(<React.Fragment>
        <Form.Item
          key={'driverCpu'}
          label="Driver CPU核数"
        >
          {
            currentForm.getFieldDecorator('driverCpu',{
              rules:[{required: true}]
            })(
              <InputNumber style={{width:itemWidth}} onChange={(e)=>(this.onChange('driverCpu',e,currentForm))} max={config.driverCpu}></InputNumber>
            )
          }
          {extra && <span style={{marginLeft:15}}> {`可配置资源 ${config.driverCpu} 核`} </span>}
        </Form.Item>
        <Form.Item
          label="Driver分配内存"
          key={'driverMem'}
        >
          {
            currentForm.getFieldDecorator('driverMem',{
              rules:[{required: true}]
            })(
              <InputNumber style={{width:itemWidth}} onChange={(e)=>(this.onChange('driverMem',e,currentForm))} max={config.driverMem}></InputNumber>
            )
          }
          {extra && <span style={{marginLeft:15}}> {`配置资源 ${config.driverMem} GB`}</span>}
        </Form.Item>
        <Form.Item
          key={'executorCpu'}
          label="Executor CPU核数"
        >
          {
            currentForm.getFieldDecorator('executorCpu',{
              rules:[{required: true}]
            })(
              <InputNumber style={{width:itemWidth}} onChange={(e)=>(this.onChange('executorCpu',e,currentForm))} max={config.executorCpu} ></InputNumber>
            )
          }
          {extra && <span style={{marginLeft:15}}> {`可配置资源 ${config.executorCpu} 核`}</span>}
        </Form.Item>
        <Form.Item
          key={'executorMem'}
          label="Executor 分配内存"
        >
          {
            currentForm.getFieldDecorator('executorMem',{
              rules:[{required: true}]
            })(
              <InputNumber style={{width:itemWidth}} onChange={(e)=>(this.onChange('executorMem',e,currentForm))} max={config.executorMem}></InputNumber>
            )
          }
          {extra && <span style={{marginLeft:15}}> {`可配置资源 ${config.executorMem} GB`}</span>}
        </Form.Item>
        <Form.Item
          key={'executorNum'}
          label="Executor 数量"
        >
          {
            currentForm.getFieldDecorator('executorNum',{
              rules:[{required: true}]
            })(
              <InputNumber style={{width:itemWidth}} onChange={(e)=>(this.onChange('executorNum',e,currentForm))} max={config.executorNum} ></InputNumber>
            )
          }
          {extra && <span style={{marginLeft:15}}> {`可配置资源 ${config.executorNum}`}</span>}
        </Form.Item>
      </React.Fragment>)


    }

    let typesArr;
    switch(type){
      case 'basic-alone':
        typesArr = (currentForm)=>(itemBase.standAloneBase(currentForm));
        break;
      case 'basic-dis':
        typesArr = (currentForm)=>(itemBase.distributedBase(currentForm))
        break;
      case 'alone':
        typesArr = apply ? (currentForm)=>{
          return [
            <Form.Item
              key={'apply'}
              label={(
                <span>
                应用规格
                <Tooltip title="规格格式为: CPU | 内存 | GPU">
                  <Icon type="info-circle" style={{margin:'0px 5px'}}/>
                </Tooltip>
              </span>
              )}
            >
              {currentForm.getFieldDecorator('apply',{
                valuePropName: 'checked'
              })(<Switch checkedChildren="是" unCheckedChildren="否" onChange={(val)=>{
                this.onSwitchChange('apply',val)
              }}/>)}
            </Form.Item>,
            <Form.Item
              label="选择规格"
              key={'rule'}
            >
              {
                currentForm.getFieldDecorator('rule',{
                  initialValue:''
                })(
                  <Select
                    style={{ width: itemWidth }}
                    placeholder="Select a person"
                    optionFilterProp="children"
                    onChange={(val)=>{this.onSelectChange('rule',val)}}
                  >
                    {applyRules.map((item,index)=>(
                      <Select.Option value={item[applyKey]}>{JSON.stringify(item)}</Select.Option>
                    ))}
                  </Select>
                )
              }

            </Form.Item>
          ]} : (currentForm)=>{
          return [
            <Form.Item
              key={'apply'}
              label={(
                <span>
                应用规格
                <Tooltip title="规格格式为: CPU | 内存 | GPU">
                  <Icon type="info-circle" style={{margin:'0px 5px'}}/>
                </Tooltip>
              </span>
              )}
            >
              {currentForm.getFieldDecorator('apply',{
                valuePropName: 'checked'
              })(<Switch checkedChildren="是" unCheckedChildren="否" onChange={(val)=>{
                this.onSwitchChange('apply',val)
              }}/>)}
            </Form.Item>,
            itemBase.standAloneBase(currentForm),
            <Form.Item
              key={'advanced'}
              label={'高级配置'}
            >
              {
                currentForm.getFieldDecorator('advanced',{

                })(
                  <Input.TextArea rows={4} style={{width:itemWidth}} onChange={(e)=>(this.onChange('advanced',e,currentForm))}/>
                )
              }
            </Form.Item>
          ]}
        break;
      case 'distributed':
        typesArr = apply ? (currentForm)=>{
          return [
            <Form.Item
              key={'model'}
              label={'运行模式'}
            >
              {currentForm.getFieldDecorator('model',{
                initialValue:'jack'
              })(<Select
                style={{ width: itemWidth }}
                placeholder="Select model"
                optionFilterProp="children"
                onChange = {(val)=>{this.onSelectChange('model',val)}}
              >
                <Select.Option value="jack">智能加速模式</Select.Option>
                <Select.Option value="lucy">经济模式</Select.Option>
                <Select.Option value="tom">稳健模式</Select.Option>
              </Select>)}
            </Form.Item>,
            <Form.Item
              key={'apply'}
              label={(
                <span>
                应用规格
                <Tooltip title="规格格式为: DriverCPU核数 | Driver内存| Executor CPU核数| Executor内存|Executor数量">
                  <Icon type="info-circle" style={{margin:'0px 5px'}}/>
                </Tooltip>
              </span>
              )}
            >
              {currentForm.getFieldDecorator('apply',{
                valuePropName: 'checked'
              })(<Switch checkedChildren="是" unCheckedChildren="否" onChange={(val)=>{
                this.onSwitchChange('apply',val)
              }}/>)}
            </Form.Item>,
            <Form.Item
              key={'rule'}
              label="选择规格"
            >
              {
                currentForm.getFieldDecorator('rule',{
                  initialValue:''
                })(
                  <Select
                    style={{ width: itemWidth }}
                    placeholder="Select a person"
                    optionFilterProp="children"
                    onChange = {(val)=>{this.onSelectChange('rule',val)}}
                  >
                    <Select.Option value={''}>请选择规格</Select.Option>
                    {applyRules.map((item)=>(
                      <Select.Option value={item[applyKey]}>{JSON.stringify(item)}</Select.Option>
                    ))}
                  </Select>
                )
              }

            </Form.Item>
          ]} : (currentForm)=>{
          return [
            <Form.Item
              key={'model'}
              label={'运行模式'}
            >
              {currentForm.getFieldDecorator('model',{
                valuePropName: 'checked'
              })(<Select
                style={{ width: itemWidth }}
                placeholder="Select model"
                optionFilterProp="children"
                onChange = {(val)=>{this.onSelectChange('model',val)}}
              >
                <Select.Option value="jack">智能加速模式</Select.Option>
                <Select.Option value="lucy">经济模式</Select.Option>
                <Select.Option value="tom">稳健模式</Select.Option>
              </Select>)}
            </Form.Item>,
            <Form.Item
              key={'apply'}
              label={(
                <span>
                应用规格
                <Tooltip title="规格格式为: DriverCPU核数 | Driver内存| Executor CPU核数| Executor内存|Executor数量">
                  <Icon type="info-circle" style={{margin:'0px 5px'}}/>
                </Tooltip>
              </span>
              )}
            >
              {currentForm.getFieldDecorator('apply',{
                valuePropName: 'checked'
              })(<Switch checkedChildren="是" unCheckedChildren="否" onChange={(val)=>{
                this.onSwitchChange('apply',val)
              }}/>)}
            </Form.Item>,
            itemBase.distributedBase(currentForm),
            <Form.Item
              key={'advanced'}
              label={(
                <span>
                高级配置
                <Tooltip title="配置SparkConf">
                  <Icon type="info-circle" style={{margin:'0px 5px'}}/>
                </Tooltip>
              </span>
              )}
            >
              {
                currentForm.getFieldDecorator('advanced',{

                })(
                  <Input.TextArea rows={4} style={{width:itemWidth}} onChange={(e)=>(this.onChange('advanced',e,currentForm))} />
                )
              }
            </Form.Item>
          ]}
        break;
      default:{
        return [];
      }
    }



    if(!ResourceType){
      return <React.Fragment></React.Fragment>;
    }
    return <ResourceType {...this.props} itemProps={typesArr} layout={layout}></ResourceType>
  }
}
