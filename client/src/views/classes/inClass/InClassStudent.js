import React, { Component } from 'react';

import axios from 'axios'
import Cookies from 'js-cookie'

import {
    ListGroup,
    ListGroupItem
} from 'reactstrap'

class InClassStudent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            exams: []
        }
    }

    componentDidMount() {
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

    preTest = (exam) => {
        const now = Date.now()    

        if (exam.timeStart > now) {
            return alert("It's not time to do test!")
        } else {
            if (now > exam.timeEnd) {
                return alert('Time out!')
            } else {
                window.location.replace(`${window.location.pathname}/exam/${exam._id}`)
            }
        }
    }

    render() {
        const { exams } = this.state
        return (
            <div className="InClassStudent container mt-5">
                <ListGroup>
                    {
                        exams.length > 0 &&
                        exams.map((item, index) => {
                            return {
                                _id: item._id,
                                examName: item.examName,
                                subjectName: item.subjectName,
                                timeStart: new Date(item.timeStart),
                                timeEnd: new Date(new Date(item.timeStart).valueOf() + (item.timeLimit + 60) * 60 * 1000),
                                timeLimit: item.timeLimit
                            }
                        }
                        ).map((exam, index) =>
                            <ListGroupItem
                                key={index}
                                className="d-flex flex-column"
                            >
                                <h5 className="mb-3">{exam.examName}</h5>
                                <p>Subject: {exam.subjectName}</p>
                                <p>Time start: {exam.timeStart.toLocaleTimeString()} {exam.timeStart.toLocaleDateString()}</p>
                                <p>Time end: {exam.timeEnd.toLocaleTimeString()} {exam.timeEnd.toLocaleDateString()}</p>
                                <p>Limit: {exam.timeLimit} minutes</p>

                                <button
                                    className="btn btn-warning text-light ml-auto"
                                    onClick={() => this.preTest(exam)}
                                >
                                    Start
                                </button>
                            </ListGroupItem>
                        )
                    }
                </ListGroup>
            </div>
        )
    }
}

export default InClassStudent;