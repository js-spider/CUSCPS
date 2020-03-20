import React from "react";
import { Form } from 'antd';


export  class ResourceBasic extends React.Component{
  constructor(props) {
    super(props);
  }
  render(){
    const { itemProps,form } = this.props;
    const items = itemProps(form)
    return (
      <React.Fragment>
        {items}
      </React.Fragment>
    )
  }
};
export class ResourceFormBasic extends React.Component{
  constructor(props) {
    super(props);
  }
  render(){
    const { itemProps,form,layout } = this.props;
    const items = itemProps(form)
    return (
      <Form {...layout} name={'ResourceFormBasic'}>
        {items}
      </Form>
    )
  }
};
