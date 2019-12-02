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

class EditExam extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modal: false,
            exam: this.props.exam,
            examName: this.props.exam.examName,
            timeStart: this.props.exam.timeStart,
            timeLimit: this.props.exam.timeLimit,
            subjectName: this.props.exam.subjectName
        }
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

    onEditInfoExam = (event) => {
        event.preventDefault()

        const { examId } = this.props

        const { examName, timeLimit, timeStart, subjectName } = this.state

        axios({
            baseURL: process.env.REACT_APP_baseURL,
            url: `/exam/${examId}/changeInfo`,
            headers: {
                token: Cookies.get('token')
            },
            method: "PATCH",
            data: {
                examName: examName,
                timeStart: timeStart,
                timeLimit: timeLimit,
                subjectName: subjectName
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

    formatTime = (date) => {
        const timeArr = date.toString().split(' ')[4].split(':')
        const timeFormat = `${timeArr[0]}:${timeArr[1]}`

        const dateArr = date.toLocaleDateString().split('/')
        const dateFormat = `${dateArr[2]}-${dateArr[0]}-${dateArr[1]}T`

        return `${dateFormat}${timeFormat}`
    }

    render() {
        const { toggle } = this
        const {subjects} = this.props
        const { modal, exam } = this.state

        const timeStartFormat = this.formatTime(new Date(exam.timeStart))
        return (
            <div className="d-flex">
                <button
                    className={this.props.className}
                >
                    <MdEdit
                        style={{ cursor: "pointer", fontSize: "25px" }}
                        onClick={toggle}
                    />
                </button>
                <Modal isOpen={modal} toggle={toggle}>
                    <form
                        className="was-validated"
                        onSubmit={(event) => this.onEditInfoExam(event)}
                    >
                        <ModalHeader>Edit class</ModalHeader>
                        <ModalBody>
                            <div className="form-group">
                                <label>Exam name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="examName"
                                    defaultValue={exam.examName}
                                    onChange={(event) => this.handleInput(event, 'examName')}
                                    required
                                />
                            </div>

                            <div className="form-group mt-4">
                                <label>Subject</label>
                                <select
                                    name="subjectName"
                                    onChange={(event) => this.handleInput(event, 'subjectName')}
                                    className="custom-select"
                                    required
                                >
                                    {
                                        subjects.length > 0 &&
                                        subjects.map((subject, index) => <option
                                            key={index}
                                            value={subject.subjectName}
                                            selected={subject.subjectName === exam.subjectName ? true : false}
                                        >
                                            {subject.subjectName}
                                        </option>
                                        )
                                    }
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Time Start</label>
                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    name="timeStart"
                                    defaultValue={timeStartFormat}
                                    onChange={(event) => this.handleInput(event, 'timeStart')}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Time limit</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="timeLimit"
                                    defaultValue={exam.timeLimit}
                                    onChange={(event) => this.handleInput(event, 'timeLimit')}
                                    required
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

export default EditExam;