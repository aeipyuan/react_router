import React from 'react'
import { Consumer } from './context'
export default class Link extends React.Component {
    render() {
        return (<Consumer>
            {state => {
                /* 调用state的push函数，强制跳转 */
                return <a onClick={() => {
                    state.history.push(this.props.to)
                }}>{this.props.children}</a>
            }}
        </Consumer>)
    }
}