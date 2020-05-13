import React, { Component } from 'react'
import { Link } from './react-router-dom'
export default class UserList extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <div>
                Detail
                <div>id: {this.props.match.params.id}</div>
                <div>name：{this.props.match.params.name}</div>
            </div>
        )
    }
}
