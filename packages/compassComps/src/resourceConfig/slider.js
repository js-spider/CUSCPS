import * as React from 'react';
import { InputNumber, Slider, Row, Col } from 'antd';

class SliderResource extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onChange = (value) => {
    this.props.onChange(value);
  }

  render() {
    const { style, title = '', width, step, max = 100, min = 0, disabled, sliderProps, inputNumberProps, value } = this.props;
    const styleProps = {
      width,
      ...style,
    };
    const titleContent = title.substring(0, title.indexOf('('));
    const titleUnit = title.substring(title.indexOf('('), title.length);
    return (
      <div style={styleProps}>
        <Row>
          <Col span={12}>
            <span style={{ display: 'inline-block', marginRight: 5, color: 'red' }}>*</span>
            <span style={{ color: '#10263A' }}>{titleContent}</span>
            <span style={{ display: 'inline-block', marginLeft: 5, fontSize: 12, color: '#10263A', opacity: 0.5 }}>{titleUnit}</span>
          </Col>
          <Col
            span={12}
            style={{
              textAlign: 'right',
              paddingRight: 3,
              // marginRight: 5,
            }}
          >
            <InputNumber
              size='small'
              onChange={this.onChange}
              value={value}
              step={step}
              max={max}
              min={min}
              disabled={disabled}
              style={{
                width: 70,
              }}
              {...inputNumberProps}
            />
          </Col>
        </Row>
        <Slider
          className='zet-resource-slider'
          onChange={this.onChange}
          value={Math.round(value)}
          step={step}
          max={max}
          min={min}
          disabled={disabled}
          marks={{ [min]: min.toString(), [max]: max.toString() }}
          {...sliderProps}
        />
      </div>
    );
  }
}

export default SliderResource;
