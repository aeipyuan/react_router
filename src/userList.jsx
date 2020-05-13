import React, { Component } from 'react'
import { Link, Route } from './react-router-dom'
export default class UserList extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <div>
                <Link to="/user/detail/1/Amy">  Amy  </Link>
                <Link to="/user/detail/2/Mike">  Mike  </Link>
                <Link to="/user/detail/3/Nancy">  Nancy  </Link>
            </div>
        )
    }
}
