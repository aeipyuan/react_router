import React, { Component } from 'react'
import userAdd from './userAdd'
import userList from './userList'
import userDetail from './userDetail'
import { Link, Route } from './react-router-dom'
export default class User extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <div>
                    <Link to="/user/add"> 用户添加 </Link>
                    <Link to="/user/list"> 用户列表 </Link>
                    <hr />
                </div>
                <div>
                    <Route path="/user/add" component={userAdd}></Route>
                    <Route path="/user/list" component={userList}></Route>
                    <Route path="/user/detail/:id/:name" component={userDetail}></Route>
                </div>
            </div>
        )
    }
}
