import React, { Component } from 'react'
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ListGroup,
    ListGroupItem
} from 'reactstrap'

import axios from 'axios'
import Cookies from 'js-cookie'

import {TiDelete} from 'react-icons/ti'

class EditMember extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modal: false,
            maxMember: this.props.myClass.maxMember,
            members: this.props.myClass.members,
            usernames: []
        }
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        })
    }

    deleteMembers = (classId, userId) => {
        axios({
            baseURL: process.env.REACT_APP_baseURL,
            url: `/class/${classId}/deleteMember/${userId}`,
            headers: {
                token: Cookies.get('token')
            },
            method: "DELETE",
        }).then(res => {
            if (res.status === 200) {
                let temp = this.state.members.filter((item, index) => {
                    return item !== classId
                }) 
                this.setState({
                    members: temp
                })
                window.location.reload()
            }
        }).catch(err => {
            console.log(err)
            window.location.reload()
        })
    }

    componentDidMount() {
        const { members } = this.state
        if (members.length > 0) {
            members.forEach((member, index) => {
                axios({
                    baseURL: process.env.REACT_APP_baseURL,
                    url: `/auth/${member}`,
                    headers: {
                        token: Cookies.get('token')
                    },
                    method: "GET",
                }).then(res => {
                    if (res.status === 200) {
                        const temp = this.state.usernames
                        temp.push(res.data)
                        this.setState({
                            usernames: temp
                        })
                    }
                }).catch(err => {
                    console.log(err)
                    window.location.reload()
                });
            })
        }
    }

    render() {
        const { toggle } = this
        const {myClass} = this.props
        const { modal, maxMember, members, usernames } = this.state
        return (
            <div>
                <span
                    onClick={toggle}
                    className=""
                    style={{ cursor: "pointer" }}
                >Members: {members.length}/{maxMember}</span>
                <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader>Members list</ModalHeader>
                    <ModalBody>
                        {
                            members.length === 0 && <span className="text-danger">Don't have members</span>
                        }
                        {
                            members.length > 0 &&
                            <ListGroup>
                                {
                                    usernames.map((item, index) =>
                                        <ListGroupItem key={index} className="d-flex justify-content-between" action>
                                            <span>{item.username}</span>
                                            <TiDelete
                                                style={{ cursor: "pointer", fontSize: "25px" }}
                                                className="text-danger"
                                                onClick={() => this.deleteMembers(myClass._id, item._id)}
                                            />
                                        </ListGroupItem>
                                    )
                                }
                            </ListGroup>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default EditMember