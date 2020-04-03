import React from 'react';
import { Dropdown, Button, Table, Icon } from 'antd';
import { CPInput, Ellipsis } from '../index';
import styles from './index.less';


const { CPSearch: Search } = CPInput;
export default class SelectTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      visible: false,
      sorter: {},
    };
  }

  search = (val) => {
    this.onChange('search', val);
  }

  changeSelectedRow = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRows,
    });
    this.onChange('selectedRow', selectedRows);
  };

  onTableChange = (pagination, filters, sorter) => {
    const record = { pagination, filters, sorter };
    this.setState({
      sorter,
    });
    this.onChange('tableChange', record);
  }

  onChange = (key, record) => {
    const { onChange } = this.props;
    onChange && onChange(key, record);
  }

  onVisibleChange = (visible) => {
    this.setState({
      visible,
    });
  }

  getContent = () => {
    const { selectedRows } = this.state;
    const { tableConfig: { nameKey = 'name' } } = this.props;
    if (selectedRows.length > 0) {
      return selectedRows[0][nameKey];
    }
    return '';
  };

  getSearchComp = () => {
    const { search = true } = this.props;
    return search && (
      <Search
        style={{ width: '100%', marginBottom: 5 }}
        onChange={this.search}
        onSearch={this.search}
        placeholder=""
        data-tag='input_search'
      />
    );
  }

  formatTableColumns = (columns = []) => {
    const { sorter } = this.state;
    return columns.map(item => {
      const newItem = { ...item };
      if (item.ellipsis) {
        newItem.render = (text) => {
          return <Ellipsis value={text} max={item.ellipsis} />;
        };
      }
      if (item.sorter === true) {
        newItem.sortOrder = sorter.field === item.dataIndex ? sorter.order : false;
      }
      return newItem;
    });
  }

  getTableComp =() => {
    const { selectedRows } = this.state;
    const { tableConfig } = this.props;
    const { columns, dataSource, pagination = {}, rowSelectionConfig = {}, idKey = 'id' } = tableConfig;
    const formatCol = this.formatTableColumns(columns);
    const pg = pagination && { size: 'small', pageSize: 10, ...pagination };
    return (
      <Table
        columns={formatCol}
        dataSource={dataSource}
        pagination={pg}
        rowKey={(record) => { return record[idKey]; }}
        onRow={(record) => {
          return {
            onClick: () => this.changeSelectedRow('', [record]),
          };
        }}
        rowSelection={{
          type: 'radio',
          columnWidth: 35,
          selectedRowKeys: selectedRows.map((v) => { return v[idKey]; }),
          onChange: this.changeSelectedRow,
          ...rowSelectionConfig,
        }}
        scroll={{ y: 250 }}
        onChange={this.onTableChange}
        data-tag='table_imagesList'
      />
    );
  }

  render() {
    const { visible } = this.state;
    const { width } = this.props;
    return (
      <React.Fragment>
        <Dropdown
          placement="bottomLeft"
          trigger={['click']}
          overlay={(
            <div className={styles.tableContainer}>
              {this.getSearchComp()}
              {this.getTableComp()}
            </div>
          )}
          visible={visible}
          className={styles.TableSelect}
          onVisibleChange={this.onVisibleChange}
        >
          <Button
            style={{ width }}
            data-tag='analysis-selectImage-down'
            className={styles.buttonSel}
          >
            <span>{this.getContent()}</span>
            <Icon type="down" className={styles.Icon} />
          </Button>
        </Dropdown>
      </React.Fragment>
    );
  }
}
