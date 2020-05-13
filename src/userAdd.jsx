import React, { Component } from 'react'
import { render } from 'react-dom'

export default class UserAdd extends Component {
    constructor(props) {
        super(props);
        this.text = React.createRef();
    }
    handleSubmit = (e) => {
        e.preventDefault();
        console.log(this.text.current.value);
        this.props.history.push('/user/list');
    }
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="text" ref={this.text} />
                <button type="submit">提交</button>
            </form>
        )
    }
}
