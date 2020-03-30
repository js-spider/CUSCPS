import React from 'react';
import Pt from 'prop-types';
import { Form, Input, InputNumber, Tooltip, Icon, Switch, Select, Row, Col } from 'antd';
import { ResourceBasic, ResourceFormBasic } from './ResourceBasic';
import SliderResource from './slider';
import styles from './index.less';

const _toFixed = (data = 0, num = 3) => {
  let n2s = Number(data).toFixed(num);
  if (n2s.split('.')[1] === '000') n2s = n2s.split('.')[0];
  return n2s;
};

const _formatValue = (key, config, value = 0) => {
  let val = [config[key].min, config[key].max, value].sort((a, b) => (a - b))[1];
  return {
    value: val,
    error: val !== value
  }
};


const createForm = (component) => {
  return Form.create({
    mapPropsToFields(props) {
      const { data, config } = props;
      const fields = {
        apply: Form.createFormField({ value: data.apply }),
      };
      if (data.model) {
        fields.model = Form.createFormField({ value: data.model });
      }
      if (data.apply) {
        fields.rule = Form.createFormField({ value: data.value.id });
      }
      Object.keys(config).forEach(key => {
        let field = {},formatValue,dataValue = data.value[key] || '0';
        if (key === 'mem' || key.endsWith('Memory')) {
          formatValue = _formatValue(key, config, _toFixed(dataValue));
          field.value = (formatValue.value)/1024;
          field.errors = formatValue.error && data.value[key] ? [{message:`[${config[key].min}~${config[key].max}] : ${dataValue/1024} 值异常已调整为:${field.value}`}] :null;
        }else {
          formatValue = _formatValue(key, config, dataValue);
          field.value = formatValue.value;
          field.errors = formatValue.error && data.value[key] ? [{message:`[${config[key].min}~${config[key].max}] : ${dataValue} 值异常已调整为:${field.value}`}] :null;
        }
        fields[key] = Form.createFormField(field);
      });
      return fields;
    },
  })(component);
};


const applyKey = 'id';
const emptyFn = () => {};

export default class Resource extends React.Component {
  static propTypes = {
    /** 组件类型 */
    type: Pt.oneOf(['basic-slider-alone', 'basic-slider-dist', 'slider-alone', 'slider-dist']),

    /** 输入框的配置说明 设置输入框的最大限额 */
    config: Pt.object,

    /** 输入框data */
    data: Pt.object,

    /** 禁用 */
    disabled: Pt.bool,

    /** 启用引用规则时 规格列表 */
    applyRules: Pt.array,

    /** 启用运行模式 */
    runModel:Pt.bool,

    /** 启用高级配置 */
    advanced:Pt.bool,

    /** 输入框的样式 设置 宽度默认值: 260px */
    itemStyle: Pt.object,

    /** 是否显示 输入框后的提示信息 默认值: true */
    extra: Pt.bool,

    /** 设置Form label 以及输入框的样式 */
    layout: Pt.object,

    /** 设置 slider 布局 通过Col 的span 和 offset */
    sliderConf: Pt.object,

    /** 回调function */
    onChange: Pt.func,
  };

  static defaultProps = {
    itemStyle: { width: 320 },
    extra: true,
    disabled: false,
    type: 'basic-alone',
    config: {},
    applyRules: [],
    runModel:true,
    advanced:true,
    layout: {},
    sliderConf: { span: 20, offset: 4 },
    data: {
      // 是否开启应用
      apply: false,
      // 值
      value: {},
      // 运行模式
      model: '',
      // 应用规格id
      rule: '',
    },
    onChange: emptyFn,
  };

  constructor(props) {
    super(props);
    this.state = {
      resourceType: null,
    };
    this.timer = null;
  }

  componentDidMount() {
    const { form,data,config,onChange } = this.props;
    const resourceType = form ? ResourceBasic : createForm(ResourceFormBasic);
    const newData = {...data,value:{...data.value}};
    config && Object.keys(config).forEach(key=>{
      newData.value[key] = _formatValue(key,config,newData.value[key]).value
    });
    onChange('validate',{value:newData.value},{...newData});
    this.setState({
      resourceType,
    });
  }

