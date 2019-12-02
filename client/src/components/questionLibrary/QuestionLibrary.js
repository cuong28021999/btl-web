import React, { Component } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, ListGroupItem, ListGroup } from 'reactstrap';

import axios from 'axios'
import Cookies from 'js-cookie'

export default class QuestionLibrary extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modal: false,
            className: '',
            maxMember: '',
            questionsBySubject: this.props.questionsBySubject
        }
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal,
            questionsBySubject: this.props.questionsBySubject
        })
    }

    onAddQuestionToExam = (questionId) => {
        const { examId } = this.props
        const {questionsBySubject} = this.state
        

        axios({
            baseURL: process.env.REACT_APP_baseURL,
            url: `/exam/${examId}/addQuestion`,
            headers: {
                token: Cookies.get('token')
            },
            method: "PATCH",
            data: {
                questionId: questionId
            }
        }).then(res => {
            if (res.status === 200) {
                alert('Add done')
                let temp = questionsBySubject
                temp = temp.filter(item => item._id !== questionId)
                this.setState({
                    questionsBySubject: temp
                })
            }
        }).catch(err => {
            console.log(err)
            window.location.reload()
        })
    }

    render() {
        const { modal, questionsBySubject } = this.state
        const { toggle } = this
        return (
            <div>
                <Button color="danger" onClick={toggle} className="ml-auto">Library</Button>
                <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>Modal title</ModalHeader>
                    <ModalBody style={{height: "50vh"}}>
                        <ListGroup style={{ overflowY: "scroll", height: "50vh" }} >
                            {
                                questionsBySubject && questionsBySubject.map((question, index) =>
                                    <ListGroupItem key={index} className="d-flex flex-column">
                                        <p><b>Question: </b>{question.question}</p>
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
                                        <button
                                            className="btn btn-primary ml-auto"
                                            onClick={() => this.onAddQuestionToExam(question._id)}
                                        >
                                            get
                                        </button>
                                    </ListGroupItem>
                                )
                            }
                        </ListGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => {
                            toggle()
                            window.location.reload()
                        }}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )

    }
}