# react-router理解

### 1.  Provider和Consumer
`Provider`和`Comsume`r是`React`提供的两个原生组件，`Provider`的`value`属性传递数据，`Provider`包裹内的所有`Consumer`都可以直接获取到`Provider`的数据

获取方法

```javascript
let { Provider, Consumer } = React.createContext();
```

使用方法

```javascript
<Provider value={{ name: "aeipyuan" }}>
    <div>
        <div>
            <Consumer>{state => {
                console.log(state)
                return <div>{state.name}</div>
            }}</Consumer>
        </div>
    </div>
</Provider>
```

### 2. HashRouter 和 Route

根据`hash`改变组件的步骤
- `HashRouter`绑定`hashchange`事件，每次发生都会触发`setState`,并记录新的`hash`
- 数据改变触发`render`函数，`render`一个`Provider`，并且将新数据(`pathname`)放到`Provider`的`value`属性上
- Router作为`Router`的子组件，也会重新执行`render`，此时通过`Consumer`接受`Provider`提供的数据，并且比对`Route`自身传递的`path`属性和`state`里面的`pathname`,如果符合条件则返回`Route`属性传入的`Component`进行渲染，否则返回`null`不渲染

```javascript
/* index.jsx */
<Router>
    <Route path="/home" component={Home}></Route>
    <Route path="/profile" component={Profile}></Route>
    <Route path="/user" component={User}></Route>
</Router>
/* HashRouter.js */
export default class HashRouter extends React.Component {
    constructor() {
        super();
        this.state = {
            location: {/* slice去除＃ */
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
        /* 要传给Route使用的值 */
        let value = {
            location: this.state.location
        }
        return (<Provider value={{ ...value }}>
            {this.props.children}
        </Provider>)
    }
}
/* Route.js */
export default class Route extends React.Component {
    render() {
        return (<Consumer>
            {state => {
                /* 浏览器路径 */
                let pathname = state.location.pathname;/* /home */
                /* 获取Route的路径和组件,以及是否精确匹配 */
                //{path: "/home", component: ƒ, exac:true}
                let { path, component: Component, exac = false } = this.props;
                /* 比对路径 end为true时为严格模式时*/
                let reg = pathToRegexp(path, [], { end: exac });
                /* 通过属性把Provider的数据继续传给子组件 */
                return reg.test(pathname) ? <Component {...state}/> : null;
            }}
        </Consumer>)
    }
}
```
### 3. Link
```javascript
/* index.jsx */
<div>
    <Link to="/home"> 主页 </Link>
    <Link to="/profile"> 个人中心 </Link>
    <Link to="/user"> 用户 </Link>
</div>
```
实现步骤
- 扩充`HashRender`通过`Provider`传递的方法，增加`push`方法强制改变`hash`
```javascript
/* 要传给Consumer使用的数据 */
let value = {
    location: this.state.location,
    history: {
        push(to) {
            window.location.hash = to;
        }
    }
}
```
- `Link`组件插入一个`Consumer`,返回值是一个`a`标签，点击触发`HashRender`提供的`push`方法
```javascript
return (<Consumer>
    {state => {
        /* 调用state的push函数，强制跳转 */
        return <a onClick={() => {
            state.history.push(this.props.to)
        }}>{this.props.children}</a>
    }}
</Consumer>)
```
### 4. Switch
```javascript
<Switch>
    <Route path="/home" component={Home}></Route>
    <Route path="/home" component={Home}></Route>
    <Route path="/profile" component={Profile}></Route>
    <Route path="/user" component={User}></Route>
</Switch>
```
`Switch`实现每次只匹配一个组件的效果
- 利用`Consumer`获取浏览器`hash`值
- 遍历孩子，遇到符合条件的直接停止遍历，不处理后面的子元素
```javascript
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
```


### 5. Redirect
```javascript
<Switch>
    <Route path="/home" component={Home}></Route>
    <Route path="/profile" component={Profile}></Route>
    <Route path="/user" component={User}></Route>
    <Redirect to="/err"></Redirect>
</Switch>
```
当所有页面都不匹配时强制跳转
```javascript
return (<Consumer>
    {state => {
        // 直接强行改变hash
        state.history.push(this.props.to);
        return null;
    }}
</Consumer>)
```

### 6. 根据参数匹配页面

`match`的作用是使组件可以通过类似`/home/:id`的方式传递数据，渲染出`id`相关数据

```javascript
/* user.jsx */
return (<div>
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
</div>)
/* userList.jsx */
return (<div>
        <Link to="/user/detail/1/Amy">  Amy  </Link>
        <Link to="/user/detail/2/Mike">  Mike  </Link>
        <Link to="/user/detail/3/Nancy">  Nancy  </Link>
</div>)
/* userDetail.js */
return (
    <div>
        Detail
        <div>id: {this.props.match.params.id}</div>
        <div>name：{this.props.match.params.name}</div>
    </div>
)
```
实现步骤：
- 利用`pathToRegexp`函数解析对比可以得到`key`和`values`的映射关系
```javascript
let { pathToRegexp } = require('path-to-regexp')
let keys = [];
let reg = pathToRegexp('/user/detail/:id/:name', keys, { end: false })
console.log(keys.map(v => v.name));//[ 'id', 'name' ]
/* 测试 */
let pathname = '/user/detail/111/bbb';
let [url, ...values] = path.match(reg);
console.log(values);//['111','bbb'];对应于['id','name']
```
- 依据`pathToRegexp`规则修改`Route`类的`render`函数,将映射应用到`params`上，传递给子元素
```javascript
/* Route.js */
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
            let reg = pathToRegexp(path, keys, { end: exac });
            keys = keys.map(v => v.name);
            let [url, ...values] = pathname.match(reg) || [];
            // console.log(keys)//['id','name']
            // console.log(values);//['1','Amy']
            /* 设置传给子节点的数据 */
            let props = {
                ...state,
                match: {
                    params: keys.reduce((data, item, idx) => {
                        data[item] = values[idx];
                        return data;
                    }, {})//结果 {id:'1',name:'Amy'}
                }
            }
            return reg.test(pathname) ? <Component {...props} /> : null;
        }}
    </Consumer>)
}
```
##### 过程描述
1. 假设`to="/user/detail/1/Amy"`，点击`link`标签，调用`state`传入的`state.history.push(to)`方法，改变`window.location.hash`
2. 触发`HashRouter`的`hashchange`事件，改变`HashRouter`的`state`重新`render`包含的内容
3. `App`组件的`Route`匹配到`/user`渲染`User`组件
4. `User`组件的`Route`匹配到`/user/detail/:id/:name`,将`{id:'1',name:'Amy'}`放到`props.history.match`，再将整个`props`解构传给`userDetail`


## 7. 总结
- `HashRouter`监听`hash`的改变并提供操作`hash`的方法，每次改变都会触发包裹的内部元素进行`render`,并使用`Provider`传递数据
- `Route、Link、Switch、Redirect`都是使用`Consumer`接受`HashRouter`关于`hash`的数据和方法，利用这些数据与属性传入数据进行比对，从而确定是否渲染组件或者子组件