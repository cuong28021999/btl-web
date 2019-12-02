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

import { FiFilePlus } from 'react-icons/fi'

class CreateExam extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modal: false,
            examName: '',
            timeStart: '',
            timeLimit: 60,
            subjectName: '',
            subjects: []
        }
    }

    componentDidMount() {
        // get subject
        axios({
            baseURL: process.env.REACT_APP_baseURL,
            url: `/getAllSubject`,
            headers: {
                token: Cookies.get('token')
            },
            method: "GET"
        }).then(res => {
            if (res.status === 200) {
                this.setState({
                    subjects: res.data
                })
            }
        }).catch(err => {
            console.log(err)
        })
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        })
    }

    handleInput = (event, inputName) => {
        if (inputName === 'examName') {
            this.setState({
                examName: event.target.value
            })
        }

        if (inputName === 'timeStart') {
            this.setState({
                timeStart: event.target.value
            })
        }

        if (inputName === 'timeLimit') {
            this.setState({
                timeLimit: event.target.value
            })
        }

        if (inputName === 'subjectName') {
            this.setState({
                subjectName: event.target.value
            })
        }
    }

    onCreateExam = (event) => {
        event.preventDefault()

        const { examName, subjectName, timeLimit, timeStart } = this.state

        axios({
            baseURL: process.env.REACT_APP_baseURL,
            url: `/exam`,
            headers: {
                token: Cookies.get('token')
            },
            method: "POST",
            data: {
                examName: examName,
                subjectName: subjectName,
                timeStart: timeStart,
                timeLimit: timeLimit,
                classId: window.location.pathname.split('/')[3]
            }
        }).then(res => {
            if (res.status === 200) {
                this.toggle()
                window.location.reload()
            }
        }).catch(err => {
            console.log(err)
            // window.location.reload()
        })
    }

    render() {
        const { toggle } = this
        const { modal, subjects } = this.state
        return (
            <div>
                <button
                    onClick={toggle}
                    className="btn btn-info mb-2"
                >
                    <FiFilePlus
                        style={{ cursor: "pointer", fontSize: "25px" }}
                        className="text-light mr-2"
                    />
                    <span>Create exam</span>
                </button>
                <Modal isOpen={modal} toggle={toggle}>
                    <form
                        className="was-validated form-group"
                        onSubmit={(event) => this.onCreateExam(event)}
                    >
                        <ModalHeader>Create exam</ModalHeader>
                        <ModalBody>
                            <div className="form-group">
                                <label>Exam name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="examName"
                                    onChange={(event) => this.handleInput(event, 'examName')}
                                    required
                                />
                            </div>
                            <div className="form-group mt-4">
                                <label>Subject</label>
                                <select
                                    id="subjectName"
                                    name="subjectName"
                                    onChange={(event) => this.handleInput(event, 'subjectName')}
                                    className="custom-select"
                                    required
                                >
                                    <option value="" defaultValue>Choose...</option>
                                    {
                                        subjects.length > 0 &&
                                        subjects.map((subject, index) => <option
                                            key={index}
                                            value={subject.subjectName}
                                        >
                                            {subject.subjectName}
                                        </option>
                                        )
                                    }
                                </select>
                            </div>
                            <div className="form-group mt-4">
                                <label>Time start</label>
                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    name="timeStart"
                                    onChange={(event) => this.handleInput(event, 'timeStart')}
                                    required
                                />
                            </div>
                            <div className="form-group mt-4">
                                <label>Time limit</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="timeLimit"
                                    defaultValue={60}
                                    placeholder="minutes"
                                    onChange={(event) => this.handleInput(event, 'timeLimit')}
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

export default CreateExam;