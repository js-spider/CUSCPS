import React from 'react';
import Pt from 'prop-types';
import { Form, Input, Tooltip, Icon, Switch, Select, Row, Col } from 'antd';
import SliderResource from './slider';

const _toFixed = (data = 0, num = 3) => {
  let n2s = Number(data).toFixed(num);
  if (n2s.split('.')[1] === '000') n2s = n2s.split('.')[0];
  return n2s;
};

const _formatValue = (key, config, value) => {
  if (value || value === 0) {
    const val = [config[key].min, value, config[key].max].sort((a, b) => a - b)[1];
    return {
      value: val,
      error: val !== value,
    };
  }
  return {
    value: config[key].min,
  };
};

const _getFormField = (key, config, value, formatObj) => {
  const field = {};
  if (key === 'mem' || key.endsWith('Memory')) {
    field.value = _toFixed(formatObj.value / 1024);
    field.errors = formatObj.error
      ? `[${config[key].min / 1024}~${config[key].max / 1024}] : ${value / 1024} 值异常已调整为:${
        field.value
      }`
      : null;
  } else {
    field.value = formatObj.value;
    field.errors = formatObj.error
      ? `[${config[key].min}~${config[key].max}] : ${value} 值异常已调整为:${field.value}`
      : null;
  }
  return field;
};

const createForm = component => {
  return Form.create({
    mapPropsToFields(props) {
      const { data, config } = props;
      const fields = {
        apply: Form.createFormField({ value: data.apply }),
      };
      if (data.model) {
        console.log('model [ index.js/mapPropsToFields/45 ]  >>', data.model);
        fields.model = Form.createFormField({ value: data.model });
      }
      if (data.apply) {
        fields.rule = Form.createFormField({ value: data.value.id });
      }
      Object.keys(config).forEach(key => {
        const dataValue = data.value[key];
        const field = _getFormField(key, config, dataValue, _formatValue(key, config, dataValue));
        fields[key] = Form.createFormField({ value: field.value });
      });
      return fields;
    },
  })(component);
};

const applyKey = 'id';
const emptyFn = () => {};

