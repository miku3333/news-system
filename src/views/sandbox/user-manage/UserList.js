import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Modal, Switch } from 'antd'
import axios from 'axios'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import UserForm from '../../../components/user-manage/UserForm';

const { confirm } = Modal;

export default function UserList () {
    const [dataSource, setDataSource] = useState([]);
    const [isAddVisible, setIsAddVisible] = useState(false);
    const [isUpdateVisible, setIsUpdateVisible] = useState(false);
    const [roleList, setRoleList] = useState([]);
    const [regionList, setRegionList] = useState([]);
    const [isUpdateDiabled, setIsUpdateDiabled] = useState(false)
    const [current, setCurrent] = useState(null)
    const addForm = useRef(null);
    const updateForm = useRef(null);

    const { roleId, region, username } = JSON.parse(localStorage.getItem('token'))


    useEffect(() => axios.get('http://localhost:5000/users?_expand=role')
        .then(res => {
            const roleObj = {
                1: 'superadmin',
                2: 'admin',
                3: 'editor',
            }
            const list = res.data
            setDataSource(roleObj[roleId] === 'superadmin' ? list : [
                ...list.filter(item => item.username === username),
                ...list.filter(item => item.region === region && roleObj[item.roleId] === 'editor')
            ]);
        }), [roleId, region, username]);
    useEffect(() => axios.get('http://localhost:5000/regions').then(res => setRegionList(res.data)), []);
    useEffect(() => axios.get('http://localhost:5000/roles').then(res => setRoleList(res.data)), []);


    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            filters: [
                ...regionList.map(item => ({
                    text: item.title,
                    value: item.value,
                })),
                {
                    text: '全球',
                    value: '全球'
                }
            ],
            onFilter: (value, item) => value === '全球' ? item.region === '' : item.region === value,
            render: (region) => {
                return <b>{region === '' ? '全球' : region}</b>
                // return <b>{region ?? '全球'}</b>
            }
        },
        {
            title: '角色名称 ',
            dataIndex: 'role',
            render: (role) => {
                return role?.roleName
            }
        },
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '用户状态',
            dataIndex: 'roleState',
            render: (roleState, item) => <Switch checked={roleState} disabled={item.default} onChange={() => handleChange(item)} ></Switch>
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger type="primary" shape="circle" icon={<DeleteOutlined />}
                        style={{ marginRight: '5px' }} onClick={() => confirmF(item)} />
                    <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={() => handleUpdate(item)} />
                </div>

            }
        },

    ];

    const handleChange = (item) => {
        item.roleState = !item.roleState;
        setDataSource([...dataSource])
        axios.patch('http://localhost:5000/users/' + item.id, {
            roleState: item.roleState
        })
    }

    const handleUpdate = (item) => {
        setTimeout(() => {
            setIsUpdateVisible(true);
            if (item.roleId === 1) {
                setIsUpdateDiabled(true);
            }
            else {
                setIsUpdateDiabled(false);
            }
            updateForm.current.setFieldsValue(item);
        }, 0)
        setCurrent(item);
    }

    const confirmF = (item) => {
        confirm({
            title: '是否要删除这个项目?',
            icon: <ExclamationCircleOutlined />,
            // content: '删除后不可恢复',
            onOk () {
                deleteF(item);
            },
            onCancel () {
                console.log('取消');
            },
        });
    }

    const deleteF = (item) => {
        setDataSource(dataSource.filter(data => data.id !== item.id));
        axios.delete('http://localhost:5000/users/' + item.id)
    }

    const addFormOK = () => {
        addForm.current.validateFields().then(value => {
            setIsAddVisible(false);
            addForm.current.resetFields();
            axios.post('http://localhost:5000/users', {
                ...value,
                roleState: true,
                default: false,
            }).then(res => {
                console.log(res.data);
                setDataSource([...dataSource, { ...res.data, role: roleList.filter(item => item.id == value.roleId)[0] }]);
            })
        }).catch(err => {

        })
    }

    const updateFormOK = () => {
        updateForm.current.validateFields().then(value => {
            setIsUpdateVisible(false);
            setDataSource(dataSource.map(item => {
                if (item.id == current.id) {
                    return {
                        ...item,
                        ...value,
                        role: roleList.filter(item => item.id == value.roleId)[0]
                    }
                }
                return item;
            }))
            setIsUpdateDiabled(!isUpdateDiabled);
            axios.patch('http://localhost:5000/users/' + current.id, value)

        }).catch(err => {

        })
    }

    return (
        <div>
            <Button type='primary' onClick={() => setIsAddVisible(true)}>添加用户</Button>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
            <Modal
                visible={isAddVisible}
                title="添加用户"
                okText="确定"
                cancelText="取消"
                onCancel={
                    () => setIsAddVisible(false)
                }
                onOk={addFormOK}
            >
                <UserForm regionList={regionList} roleList={roleList} ref={addForm}></UserForm>
            </Modal>
            <Modal
                visible={isUpdateVisible}
                title="更新用户"
                okText="更新"
                cancelText="取消"
                onCancel={
                    () => {
                        setIsUpdateVisible(false)
                        setIsUpdateDiabled(!isUpdateDiabled)
                    }
                }
                onOk={updateFormOK}
            >
                <UserForm regionList={regionList} roleList={roleList} ref={updateForm} isUpdateDiabled={isUpdateDiabled} isUpdate={true}></UserForm>
            </Modal>

        </div>
    )
}
