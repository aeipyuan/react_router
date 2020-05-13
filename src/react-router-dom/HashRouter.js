import React from 'react'
import { Provider } from './context'

export default class HashRouter extends React.Component {
    constructor() {
        super();
        this.state = {
            location: {
                pathname: window.location.hash.slice(1) || '/'
            }
        }
    }
    /* 挂载组件完成时绑定hashchange事件 */
    componentDidMount() {
        window.location.hash = window.location.hash || '/'
        window.addEventListener('hashchange', () => {
            this.setState({
                location: {
                    ...this.state.location,
                    pathname: window.location.hash.slice(1) || '/'
                }
            })
        })
    }
    render() {
        /* 要传给Consumer使用的数据 */
        let value = {
            location: this.state.location,
            history: {
                push(to) {
                    window.location.hash = to;
                }
            }
        }
        return (<Provider value={{ ...value }}>
            {this.props.children}
        </Provider>)
    }
}