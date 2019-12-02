import React, { Component } from 'react'


import axios from 'axios'
import Cookies from 'js-cookie'

import {
    ListGroup,
    ListGroupItem
} from 'reactstrap'

import { MdSchool, MdExitToApp } from 'react-icons/md'

class ClassStudent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            classCode: '',
            classOfSearch: null,
            isClickSearch: false,
            classes: []
        }
    }

    handleInput = (event, inputName) => {
        if (inputName === 'classCode') {
            this.setState({
                classCode: event.target.value
            })
        }
    }

    onSearch = (event) => {
        event.preventDefault()

        const { classCode } = this.state

        this.setState({
            isClickSearch: true
        })

        axios({
            baseURL: process.env.REACT_APP_baseURL,
            url: `/class/${classCode}`,
            headers: {
                token: Cookies.get('token')
            },
            method: "GET"
        }).then(res => {
            if (res.status === 200) {
                this.setState({
                    classOfSearch: res.data,
                })
            }
        }).catch(err => {
            console.log(err)
            this.setState({
                classOfSearch: null
            })
        })
    }

    onJoinClass = (classId) => {
        axios({
            baseURL: process.env.REACT_APP_baseURL,
            url: `/class/${classId}/join`,
            headers: {
                token: Cookies.get('token')
            },
            method: "PATCH"
        }).then(res => {
            if (res.status === 200) {
                window.location.reload()
            }
        }).catch(err => {
            console.log(err)
            window.location.reload()
        })
    }

    exitClass = (classId) => {
        window.confirm("You wan't exit class?")
        console.log(classId)
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

    render() {
        const { classOfSearch, isClickSearch, classes } = this.state
        return (
            <div className="ClassStudent container mt-5 d-flex flex-column">
                <form
                    className="form-group ml-auto d-flex"
                    onSubmit={(event) => this.onSearch(event)}
                >
                    <div className="d-flex flex-column">
                        <input
                            name="classCode"
                            type="text"
                            placeholder="Search class code"
                            className="form-control"
                            onChange={(event) => this.handleInput(event, 'classCode')}
                            required
                        />
                        {isClickSearch && !classOfSearch ? <span className="text-danger">Don't have class</span> : ""}
                    </div>
                    <input
                        name="submit"
                        type="submit"
                        value="Search"
                        className="btn btn-primary ml-2 mb-auto"
                    />
                </form>
                {
                    classOfSearch &&
                    <div>
                        <h5>Search: {classOfSearch.classCode}</h5>
                        <ListGroup>
                            <ListGroupItem
                                action
                                className="d-flex flex-row justify-content-sm-between"
                            >
                                <div>
                                    <MdSchool
                                        style={{ fontSize: "25px" }}
                                        className="text-info mr-3"
                                    />
                                    {classOfSearch.className}
                                </div>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => this.onJoinClass(classOfSearch._id)}
                                >Join</button>
                            </ListGroupItem>
                        </ListGroup>
                    </div>
                }
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
                                </div>
                                <div>
                                    <MdExitToApp
                                        style={{ cursor: "pointer", fontSize: "25px" }}
                                        className="text-danger"
                                        onClick={() => this.exitClass(item._id)}
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

export default ClassStudent;