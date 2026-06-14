import React from 'react';

interface ParentState {
  message: string;
}

class ParentComponent extends React.Component<{}, ParentState> {
  constructor(props: {}) {
    super(props);
    this.state = { message: '' };
  }

  handleMessage = (msg: any) => {
    this.setState({ message: msg });
  };

  render() {
    return (
      <div>
        <ChildComponent onMessage={this.handleMessage} />
        <p>Message from Child: {this.state.message}</p>
      </div>
    );
  }
}

const ChildComponent = (props: { onMessage: (arg0: string) => void; }) => {
  const sendMessage = () => {
    props.onMessage('Hello from Child!');
  };

  return (
    <div>
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
};

// ReactDOM.render(<ParentComponent />, document.getElementById('root'));

export default ParentComponent;