  componentWillUnmount() {
    this.timer = null;
    this.resourceType = null;
  }

  onChange=(key, e, currentForm) => {
    const { data, onChange,config } = this.props;
    if (onChange) {
      const val = e && e.currentTarget ?  _toFixed(Number(e.currentTarget.value)) : _toFixed(Number(e));
      if (key === 'mem' || key.endsWith('Memory')) {
        data.value[key] = val*1024;
      } else if (key === 'executorNumber') {
        data.value[key] = Math.floor(val);
      } else {
        data.value[key] = val;
      }
      data.value[key] = _formatValue(key, config, data.value[key]).value;
      setTimeout(() => {
        currentForm.setFieldsValue({ [key]: val });
        onChange && currentForm.validateFields([key], (err) => {
          if (!err) {
            onChange(key, {[key]:data.value[key]}, { ...data });
          }
        });
      }, 0);
    }
  }

  onSwitchChange = (key, val) => {
    const { data, onChange } = this.props;
    const changeData = { [key]: val };
    onChange && onChange(key, changeData, { ...data, ...changeData, value: {} });
  }

  onSelectSpecChange = (key, val) => {
    const { applyRules, onChange, data } = this.props;
    if (onChange) {
      const value = applyRules.filter(item => (item[applyKey] === val))[0] || {};
      const allData = { ...data, value: { ...value } };
      allData[key] = val;
      onChange(key, { [key]: val }, allData);
    }
  }

  onSelectModelChange = (key, val) => {
    const { data, onChange } = this.props;
    const allData = { ...data, model: val };
    onChange && onChange(key, { [key]: val }, allData);
  }

  runModelFn = (currentForm) => {
    const { runModel, itemStyle } = this.props;
    return runModel ? <Form.Item
      key="model"
      label="运行模式"
    >
      {currentForm.getFieldDecorator('model', {
        initialValue: 'jack',
      })(
        <Select
          style={itemStyle}
          placeholder="Select model"
          optionFilterProp="children"
          onChange={(val) => { this.onSelectModelChange('model', val); }}
        >
          <Select.Option key='AUTO' value="AUTO">智能加速模式</Select.Option>
          <Select.Option key='JOB' value="JOB">经济模式</Select.Option>
          <Select.Option key='BLOCK' value="BLOCK">稳健模式</Select.Option>
        </Select>
      )}
    </Form.Item> : null;
  }

  applyFn = (currentForm) => {
    return (
      <Form.Item
        key="apply"
        label={(
          <span>
                  应用规格
                  <Tooltip title="规格格式为: DriverCPU核数 | Driver内存| Executor CPU核数| Executor内存|Executor数量">
                    <Icon type="info-circle" style={{ margin: '0px 5px' }} />
                  </Tooltip>
                </span>
        )}
      >
        {currentForm.getFieldDecorator('apply', {
          valuePropName: 'checked',
        })(<Switch
          checkedChildren="是"
          unCheckedChildren="否"
          onChange={(val) => {
            this.onSwitchChange('apply', val);
          }}
        />)}
      </Form.Item>
    )
  }

  advancedFn =(currentForm) => {
    const { itemStyle, advanced } = this.props;
    return advanced ? (
      <Form.Item
        key="advanced"
        label={(
          <span>
                  高级配置
                  <Tooltip title="配置SparkConf">
                    <Icon type="info-circle" style={{ margin: '0px 5px' }} />
                  </Tooltip>
                </span>
        )}
      >
        {
          currentForm.getFieldDecorator('advanced', {

          })(
            <Input.TextArea rows={4} style={itemStyle} onChange={(e) => (this.onChange('advanced', e, currentForm))} />
          )
        }
      </Form.Item>
    ):null
  }

