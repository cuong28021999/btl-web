import React, { Component } from 'react';

import CreateExam from '../../../components/creates/CreateExam'
import EditExam from '../../../components/edits/EditExam'

import axios from 'axios'
import Cookies from 'js-cookie'

import { TiDelete } from 'react-icons/ti'
import { FaEdit } from 'react-icons/fa'

import {
    ListGroup,
    ListGroupItem
} from 'reactstrap'

class InClassTeacher extends Component {
    constructor(props) {
        super(props)

        this.state = {
            exams: [],
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

        // get all exam in class
        axios({
            baseURL: process.env.REACT_APP_baseURL,
            url: `/exam/${window.location.pathname.split('/')[3]}/all`,
            headers: {
                token: Cookies.get('token')
            },
            method: "GET"
        }).then(res => {
            if (res.status === 200) {
                this.setState({
                    exams: res.data
                })
            }
        }).catch(err => {
            console.log(err)
        })
    }

    deleteExam = (examId) => {
        axios({
            baseURL: process.env.REACT_APP_baseURL,
            url: `/exam/${examId}`,
            headers: {
                token: Cookies.get('token')
            },
            method: "DELETE",
        }).then(res => {
            if (res.status === 200) {
                let temp = this.state.exams.filter((item, index) => {
                    return item._id !== examId
                })
                this.setState({
                    exams: temp
                })
            }
        }).catch(err => {
            console.log(err)
            window.location.reload()
        })
    }

    render() {
        const { exams, subjects } = this.state
        return (
            <div className="InClassTeacher container mt-5">
                <CreateExam subjects={subjects} />
                <ListGroup>
                    {
                        exams.length > 0 &&
                        exams.map((exam, index) =>
                            <ListGroupItem
                                key={index}
                                className="d-flex flex-column"
                            >
                                <TiDelete
                                    style={{ cursor: "pointer", fontSize: "25px" }}
                                    className="text-danger ml-auto"
                                    onClick={() => this.deleteExam(exam._id)}
                                />
                                <h5 className="mb-3">{exam.examName}</h5>
                                <p>Subject: {exam.subjectName}</p>
                                <p>Time start: {new Date(exam.timeStart).toLocaleTimeString()} {new Date(exam.timeStart).toLocaleDateString()}</p>
                                <p>Time end: {new Date(new Date(exam.timeStart).valueOf() + (exam.timeLimit + 60) * 60 * 1000).toLocaleTimeString()} {new Date(new Date(exam.timeStart).valueOf() + (exam.timeLimit + 60) * 60 * 1000).toLocaleDateString()}</p>
                                <p>Limit: {exam.timeLimit} minutes</p>
                                <div className="d-flex flex-row justify-content-end">
                                    <EditExam
                                        exam={exam}
                                        examId={exam._id}
                                        subjects={subjects}
                                        className="text-success ml-auto btn btn-light mr-2"
                                    />
                                    <a
                                        href={`${window.location.pathname}/exam/${exam._id}`}
                                        className="btn btn-info"
                                    >
                                        <FaEdit
                                            style={{ cursor: "pointer", fontSize: "25px" }}
                                            className="text-light"
                                        />
                                    </a>
                                </div>
                            </ListGroupItem>
                        )
                    }
                </ListGroup>
            </div>
        )
    }
}

export default InClassTeacher;