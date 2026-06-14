import React from 'react';
import ReactDOM from 'react-dom/client';
import PropTypes from 'prop-types';

class MyComponent extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired, // 必须是字符串且必需
    age: PropTypes.number,              // 可选的数字
    isAdmin: PropTypes.bool,            // 可选的布尔值
    user: PropTypes.shape({             // 必须是具有特定形状的对象
      name: PropTypes.string,
      email: PropTypes.string
    }),
    items: PropTypes.arrayOf(PropTypes.string), // 必须是字符串数组
    callback: PropTypes.func,           // 可选的函数
    children: PropTypes.node,           // 可选的可以渲染的内容
    options: PropTypes.oneOf(['option1', 'option2']), // 必须是特定值之一
  };

  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        {this.props.age && <p>Age: {this.props.age}</p>}
        {this.props.isAdmin && <p>Admin</p>}
        {this.props.user && (
          <div>
            <p>Name: {this.props.user.name}</p>
            <p>Email: {this.props.user.email}</p>
          </div>
        )}
        {this.props.items && (
          <ul>
            {this.props.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
        {this.props.callback && (
          <button onClick={this.props.callback}>Click me</button>
        )}
        {this.props.children}
        {this.props.options && <p>Option: {this.props.options}</p>}
      </div>
    );
  }
}

function PropTypesDemo() {
    return <MyComponent 
    title="Hello, World!"
    age={30}
    isAdmin={true}
    user={{ name: "John Doe", email: "john@example.com" }}
    items={['Item 1', 'Item 2', 'Item 3']}
    callback={() => alert('Button clicked!')}
    options="option1"
  >
    <p>This is a child element</p>
  </MyComponent>
}

export default PropTypesDemo;