  ruleFn =(currentForm) => {
    const { itemStyle, applyRules } = this.props;
    return (
      <Form.Item
        key="rule"
        label="选择规格"
      >
        {
          currentForm.getFieldDecorator('rule', {
            initialValue: '',
          })(
            <Select
              style={itemStyle}
              placeholder="Select a person"
              optionFilterProp="children"
              onChange={(val) => { this.onSelectSpecChange('rule', val); }}
            >
              {applyRules.map((item) => (
                <Select.Option value={item[applyKey]} key={item.name}>
                  <div>
                    <span className="optionsName" style={{ marginRight: 10, fontWeight: 600 }}>{item.name}</span>
                    <span>{`(${item.dirverCpu}C | ${_toFixed(item.dirverMem / 1024)}GB | (${item.executorCores}C | ${_toFixed(item.executorMemory / 1024)}GB) * ${item.executorNumber})`}</span>
                    { item.config ? Object.keys(JSON.parse(item.config || '')).map(key => {
                      return (
                        <span className="optionsConfig" style={{ paddingLeft: 20 }} key={key}>
                                {`${key} = ${JSON.parse(item.config || '')[key]}`}
                              </span>
                      );
                    }) : []}

                  </div>
                </Select.Option>
              ))}
            </Select>
          )
        }

      </Form.Item>
    )
  }


  render() {
    const ResourceType = this.state.resourceType;
    const { data, type, sliderConf = {}, config: resourceConfig, itemStyle = {}, sliderStyle, disabled } = this.props;
    const layout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };
    const labelColSpan = layout.labelCol.span;
    const wrapperColSpan = layout.wrapperCol.span;
    const sliderOffset = sliderConf.offset || sliderConf.offset == 0  ? sliderConf.offset : labelColSpan;
    let config = { ...resourceConfig };
    Object.keys(config).forEach(item => {
      config[item] = { ...config[item] } || {};
      if (item === 'mem' || item.endsWith('Memory')) {
        // eslint-disable-next-line operator-assignment
        config[item] = { max: config[item].max / 1024, min: config[item].min / 1024 };
      }
    });
    config = { cpu: {}, mem: {}, gpu: {}, driverCores: {}, driverMemory: {}, executorCores: {}, executorMemory: {}, executorNumber: {}, ...config };
    const { apply } = data;
    const itemBase = {
      // 单机slider组件
      sliderAloneBase: (currentForm) => (
        <React.Fragment>
          <Row>
            <Col key={'cpu'} span={sliderConf.span || wrapperColSpan} offset={sliderOffset}>
              <Form.Item
                key="cpu"
              >
                {
                  currentForm.getFieldDecorator('cpu', {
                  })(
                    <SliderResource disabled={disabled} max={config.cpu.max} min={config.cpu.min}  style={sliderStyle || itemStyle} title="CPU(Cores)" onChange={(val) => { this.onChange('cpu', val, currentForm); }} />
                  )
                }
              </Form.Item>
            </Col>
            <Col key={'mem'} span={sliderConf.span || wrapperColSpan} offset={sliderOffset}>
              <Form.Item
                key="mem"
              >
                {
                  currentForm.getFieldDecorator('mem', {

                  })(
                    <SliderResource disabled={disabled} max={config.mem.max} min={config.mem.min} style={sliderStyle || itemStyle} title="MEM(GB)" onChange={(val) => { this.onChange('mem', val, currentForm); }} />
                  )
                }
              </Form.Item>
            </Col>
            <Col key={'gpu'} span={sliderConf.span || wrapperColSpan} offset={sliderOffset}>
              <Form.Item
                key="gpu"

              >
                {
                  currentForm.getFieldDecorator('gpu', {
                  })(
                    <SliderResource disabled={disabled} max={config.gpu.max} min={config.gpu.min} style={sliderStyle || itemStyle} title="GPU(s)" onChange={(val) => { this.onChange('gpu', val, currentForm); }} />
                  )
                }
              </Form.Item>
            </Col>
          </Row>
        </React.Fragment>
      ),
      // 分布式 slider组件
      sliderDistBase: (currentForm) => (
        <React.Fragment>
          <Row>
            <Col key="driverCores" span={sliderConf.span || wrapperColSpan} offset={sliderConf.offset || labelColSpan}>
              <Form.Item
                key="driverCores"
              >
                {
                  currentForm.getFieldDecorator('driverCores', {

                  })(
                    <SliderResource disabled={disabled} max={config.driverCores.max} min={config.driverCores.min} style={sliderStyle || itemStyle} title="Driver CPU(Cores)" onChange={(e) => (this.onChange('driverCores', e, currentForm))} />
                  )
                }
              </Form.Item>
            </Col>
            <Col key="driverMemory" span={sliderConf.span || wrapperColSpan} offset={sliderConf.offset || labelColSpan}>
              <Form.Item
                key="driverMemory"
              >
                {
                  currentForm.getFieldDecorator('driverMemory', {

                  })(
                    <SliderResource disabled={disabled} max={config.driverMemory.max} min={config.driverMemory.min} style={sliderStyle || itemStyle} title="Driver内存(GB)" onChange={(e) => (this.onChange('driverMemory', e, currentForm))} />
                  )
                }
              </Form.Item>
            </Col>
            <Col key="executorCores" span={sliderConf.span || wrapperColSpan} offset={sliderConf.offset || labelColSpan}>
              <Form.Item
                key="executorCores"
              >
                {
                  currentForm.getFieldDecorator('executorCores', {

                  })(
                    <SliderResource disabled={disabled} max={config.executorCores.max} min={config.executorCores.min} style={sliderStyle || itemStyle} title="Executor CPU(Cores)" onChange={(e) => (this.onChange('executorCores', e, currentForm))} />
                  )
                }
              </Form.Item>
            </Col>
            <Col key="executorMemory" span={sliderConf.span || wrapperColSpan} offset={sliderConf.offset || labelColSpan}>
              <Form.Item
                key="executorMemory"
              >
                {
                  currentForm.getFieldDecorator('executorMemory', {

                  })(
                    <SliderResource disabled={disabled} max={config.executorMemory.max} min={config.executorMemory.min} style={sliderStyle || itemStyle} title="Executor内存(GB)" onChange={(e) => (this.onChange('executorMemory', e, currentForm))} />
                  )
                }
              </Form.Item>
            </Col>
            <Col key="executorNumber" span={sliderConf.span || wrapperColSpan} offset={sliderConf.offset || labelColSpan}>
              <Form.Item
                key="executorNumber"
              >
                {
                  currentForm.getFieldDecorator('executorNumber', {

                  })(
                    <SliderResource disabled={disabled} max={config.executorNumber.max} min={config.executorNumber.min} style={sliderStyle || itemStyle} title="Executor数量(s)" onChange={(e) => (this.onChange('executorNumber', e, currentForm))} />
                  )
                }
              </Form.Item>
            </Col>
          </Row>
        </React.Fragment>
      ),

    };

