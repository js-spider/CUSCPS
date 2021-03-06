import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Input } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

export default class CPSearch extends React.Component {
  static defaultProps = {
    onSearch: () => {},
    onChange: () => {},
    // width: 190,
    allowClear: true,
    className: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || props.defaultValue || '',
    };
    this.timer = null;
  }

  onSearchClick = (e) => {
    const value = e.target && e.target.value;
    const { onSearch } = this.props;
    onSearch(value);
  }

  onIconClick = () => {
    const { onSearch } = this.props;
    onSearch(this.state.value);
  }

  onKeyChange = (e) => {
    const value = e.target && e.target.value;
    const { onChange } = this.props;
    this.setState({
      value,
    });

    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      onChange(value);
    }, 500);
  }

  clearSelection = () => {
    const { onChange } = this.props;
    const value = '';
    this.setState({
      value: '',
    });
    if (onChange) {
      onChange(value);
    }
  }

  render() {
    const { value } = this.state;
    const { style, allowClear, onSearch, onChange, className, ...restProps } = this.props;
    const clearIcon = allowClear && value.length > 0 ? (
      <span>
        <Icon onClick={this.clearSelection} type="close" className={styles.clearIcon} />
        <Icon className={styles.iconSearch} type="search" onClick={this.onIconClick} />
      </span>) : <Icon className={styles.iconSearch} type="search" onClick={this.onIconClick} />;
    const rootClass = classNames(styles.zetSearch, className);
    return (
      <div className={rootClass} style={{ width: 320, ...style }}>
        <Input
          {...restProps}
          className={styles.zetSearchInput}
          style={style}
          onChange={this.onKeyChange}
          onPressEnter={this.onSearchClick}
          suffix={clearIcon}
          value={value}
        />
      </div>
    );
  }
}

CPSearch.propTypes = {
  // width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSearch: PropTypes.func,
  onChange: PropTypes.func,
  allowClear: PropTypes.bool,
  className: PropTypes.string,
};

