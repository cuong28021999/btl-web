import React, { Component } from 'react';
import { FaUser, FaUserEdit } from 'react-icons/fa'
import { MdEmail, MdCode } from 'react-icons/md'

import axios from 'axios'

import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Input
} from 'reactstrap'

class Register extends Component {
    constructor(props) {
        super(props)

        this.state = {
            username: '',
            email: '',
            password: '',
            permission: 'student'
        }
    }


    handleInput = (event, inputName) => {
        if (inputName === 'username') {
            this.setState({
                username: event.target.value
            })
        }

        if (inputName === 'email') {
            this.setState({
                email: event.target.value
            })
        }

        if (inputName === 'password') {
            this.setState({
                password: event.target.value
            })
        }

        if (inputName === 'permission') {
            this.setState({
                permission: event.target.value
            })
        }
    }

    onRegister = (event) => {
        event.preventDefault()

        const { username, email, password, permission } = this.state

        axios({
            baseURL: process.env.REACT_APP_baseURL,
            url: 'auth/register',
            method: 'POST',
            data: {
                email: email,
                password: password,
                username: username,
                permission: permission
            }
        }).then(res => {
            if (res.status === 200) {
                alert('Create success!')
            }
        }).catch(err => {
            this.setState({
                isLogin: false
            })
            alert('Create failed!')
        })
    }

    render() {
        return (
            <div
                className="Register container d-flex flex-column justify-content-center align-items-center shadow-lg mt-5 rounded-lg"
                style={{ height: "70vh" }}
            >
                <div
                    className="rounded-circle bg-danger my-3"
                >
                    <FaUser
                        className="m-5 text-light"
                        style={{ fontSize: "60px" }}
                    />
                </div>
                <h2 className="text-danger">Create Account</h2>
                <form
                    className="form-group"
                    onSubmit={(event) => this.onRegister(event)}
                >
                    <InputGroup
                        className="my-2 mt-4"
                        style={{width: "30vw"}}
                    >
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText><FaUserEdit className="text-success" /></InputGroupText>
                        </InputGroupAddon>
                        <Input
                            name="username"
                            type="text"
                            placeholder="username"
                            onChange={(event) => this.handleInput(event, 'username')}
                            required
                        />
                    </InputGroup>
                    <InputGroup
                        className="my-2"
                        style={{width: "30vw"}}
                    >
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText><MdEmail className="text-info" /></InputGroupText>
                        </InputGroupAddon>
                        <Input
                            name="email"
                            type="text"
                            placeholder="email"
                            onChange={(event) => this.handleInput(event, 'email')}
                            required
                        />
                    </InputGroup>
                    <InputGroup
                        className="my-2"
                        style={{width: "30vw"}}
                    >
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText><MdCode className="text-danger" /></InputGroupText>
                        </InputGroupAddon>
                        <Input
                            name="password"
                            type="password"
                            placeholder="password"
                            onChange={(event) => this.handleInput(event, 'password')}
                            required
                        />
                    </InputGroup>

                    <div className="input-group my-2" style={{width: "30vw"}}>
                        <div className="input-group-prepend">
                            <label className="input-group-text" htmlFor="permission">Permission</label>
                        </div>
                        <select 
                            className="custom-select" 
                            id="permission" 
                            name="permission"
                            onChange={(event) => this.handleInput(event, 'permission')}
                        >
                            <option value="student" defaultValue>Student</option>
                            <option value="teacher">Teacher</option>
                        </select>
                    </div>
                    <input
                        type="submit"
                        value="Create"
                        className="btn btn-primary w-100 my-2"
                        required
                    />
                </form>
            </div>
        )
    }
}

export default Register;