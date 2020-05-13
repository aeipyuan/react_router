import React from 'react'
import { Consumer } from './context'
export default class Switch extends React.Component {
    render() {
        return (<Consumer>
            {state => {
                // 直接强行改变hash
                state.history.push(this.props.to);
                return null;
            }}
        </Consumer>)
    }
}