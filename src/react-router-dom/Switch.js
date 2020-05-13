import React from 'react'
import { Consumer } from './context'
import { pathToRegexp } from 'path-to-regexp'
export default class Switch extends React.Component {
    render() {
        return (<Consumer>
            {state => {
                let { pathname } = state.location;
                /* 遍历子元素，找出符合条件的进行渲染然后返回 */
                for (let child of this.props.children) {
                    /* 比对 */
                    let path = child.props.path || '';
                    let exac = child.props.exac || false;
                    let reg = pathToRegexp(path, [], { end: exac });
                    if (reg.test(pathname)) return child;
                }
                return null;
            }}
        </Consumer>)
    }
}