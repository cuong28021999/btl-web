import React, { Component } from 'react'

import axios from 'axios'
import Cookies from 'js-cookie'

import {
    ListGroup,
    ListGroupItem
} from 'reactstrap'

import { MdDelete, MdSchool } from 'react-icons/md'

import EditClass from '../../components/edits/EditClass'
import EditMember from '../../components/edits/EditMember'

import CreateClass from '../../components/creates/CreateClass'


class ClassTeacher extends Component {
    constructor(props) {
        super(props)

        this.state = {
            classes: []
        }
    }

    componentDidMount() {
        axios({
            baseURL: process.env.REACT_APP_baseURL,
            url: "/class",
            headers: {
                token: Cookies.get('token')
            },
            method: "GET",
        }).then(res => {
            if (res.status === 200) {
                this.setState({
                    classes: res.data
                })
            }
        }).catch(err => {
            console.log(err)
        })
    }

    deleteClass = (classId) => {
        axios({
            baseURL: process.env.REACT_APP_baseURL,
            url: `/class/${classId}`,
            headers: {
                token: Cookies.get('token')
            },
            method: "DELETE",
        }).then(res => {
            if (res.status === 200) {
                let temp = this.state.classes.filter((item, index) => {
                    return item._id !== classId
                }) 
                this.setState({
                    classes: temp
                })
            }
        }).catch(err => {
            console.log(err)
            window.location.reload()
        })
    }

    render() {
        const { classes } = this.state
        return (
            <div className="ClassTeacher container mt-5">
                <CreateClass/>
                <ListGroup>
                    {
                        classes.map((item, index) =>
                            <ListGroupItem
                                key={index}
                                action
                                className="d-flex flex-row justify-content-sm-between"
                            >
                                <div>
                                    <MdSchool
                                        style={{ fontSize: "25px" }}
                                        className="text-info"
                                    />
                                    <a 
                                        href={`${window.location.href}/${item._id}`} 
                                        className="text-secondary mx-3"
                                    >{item.className}</a>
                                    <span>Class code: {item.classCode}</span>
                                </div>
                                <div className="d-flex">
                                    <EditMember myClass={item} classId={item._id}/>
                                    <EditClass myClass={item} classId={item._id}/>
                                    <MdDelete
                                        style={{ cursor: "pointer", fontSize: "25px" }}
                                        className="text-danger"
                                        onClick={() => this.deleteClass(item._id)}
                                    />
                                </div>
                            </ListGroupItem>
                        )
                    }
                </ListGroup>
            </div>
        )
    }
}

export default ClassTeacher;