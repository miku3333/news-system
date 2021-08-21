import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { Redirect } from '_react-router-dom@5.2.0@react-router-dom/cjs/react-router-dom.min'
import Login from '../views/login/Login'
import NewsSandbox from '../views/sandbox/NewSandbox'
import Detail from '../views/news/Detail'
import News from '../views/news/News'

export default function IndexRouter () {
    return (
        <HashRouter>
            <Switch>
                <Route path='/login' component={Login} />
                <Route path="/news" component={News} />
                <Route path="/detail/:id" component={Detail} />
                <Route path='/' render={() =>
                    localStorage.getItem('token') ?
                        <NewsSandbox></NewsSandbox> :
                        <Redirect to='/login' />
                } />
            </Switch>

        </HashRouter>
    )
}