class Resource extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.timer = null;
    this.fields = {};
  }

  componentDidMount() {
    const { data, config, onChange } = this.props;
    const newData = { ...data, value: { ...data.value } };
    config
      && Object.keys(config).forEach(key => {
        const formatObj = _formatValue(key, config, newData.value[key]);
        const field = _getFormField(key, config, newData.value[key], formatObj);
        newData.value[key] = formatObj.value;
        if (field.errors) {
          this.fields[key] = field.errors;
        }
      });
    onChange('validate', { value: newData.value }, { ...newData });
  }

  componentWillUnmount() {
    this.timer = null;
    this.resourceType = null;
  }

  onChange = (key, e) => {
    const { data, onChange, config, form } = this.props;
    let val = e && e.currentTarget ? e.currentTarget.value : e;
    if (key === 'mem' || key.endsWith('Memory')) {
      val *= 1024;
    } else if (key === 'executorNumber') {
      val = Math.floor(val);
    }
    if (!_formatValue(key, config, val).error) {
      delete this.fields[key];
    }
    form.setFieldsValue({ [key]: _toFixed(val) });
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      clearTimeout(this.timer);
      this.timer = null;
      onChange(key, { [key]: val }, { ...data, value: { ...data.value, [key]: _toFixed(val) } });
    }, 400);
  };

  onSwitchChange = (key, val) => {
    const { data, onChange } = this.props;
    const changeData = { [key]: val };
    onChange && onChange(key, changeData, { ...data, ...changeData, value: {} });
  };

  onSelectSpecChange = (key, val) => {
    const { applyRules, onChange, data } = this.props;
    if (onChange) {
      const value = applyRules.filter(item => item[applyKey] === val)[0] || {};
      const allData = { ...data, value: { ...value } };
      allData[key] = val;
      onChange(key, { [key]: val }, allData);
    }
  };

  onSelectModelChange = (key, val) => {
    const { data, onChange } = this.props;
    const allData = { ...data, model: val };
    onChange && onChange(key, { [key]: val }, allData);
  };

  runModelFn = (show) => {
    const { runModel, itemStyle, form } = this.props;
    return runModel || show ? (
      <Form.Item key="model" label="运行模式">
        {form.getFieldDecorator('model', {
          initialValue: 'AUTO',
        })(
          <Select
            style={itemStyle}
            placeholder="Select model"
            optionFilterProp="children"
            onChange={val => {
              this.onSelectModelChange('model', val);
            }}
          >
            <Select.Option key="AUTO" value="AUTO">
              智能加速模式
            </Select.Option>
            <Select.Option key="JOB" value="JOB">
              经济模式
            </Select.Option>
            <Select.Option key="BLOCK" value="BLOCK">
              稳健模式
            </Select.Option>
          </Select>,
        )}
      </Form.Item>
    ) : null;
  };

  applyFn = () => {
    const { form } = this.props;
    return (
      <Form.Item
        key="apply"
        label={
          <span>
            应用规格
            <Tooltip title="规格格式为: DriverCPU核数 | Driver内存| Executor CPU核数| Executor内存|Executor数量">
              <Icon type="info-circle" style={{ margin: '0px 5px' }} />
            </Tooltip>
          </span>
        }
      >
        {form.getFieldDecorator('apply', {
          valuePropName: 'checked',
        })(
          <Switch
            checkedChildren="是"
            unCheckedChildren="否"
            onChange={val => {
              this.onSwitchChange('apply', val);
            }}
          />,
        )}
      </Form.Item>
    );
  };

  advancedFn = (show) => {
    const { itemStyle, advanced, form } = this.props;
    return advanced || show ? (
      <Form.Item
        key="advanced"
        label={
          <span>
            高级配置
            <Tooltip title="配置SparkConf">
              <Icon type="info-circle" style={{ margin: '0px 5px' }} />
            </Tooltip>
          </span>
        }
      >
        {form.getFieldDecorator('advanced', {})(
          <Input.TextArea
            rows={4}
            style={itemStyle}
            onChange={e => this.onChange('advanced', e)}
          />,
        )}
      </Form.Item>
    ) : null;
  };

  ruleFn = () => {
    const { itemStyle, applyRules, form } = this.props;
    return (
      <Form.Item key="rule" label="选择规格">
        {form.getFieldDecorator('rule', {
          initialValue: '',
        })(
          <Select
            style={itemStyle}
            placeholder="Select a person"
            optionFilterProp="children"
            onChange={val => {
              this.onSelectSpecChange('rule', val);
            }}
          >
            {applyRules.map(item => (
              <Select.Option value={item[applyKey]} key={item.name}>
                <div>
                  <span className="optionsName" style={{ marginRight: 10, fontWeight: 600 }}>
                    {item.name}
                  </span>
                  <span>{`(${item.dirverCpu}C | ${_toFixed(item.dirverMem / 1024)}GB | (${
                    item.executorCores
                  }C | ${_toFixed(item.executorMemory / 1024)}GB) * ${item.executorNumber})`}
                  </span>
                  {item.config
                    ? Object.keys(JSON.parse(item.config || '')).map(key => {
                      return (
                        <span className="optionsConfig" style={{ paddingLeft: 20 }} key={key}>
                          {`${key} = ${JSON.parse(item.config || '')[key]}`}
                        </span>
                      );
                    })
                    : []}
                </div>
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
    );
  };

  errorSpan = key => {
    if (this.fields[key]) {
      return (
        <span
          style={{
            color: 'red',
            position: 'absolute',
            display: 'inline-block',
            minWidth: 240,
            top: 86,
          }}
        >
          {this.fields[key]}
        </span>
      );
    }
  };

  render() {
    const {
      data,
      type,
      sliderConf = {},
      config: resourceConfig,
      itemStyle = {},
      sliderStyle,
      disabled,
      form,
    } = this.props;
    if (data.value === undefined || !this.props.config) return <React.Fragment />;
    const layout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };
    const labelColSpan = layout.labelCol.span;
    const wrapperColSpan = layout.wrapperCol.span;
    const sliderOffset = sliderConf.offset || sliderConf.offset === 0 ? sliderConf.offset : labelColSpan;
    let config = { ...resourceConfig };
    Object.keys(config).forEach(item => {
      config[item] = { ...config[item] } || {};
      if (item === 'mem' || item.endsWith('Memory')) {
        config[item] = { max: config[item].max / 1024, min: config[item].min / 1024 };
      }
    });
    config = {
      cpus: {},
      mem: {},
      gpus: {},
      driverCores: {},
      driverMemory: {},
      executorCores: {},
      executorMemory: {},
      executorNumber: {},
      ...config,
    };
    const { apply } = data;
    const itemBase = {
      // 单机slider组件
      sliderAloneBase: (
        <React.Fragment>
          <Row>
            <Col key="cpus" span={sliderConf.span || wrapperColSpan} offset={sliderOffset}>
              <Form.Item key="cpus">
                {form.getFieldDecorator('cpus', {})(
                  <SliderResource
                    disabled={disabled}
                    max={config.cpus.max}
                    min={config.cpus.min}
                    style={sliderStyle || itemStyle}
                    titleConf={sliderConf.title}
                    title="CPU(Cores)"
                    onChange={val => {
                      this.onChange('cpus', val);
                    }}
                  />,
                )}
                {this.errorSpan('cpus')}
              </Form.Item>
            </Col>
            <Col key="mem" span={sliderConf.span || wrapperColSpan} offset={sliderOffset}>
              <Form.Item key="mem">
                {form.getFieldDecorator('mem', {})(
                  <SliderResource
                    disabled={disabled}
                    max={config.mem.max}
                    min={config.mem.min}
                    style={sliderStyle || itemStyle}
                    titleConf={sliderConf.title}
                    title="MEM(GB)"
                    onChange={val => {
                      this.onChange('mem', val);
                    }}
                  />,
                )}
                {this.errorSpan('mem')}
              </Form.Item>
            </Col>
            <Col key="gpus" span={sliderConf.span || wrapperColSpan} offset={sliderOffset}>
              <Form.Item key="gpus">
                {form.getFieldDecorator('gpus', {})(
                  <SliderResource
                    disabled={disabled}
                    max={config.gpus.max}
                    min={config.gpus.min}
                    style={sliderStyle || itemStyle}
                    titleConf={sliderConf.title}
                    title="GPU(s)"
                    onChange={val => {
                      this.onChange('gpus', val);
                    }}
                  />,
                )}
                {this.errorSpan('gpus')}
              </Form.Item>
            </Col>
          </Row>
        </React.Fragment>
      ),
      // 分布式 slider组件
      sliderDistBase: (
        <React.Fragment>
          <Row>
            <Col
              key="driverCores"
              span={sliderConf.span || wrapperColSpan}
              offset={sliderConf.offset}
            >
              <Form.Item key="driverCores">
                {form.getFieldDecorator('driverCores', {})(
                  <SliderResource
                    disabled={disabled}
                    max={config.driverCores.max}
                    min={config.driverCores.min}
                    style={sliderStyle || itemStyle}
                    titleConf={sliderConf.title}
                    title="Driver CPU(Cores)"
                    onChange={e => this.onChange('driverCores', e)}
                  />,
                )}
                {this.errorSpan('driverCores')}
              </Form.Item>
            </Col>
            <Col
              key="driverMemory"
              span={sliderConf.span || wrapperColSpan}
              offset={sliderConf.offset}
            >
              <Form.Item key="driverMemory">
                {form.getFieldDecorator('driverMemory', {})(
                  <SliderResource
                    disabled={disabled}
                    max={config.driverMemory.max}
                    min={config.driverMemory.min}
                    style={sliderStyle || itemStyle}
                    titleConf={sliderConf.title}
                    title="Driver内存(GB)"
                    onChange={e => this.onChange('driverMemory', e)}
                  />,
                )}
                {this.errorSpan('driverMemory')}
              </Form.Item>
            </Col>
            <Col
              key="executorCores"
              span={sliderConf.span || wrapperColSpan}
              offset={sliderConf.offset}
            >
              <Form.Item key="executorCores">
                {form.getFieldDecorator('executorCores', {})(
                  <SliderResource
                    disabled={disabled}
                    max={config.executorCores.max}
                    min={config.executorCores.min}
                    style={sliderStyle || itemStyle}
                    titleConf={sliderConf.title}
                    title="Executor CPU(Cores)"
                    onChange={e => this.onChange('executorCores', e)}
                  />,
                )}
                {this.errorSpan('executorCores')}
              </Form.Item>
            </Col>
            <Col
              key="executorMemory"
              span={sliderConf.span || wrapperColSpan}
              offset={sliderConf.offset}
            >
              <Form.Item key="executorMemory">
                {form.getFieldDecorator('executorMemory', {})(
                  <SliderResource
                    disabled={disabled}
                    max={config.executorMemory.max}
                    min={config.executorMemory.min}
                    style={sliderStyle || itemStyle}
                    titleConf={sliderConf.title}
                    title="Executor内存(GB)"
                    onChange={e => this.onChange('executorMemory', e)}
                  />,
                )}
                {this.errorSpan('executorMemory')}
              </Form.Item>
            </Col>
            <Col
              key="executorNumber"
              span={sliderConf.span || wrapperColSpan}
              offset={sliderConf.offset}
            >
              <Form.Item key="executorNumber">
                {form.getFieldDecorator('executorNumber', {})(
                  <SliderResource
                    disabled={disabled}
                    max={config.executorNumber.max}
                    min={config.executorNumber.min}
                    style={sliderStyle || itemStyle}
                    titleConf={sliderConf.title}
                    title="Executor数量(s)"
                    onChange={e => this.onChange('executorNumber', e)}
                  />,
                )}
                {this.errorSpan('executorNumber')}
              </Form.Item>
            </Col>
          </Row>
        </React.Fragment>
      ),
    };

    let typesArr;
    switch (type) {
      case 'basic-alone':
        typesArr = () => [itemBase.sliderAloneBase, this.advancedFn()];
        break;
      case 'basic-dist':
        typesArr = () => [
          this.runModelFn(),
          itemBase.sliderDistBase,
          this.advancedFn(),
        ];
        break;
      case 'alone':
        typesArr = apply
          ? () => {
            return [this.applyFn(), this.ruleFn()];
          }
          : () => {
            return [
              this.applyFn(),
              itemBase.sliderAloneBase,
              this.advancedFn(true),
            ];
          };
        break;
      case 'dist':
        typesArr = apply
          ? () => {
            return [
              this.runModelFn(true),
              this.applyFn(),
              this.ruleFn(),
            ];
          }
          : () => {
            return [
              this.runModelFn(true),
              this.applyFn(),
              itemBase.sliderDistBase,
              this.advancedFn(true),
            ];
          };
        break;
      default: {
        return [];
      }
    }
    return <Form {...layout}>{typesArr(form)}</Form>;
  }
}

export default class ResourceParent extends React.Component {
  static propTypes = {
    /** 组件类型 */
    type: Pt.oneOf(['basic-alone', 'basic-dist', 'alone', 'dist']),

    // model: Pt.oneOf(['AUTO', 'JOB', 'BLOCK']),

    /** 输入框的配置说明 设置输入框的最大限额 */
    config: Pt.object,

    /** 输入框data */
    data: Pt.object,

    /** 禁用 */
    disabled: Pt.bool,

    /** 启用引用规则时 规格列表 */
    applyRules: Pt.array,

    /** 启用运行模式 */
    runModel: Pt.bool,

    /** 启用高级配置 */
    advanced: Pt.bool,

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
    runModel: false,
    advanced: false,
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
    const { form } = this.props;
    this.state = {
      ResourceCom: form ? Resource : createForm(Resource),
    };
  }

  componentDidMount() {}

  render() {
    const { ResourceCom } = this.state;
    return <ResourceCom {...this.props} />;
  }
}