    let typesArr;
    switch (type) {
      case 'basic-slider-alone':
        typesArr = (currentForm) => ([
          itemBase.sliderAloneBase(currentForm),
          this.advancedFn(currentForm)
        ]);
        break;
      case 'basic-slider-dist':
        typesArr = (currentForm) => ([
          itemBase.sliderDistBase(currentForm),
          this.advancedFn(currentForm)
        ]);
        break;
      case 'slider-alone':
        typesArr = apply ? (currentForm) => {
          return [
            this.applyFn(currentForm),
            this.ruleFn(currentForm)
          ];
        } : (currentForm) => {
          return [
            this.applyFn(currentForm),
            itemBase.sliderAloneBase(currentForm),
            this.advancedFn(currentForm)
          ];
        };
        break;
      case 'slider-dist':
        typesArr = apply ? (currentForm) => {
          return [
            this.runModelFn(currentForm),
            this.applyFn(currentForm),
            this.ruleFn(currentForm)
          ];
        } : (currentForm) => {
          return [
            this.runModelFn(currentForm),
            this.applyFn(currentForm),
            itemBase.sliderDistBase(currentForm),
            this.advancedFn(currentForm)
          ];
        };
        break;
      default: {
        return [];
      }
    }

    if (!ResourceType) {
      return <React.Fragment></React.Fragment>;
    }
    return <ResourceType style={styles.resourceConfig} {...this.props} itemProps={typesArr} layout={layout} />;
  }
}

