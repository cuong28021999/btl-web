import React, { Component } from 'react'

import CreateQuestion from '../../../../components/creates/CreateQuestion'

import axios from 'axios'
import Cookies from 'js-cookie'

import { ListGroup, ListGroupItem } from 'reactstrap'
import { TiDelete } from 'react-icons/ti'

import QuestionLibrary from '../../../../components/questionLibrary/QuestionLibrary'

class InExamTeacher extends Component {

    constructor(props) {
        super(props)


        this.examId = window.location.pathname.split('/exam/')[1]
        this.state = {
            subjectName: '',
            exam: null,
            questions: [],
            questionsBySubject: [],
            examId: ''
        }
    }

    componentDidMount() {
        axios({
            baseURL: process.env.REACT_APP_baseURL,
            url: `/exam/${this.examId}`,
            headers: {
                token: Cookies.get('token')
            },
            method: "GET",
        }).then(res => {
            if (res.status === 200) {
                this.setState({
                    subjectName: res.data.subjectName,
                    exam: res.data,
                    examId: res.data._id
                })
                const questions = res.data.questions
                
                questions.forEach((questionId, index) => {
                    axios({
                        baseURL: process.env.REACT_APP_baseURL,
                        url: `/question/${questionId}`,
                        headers: {
                            token: Cookies.get('token')
                        },
                        method: "GET",
                    }).then(res => {
                        if (res.status === 200) {
                            let temp = this.state.questions
                            temp.push(res.data)
                            this.setState({
                                questions: temp
                            })
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                })

                axios({
                    baseURL: process.env.REACT_APP_baseURL,
                    url: `/question/getBySubject`,
                    headers: {
                        token: Cookies.get('token'),
                    },
                    data: {
                        subjectName: res.data.subjectName
                    },
                    method: "POST",
                }).then(res => {
                    if (res.status === 200) {
                        let result = res.data
                        result = result.filter(item => questions.indexOf(item._id) < 0)
                        this.setState({
                            questionsBySubject: result
                        })
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        }).catch(err => {
            console.log(err)
        })
    }

    deleteQuestion = (questionId) => {
        const { examId } = this.state
        axios({
            baseURL: process.env.REACT_APP_baseURL,
            url: `/exam/${examId}/deleteQuestion`,
            headers: {
                token: Cookies.get('token')
            },
            method: "PATCH",
            data: {
                questionId: questionId
            }
        }).then(res => {
            if (res.status === 200) {
                let temp = this.state.questions.filter((item, index) => {
                    return item._id !== questionId
                })
                this.setState({
                    questions: temp
                })
            }
        }).catch(err => {
            console.log(err)
            window.location.reload()
        })
    }

    render() {
        const { subjectName, questions, questionsBySubject, examId } = this.state
        return (
            <div className="InExamTeacher container mt-5">
                <div className="d-flex">
                    <CreateQuestion
                        subjectName={subjectName && subjectName}
                    />
                    <QuestionLibrary
                        questionsBySubject={subjectName && questionsBySubject}
                        examId = {examId}
                    />
                </div>

                <ListGroup >
                    {
                        questions.map((question, index) =>
                            <ListGroupItem key={index} className="d-flex flex-column">
                                <TiDelete
                                    style={{ cursor: "pointer", fontSize: "25px" }}
                                    className="text-danger ml-auto"
                                    onClick={() => this.deleteQuestion(question._id)}
                                />
                                <p><b>Question {index + 1}: </b>{question.question}</p>
                                <p>Type: {question.category}</p>
                                {
                                    question.category === "multiChoice" &&
                                    question.choices.map((choice, indexChoice) =>

                                        <div key={indexChoice}>
                                            <input
                                                type="checkbox"
                                                checked={question.answers.indexOf(indexChoice) > -1 ? true : false}
                                                disabled
                                            />
                                            <span>{choice}</span>
                                        </div>
                                    )
                                }
                                {
                                    question.category === "singleChoice" &&
                                    question.choices.map((choice, indexChoice) =>

                                        <div key={indexChoice}>
                                            <input
                                                type="radio"
                                                checked={question.answers.indexOf(indexChoice) > -1 ? true : false}
                                                disabled
                                            />
                                            <span>{choice}</span>
                                        </div>
                                    )
                                }
                            </ListGroupItem>
                        )
                    }
                </ListGroup>
            </div>
        )
    }
}

export default InExamTeacher