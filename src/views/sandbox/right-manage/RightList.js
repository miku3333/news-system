import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd'
import axios from 'axios'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

export default function RightList () {
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => axios.get('http://localhost:5000/rights?_embed=children').then
        (res => setDataSource(res.data.map(item => {
            if (item.children.length === 0) {
                item.children = undefined;
            }
            return item;
        }))), []);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '权限名称',
            dataIndex: 'title',
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render: (key) => {
                return <Tag color="orange">{key}</Tag>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger type="primary" shape="circle" icon={<DeleteOutlined />}
                        style={{ marginRight: '5px' }} onClick={() => confirmF(item)} />
                    <Popover content={
                        <div style={{ textAlign: 'center' }}>
                            <Switch checked={item.pagepermisson} onChange={() => switchMethod(item)}></Switch>
                        </div>}
                        title=" 配置项" trigger={item.pagepermisson === undefined ? '' : 'click'}>
                        <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson === undefined} />
                    </Popover>
                </div>

            }
        },

    ];

    const switchMethod = (item) => {
        item.pagepermisson = 1 - item.pagepermisson;
        setDataSource([...dataSource]);
        if (item.grade === 1) {
            axios.patch('http://localhost:5000/rights/' + item.id, { pagepermisson: item.pagepermisson });
        }
        else {
            axios.patch('http://localhost:5000/children/' + item.id, { pagepermisson: item.pagepermisson });
        }
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
        if (item.grade === 1) {
            setDataSource(dataSource.filter(data => data.id !== item.id));
            axios.delete('http://localhost:5000/rights/' + item.id)
        }
        else {
            let list = dataSource.filter(data => data.id === item.rightId)[0];
            list.children = list.children.filter(data => data.id !== item.id);
            setDataSource([...dataSource]);
            axios.delete('http://localhost:5000/children/' + item.id)
        }
    }

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
        </div>
    )
}
