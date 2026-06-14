import React from 'react';
import ReactDOM from 'react-dom';

const CssComponent = () => {
  // 定义内联样式对象
  const containerStyle = {
    padding: '20px',
    backgroundColor: '#f0f0f0'
  };

  const titleStyle = {
    fontSize: '24px',
    color: '#333'
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Hello, world!</h1>
    </div>
  );
};

export default CssComponent;
