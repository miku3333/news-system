import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import axios from 'axios'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

export default function RoleList () {
    const [dataSource, setDataSource] = useState([])
    const [rightList, setRightList] = useState([])
    const [currentRights, setCurrentRights] = useState([])
    const [currentId, setCurrentId] = useState(0)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />} style={{ marginRight: '5px' }} onClick={() => confirmF(item)} />
                    <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => {
                        setIsModalVisible(true);
                        setCurrentRights(item.rights);
                        setCurrentId(item.id);
                    }} />
                </div>

            }
        },
    ]

    const confirmF = (item) => {
        confirm({
            title: '是否要删除这个项目?',
            icon: <ExclamationCircleOutlined />,
            // content: '删除后不可恢复',
            onOk () {
                deleteF(item);
            },
            onCancel () {

            },
        });
    }

    const deleteF = (item) => {
        setDataSource(dataSource.filter(data => data.id !== item.id));
        axios.delete('http://localhost:5000/roles/' + item.id)
    }

    useEffect(() => {
        axios.get('http://localhost:5000/roles').then(res => {
            setDataSource(res.data)
        })
    }, [])

    useEffect(() => {
        axios.get('http://localhost:5000/rights?_embed=children').then(res => {
            setRightList(res.data)
        })
    }, [])


    const handleOk = () => {
        setIsModalVisible(false);
        setDataSource(dataSource.map(item => item.id === currentId ? { ...item, rights: currentRights } : item))
        axios.patch('http://localhost:5000/roles/' + currentId, { rights: currentRights })
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onCheck = (checkKeys) => {
        setCurrentRights(checkKeys);
    }

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}></Table>
            <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Tree
                    checkable
                    checkedKeys={currentRights}
                    onCheck={onCheck}
                    checkStrictly={true}
                    treeData={rightList}
                />
            </Modal>
        </div>
    )
}
