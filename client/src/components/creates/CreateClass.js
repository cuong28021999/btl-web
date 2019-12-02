import React, { Component } from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';

import axios from 'axios'
import Cookies from 'js-cookie'

import {FaSchool} from 'react-icons/fa'

class CreateClass extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modal: false,
            className: '',
            maxMember: ''
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

    onCreateClass = (event) => {
        event.preventDefault()

        const { className, maxMember } = this.state
        axios({
            baseURL: process.env.REACT_APP_baseURL,
            url: `/class`,
            headers: {
                token: Cookies.get('token')
            },
            method: "POST",
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
        const { modal} = this.state
        return (
            <div>
                <button
                    onClick={toggle}
                    className="btn btn-info mb-2"
                >
                    <FaSchool
                        style={{ cursor: "pointer", fontSize: "25px" }}
                        className="text-light mr-2"
                    />
                    <span>Create class</span>
                </button>
                <Modal isOpen={modal} toggle={toggle}>
                    <form 
                        className="was-validated"
                        onSubmit={(event) => this.onCreateClass(event)}
                    >
                        <ModalHeader>Create class</ModalHeader>
                        <ModalBody>
                            <div className="form-group">
                                <label>Class name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    onChange={(event) => this.handleInput(event, 'className')}
                                    required
                                />
                            </div>
                            <div className="form-group mt-4">
                                <label>Max member</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    onChange={(event) => this.handleInput(event, 'maxMember')}
                                    required
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <input
                                type="submit"
                                className="btn btn-primary"
                                value="Create"
                            />
                            <Button color="secondary" onClick={toggle}>Cancel</Button>
                        </ModalFooter>
                    </form>
                </Modal>
            </div>
        )
    }
}

export default CreateClass;