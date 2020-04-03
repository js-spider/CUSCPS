import React, { Component } from 'react';
import { Tooltip } from 'antd';

export default class Ellipsis extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  computeLine = (str) => {
    return str.replace(/[^\x00-\xff]/g, '01').length;
  };

  formatStr = (str, max) => {
    const valueLength = this.computeLine(str);
    const _max = Number.isInteger(max) ? max : 16;
    const showEllipsis = valueLength > _max;
    if (showEllipsis) {
      let i = 0;
      let subStr = '';
      str.split('').forEach(item => {
        if (i === _max || i > _max) return;
        if (item.match(/[^\x00-\xff]/ig)) {
          i += 2;
        } else {
          i += 1;
        }
        subStr += item;
      });
      return `${subStr}...`;
    }
    return str;
  }

  render() {
    const { value = '', max = 16 } = this.props;
    return (
      <React.Fragment>
        <Tooltip title={value}>
          <span>{this.formatStr(value, max)}</span>
        </Tooltip>
      </React.Fragment>
    );
  }
}
