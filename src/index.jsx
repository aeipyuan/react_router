import React, { Component } from 'react'
import ReactDom from 'react-dom'
import { HashRouter as Router, Route, Link, Redirect, Switch } from './react-router-dom'
import Home from './home'
import Profile from './profile'
import User from './user'
export default class App extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Router>
                <div>
                    <Link to="/home"> 主页 </Link>
                    <Link to="/profile/1"> 个人中心 </Link>
                    <Link to="/user"> 用户 </Link>
                    <hr />
                </div>
                <Switch>
                    <Route exac path="/home" component={Home}></Route>
                    <Route path="/profile" component={Profile}></Route>
                    <Route path="/user" component={User}></Route>
                    <Redirect to="/404"></Redirect>
                </Switch>
            </Router>
        )
    }
}

ReactDom.render(<App />, window.root)