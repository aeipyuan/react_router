import React from 'react'
import { Consumer } from './context'
import { pathToRegexp } from 'path-to-regexp'
export default class Route extends React.Component {
    render() {
        return (<Consumer>
            {state => {
                /* 浏览器路径 */
                let { pathname } = state.location;/* /home */
                /* 获取Route的路径和组件,以及是否精确匹配 */
                //{path: "/home", component: ƒ, exac:true}
                let { path, component: Component, exac = false } = this.props;
                /* 比对路径 end为true时为严格模式时*/
                let keys = [];
                // console.log(path)
                let reg = pathToRegexp(path, keys, { end: exac });
                keys = keys.map(v => v.name);//['id','name']
                let [url, ...values] = pathname.match(reg) || [];
                // console.log(keys)
                // console.log(values);
                /* 设置传给子节点的数据 */
                let props = {
                    ...state,
                    match: {
                        params: keys.reduce((data, item, idx) => {
                            data[item] = values[idx];
                            return data;
                        }, {})
                    }
                }
                return reg.test(pathname) ? <Component {...props} /> : null;
            }}
        </Consumer>)
    }
}