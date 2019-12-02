import React, { Component } from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';

import { MdEdit } from 'react-icons/md'

import axios from 'axios'
import Cookies from 'js-cookie'

class EditClass extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modal: false,
            className: this.props.myClass.className,
            maxMember: this.props.myClass.maxMember
        }
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        })
    }

    handleInput = (event, inputName) => {
        if (inputName === 'className') {
            this.setState({
                className: event.target.value
            }) 
        }

        if (inputName === 'maxMember') {
            this.setState({
                maxMember: event.target.value
            }) 
        }
    }

    onEditInfoClass = (event) => {
        event.preventDefault()

        const {classId} = this.props
        const { className, maxMember } = this.state
        axios({
            baseURL: process.env.REACT_APP_baseURL,
            url: `/class/${classId}/changeInfo`,
            headers: {
                token: Cookies.get('token')
            },
            method: "PATCH",
            data: {
                className: className,
                maxMember: maxMember
            }
        }).then(res => {
            if (res.status === 200) {
                this.toggle()
                window.location.reload()
            }
        }).catch(err => {
            console.log(err)
            window.location.reload()
        })   
    }

    render() {
        const { toggle } = this
        const { modal, className, maxMember } = this.state
        const { myClass } = this.props
        return (
            <div>
                <MdEdit
                    style={{ cursor: "pointer", fontSize: "25px" }}
                    className="text-success mx-3"
                    onClick={toggle}
                />
                <Modal isOpen={modal} toggle={toggle}>
                    <form 
                        className="was-validated"
                        onSubmit={(event) => this.onEditInfoClass(event)}
                    >
                        <ModalHeader>Edit class</ModalHeader>
                        <ModalBody>
                            <div className="form-group">
                                <label>Class name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={className}
                                    onChange={(event) => this.handleInput(event, 'className')}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Class code</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={myClass.classCode}
                                    disabled
                                />
                            </div>
                            <div className="form-group mt-4">
                                <label>Max member</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={maxMember}
                                    onChange={(event) => this.handleInput(event, 'maxMember')}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Create date</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={`${new Date(myClass.createDate).toLocaleTimeString()} ${new Date(myClass.createDate).toLocaleDateString()}`}
                                    disabled
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <input
                                type="submit"
                                className="btn btn-primary"
                                value="Change"
                            />
                            <Button color="secondary" onClick={toggle}>Cancel</Button>
                        </ModalFooter>
                    </form>
                </Modal>
            </div>
        )
    }
}

export default EditClass;