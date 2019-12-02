import React, { Component } from 'react'
import {
    Collapse,
    Button,
    CardBody,
    Card,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Fade
} from 'reactstrap'

import axios from 'axios'
import Cookies from 'js-cookie'

export default class CreateQuestion extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isOpen: false,
            dropdownOpen: false,
            fadeIn: false,
            question: '',
            category: '',
            choice: '',
            choices: [],
            answers: []
        }

        this.choiceContentRef = React.createRef()
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    toggleDropdown = () => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        })
    }

    handleCategory = (type) => {
        this.setState({
            category: type,
            fadeIn: true,
            choice: '',
            choices: []
        })
    }

    handleQuestion = (event) => {
        this.setState({
            question: event.target.value
        })

        console.log(this.state.question)
    }

    handleTypeChoice = (event) => {
        this.setState({
            choice: event.target.value
        })
    }

    handleAnswers = (answer) => {

        if (this.state.category === 'singleChoice') {
            let temp = []
            temp.push(answer)

            this.setState({
                answers: temp
            })

            console.log(this.state.answers)
        }

        if (this.state.category === 'multiChoice') {
            let temp = this.state.answers

            if (document.getElementById(answer).checked) {
                temp.push(answer)
            } else {
                temp = temp.filter(item => item !== answer)
            }


            this.setState({
                answers: temp
            })

            console.log(this.state.answers)
        }
    }

    onAddChoice = () => {
        var temp = this.state.choices
        temp.push(this.state.choice)

        this.setState({
            choices: temp,
            choice: ''
        })

        this.choiceContentRef.current.value = ''
        this.choiceContentRef.current.focus()
        console.log(this.state.choices)
    }

    onCreate = (event) => {
        event.preventDefault()

        const {
            category,
            question,
            choices,
            answers
        } = this.state

        

        const examId = window.location.pathname.split('/exam/')[1]

        console.log(
            category,
            question,
            choices,
            answers
        )

        axios({
            baseURL: process.env.REACT_APP_baseURL,
            url: "/question",
            headers: {
                token: Cookies.get('token')
            },
            method: "POST",
            data: {
                category: category,
                question: question,
                choices: choices,
                answers: answers,
                examId: examId,
                subjectName: this.props.subjectName
            }
        }).then(res => {
            if (res.status === 200) {            
                console.log(res.data)
                window.location.reload()
            }
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        const { toggle, toggleDropdown } = this
        const {
            isOpen,
            dropdownOpen,
            fadeIn,
            category,
            choices
        } = this.state
        return (
            <div className="InExamTeacher container">
                <Button color="primary" onClick={toggle} style={{ marginBottom: '1rem' }}>Create question</Button>
                <Collapse isOpen={isOpen}>
                    <Card>
                        <CardBody>
                            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                                <DropdownToggle caret>
                                    Category
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem
                                        onClick={() => this.handleCategory('multiChoice')}
                                    >Multi choice</DropdownItem>
                                    <DropdownItem
                                        onClick={() => this.handleCategory('singleChoice')}
                                    >Single choice</DropdownItem>
                                    <DropdownItem
                                        onClick={() => this.handleCategory('sentence')}
                                    >Sentence</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>

                            <Fade in={fadeIn} tag="h5" className="mt-3">
                                {/* CATEGORY ROUTE */}


                                {
                                    category === 'sentence' &&
                                    <form
                                        onSubmit={event => this.onCreate(event)}
                                    >
                                        <h2>Sentence</h2>
                                        <div>
                                            <label htmlFor="">Question</label>
                                            <textarea
                                                id="question"
                                                onChange={event => this.handleQuestion(event)}
                                            >
                                            </textarea>
                                        </div>

                                        <input
                                            type="submit"
                                            value="create"
                                        />
                                    </form>
                                }
                                {
                                    category === 'singleChoice' &&
                                    <form
                                        onSubmit={event => this.onCreate(event)}
                                    >
                                        <h2>Single choice</h2>
                                        <div>
                                            <label htmlFor="">Question</label>
                                            <textarea
                                                id="question"
                                                onChange={event => this.handleQuestion(event)}
                                            >
                                            </textarea>
                                        </div>

                                        <input
                                            type="text"
                                            name="choice"
                                            onChange={(event) => this.handleTypeChoice(event)}
                                            ref={this.choiceContentRef}
                                            placeholder="Type choices..."
                                        />

                                        <input
                                            type="button"
                                            onClick={() => this.onAddChoice()}
                                            value="add"
                                        />

                                        {
                                            choices.length > 0 &&
                                            choices.map((choice, index) =>
                                                <div
                                                    key={index}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="answer"
                                                        onClick={() => this.handleAnswers(index)}
                                                    />
                                                    {choice}
                                                </div>
                                            )
                                        }

                                        <input
                                            type="submit"
                                            value="create"
                                        />
                                    </form>
                                }

                                {
                                    category === 'multiChoice' &&
                                    <form
                                        onSubmit={event => this.onCreate(event)}
                                    >
                                        <h2>Multi choice</h2>
                                        <div>
                                            <label htmlFor="">Question</label>
                                            <textarea
                                                id="question"
                                                onChange={event => this.handleQuestion(event)}
                                            >
                                            </textarea>
                                        </div>

                                        <input
                                            type="text"
                                            name="choice"
                                            onChange={(event) => this.handleTypeChoice(event)}
                                            ref={this.choiceContentRef}
                                            placeholder="Type choices..."
                                        />

                                        <input
                                            type="button"
                                            onClick={() => this.onAddChoice()}
                                            value="add"
                                        />

                                        {
                                            choices.length > 0 &&
                                            choices.map((choice, index) =>
                                                <div
                                                    key={index}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        name="answer"
                                                        id={index}
                                                        onClick={() => this.handleAnswers(index)}
                                                    />
                                                    {choice}
                                                </div>
                                            )
                                        }

                                        <input
                                            type="submit"
                                            value="create"
                                        />
                                    </form>
                                }
                            </Fade>
                        </CardBody>
                    </Card>
                </Collapse>
            </div>
        )
    }
}