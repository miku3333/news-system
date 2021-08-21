import React, { useState } from 'react'
import { Layout, Dropdown, Menu, Avatar } from 'antd'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined
} from '@ant-design/icons';
const { Header } = Layout;
function TopHeader (props) {
    // const [collapsed, setCollapsed] = useState(false)
    const changeCollapsed = () => {
        props.changeCollapsed()
    }

    const { role: { roleName }, username } = JSON.parse(localStorage.getItem('token'))

    const menu = (
        <Menu>
            <Menu.Item>
                {roleName}
            </Menu.Item>
            <Menu.Item danger onClick={() => { localStorage.removeItem('token'); props.history.replace('/login'); }}>
                退出
            </Menu.Item>
        </Menu>
    );
    return (
        <Header className="site-layout-background" style={{ padding: '0 16px' }}>
            {/* {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: this.toggle,
            })} */}
            {
                props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
            }
            <div style={{ float: 'right' }}>
                <div>欢迎<span style={{ color: '#1890ff' }}>{username}</span>回来</div>
                <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                        <Avatar size="large" icon={<UserOutlined />} />
                    </a>
                </Dropdown>
            </div>
        </Header>
    )
}

const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
    return {
        isCollapsed
    }
}

const mapDispatchToProps = {
    changeCollapsed () {
        return {
            type: 'changeCollapsed',
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopHeader))
