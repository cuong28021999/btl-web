// DOING TEST HERE

import React, { Component } from 'react'

import axios from 'axios'
import Cookies from 'js-cookie'

class InExamStudent extends Component {

    constructor(props) {
        super(props)

        this.examId = window.location.pathname.split('/exam/')[1]
        this.state = {
            exam: null,
            questions: [],
            index: 0,
            answers: []
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
                    exam: res.data
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
            }

        }).catch(err => {
            console.log(err)
        })
    }

    nextQuestion = () => {
        this.setState({
            index: this.state.index + 1,
            answers: []
        })
    }

    handleAnswer = (index, category) => {
        if (category === 'multiChoice') {
            let temp = this.state.answers

            if (document.getElementById(index).checked) {
                temp.push(index)
            } else {
                temp = temp.filter(item => item !== index)
            }

            this.setState({
                answers: temp
            })

            console.log(this.state.answers)
        }

        if (category === 'singleChoice') {
            let temp = []
            temp.push(index)
            this.setState({
                answers: temp
            })

            console.log(this.state.answers)
        }
    }

    checkResult = (category) => {
        const { index, answers, questions } = this.state
        if (category === 'multiChoice') {
            let check = true
            if (answers.length === 0) check = false
            answers.forEach((item, index) => {
                if (questions[index].answers.indexOf(item) < 0) {
                    check = false
                }
            })
            return alert(check)
        }

        if (category === 'singleChoice') {
            console.log('singleChoice')
            if (answers[0] === questions[index].answers[0]) {
                return alert(true)
            }
            else return alert(false)
        }
    }

    render() {
        const { questions, index } = this.state

        return (
            <div className="InExamStudent container mt-5 shadow rounded"
                style={{ height: "80vh" }}
            >
                {
                    questions[index] &&
                    <div
                        className="d-flex flex-column p-5 justify-content-between"
                        style={{ height: "80vh" }}
                    >
                        <div>
                            <p><b>Question: </b>{questions[index].question}</p>
                            {
                                questions[index].category === 'multiChoice' &&
                                <div>
                                    {
                                        questions[index].choices.map((choice, indexChoice) => {
                                            return (
                                                <div key={indexChoice}>
                                                    <input
                                                        id={indexChoice}
                                                        type="checkbox"
                                                        name="choices"
                                                        onClick={() => this.handleAnswer(indexChoice, 'multiChoice')}
                                                    />
                                                    <span> {choice}</span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            }

                            {
                                questions[index].category === 'singleChoice' &&
                                <div>
                                    {
                                        questions[index].choices.map((choice, indexChoice) => {
                                            return (
                                                <div key={indexChoice}>
                                                    <input
                                                        type="radio"
                                                        name="choices"
                                                        onClick={() => this.handleAnswer(indexChoice, 'singleChoice')}
                                                    />
                                                    <span> {choice}</span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            }
                        </div>
                        <div
                            className="d-flex"
                        >
                            <button
                                className="btn btn-warning ml-auto"
                                onClick={() => this.checkResult(questions[index].category)}
                            >Check</button>
                            <button
                                className="btn btn-danger ml-2"
                                onClick={() => this.nextQuestion()}
                            >next</button>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default InExamStudent