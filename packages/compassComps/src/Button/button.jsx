import React from 'react';
import Pt from "prop-types";


export default class Button extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    return (
      <div> 测试 </div>
    )
  }
}

Button.propTypes =  {
  /** 组件类型 */
  type: Pt.oneOf(['basic-alone', 'basic-dis', 'alone', 'distributed', 'basic-slider-alone', 'basic-slider-dist', 'slider-alone', 'slider-dist']),

  /** 输入框的配置说明 设置输入框的最大限额 */
  config: Pt.object,

  /** 输入框data */
  data: Pt.object,

  /** 禁用 */
  disabled: Pt.bool,

  /** 启用引用规则时 规格列表 */
  applyRules: Pt.array,

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
