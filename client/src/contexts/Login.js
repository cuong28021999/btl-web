import React, { Component } from 'react';
import axios from 'axios'
import Joi from '@hapi/joi'
import Cookies from 'js-cookie'

export const LoginContext = React.createContext()

export class LoginProvider  extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            password: '',
            isLogin: false,
        }
    }

    handleEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    handlePassword = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    onLogin = (event) => { 
        event.preventDefault()

        const { email, password } = this.state


        // validate on client
        const userSchema = Joi.object({
            email: Joi.string().required().min(6).max(255).email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
            password: Joi.string().min(6).max(1024).required()
        })

        const { error } = userSchema.validate({
            email: email,
            password: password
        })

        if (error) {
            return alert(error.details[0].message)
        }

        // was validate
        axios({
            baseURL: process.env.REACT_APP_baseURL,
            url: 'auth/login',
            method: 'POST',
            data: {
                email: email,
                password: password
            }
        }).then(res => {
            if (res.status === 200) {
                this.setState({
                    isLogin: true
                })
                Cookies.set('token', res.data.token, {expires: 1})
                Cookies.set('username', res.data.username, {expires: 1})
                Cookies.set('userId', res.data.userId, {expires: 1})
                Cookies.set('permission', res.data.permission, {expires: 1})
                window.location.replace('/')
            } else {
                this.setState({
                    isLogin: false
                })
            }
        }).catch(err => {
            this.setState({
                isLogin: false
            })
            alert('Login false')
        }) 
    }

    onLogout = () => {
        // delete cookies
        Cookies.remove('token')
        Cookies.remove('username')
        Cookies.remove('userId')
        Cookies.remove('permission')
        this.setState({
            isLogin: false,
            email: '',
            password: ''
        })
        window.location.replace('/register')
    }

    componentDidMount() {
        axios({
            baseURL: process.env.REACT_APP_baseURL,
            url: 'verifyToken',
            method: 'GET',
            headers: {
                token: Cookies.get('token')
            }
        })
        .then(res=> {
            if (res.status === 200) {
                this.setState({
                    isLogin: true
                })
            }
        })
    }

    render() {
        return (
            <LoginContext.Provider
                value={{
                    handleEmail: this.handleEmail,
                    handlePassword: this.handlePassword,
                    onLogin: this.onLogin,
                    error: this.state.error,
                    isLogin: this.state.isLogin,
                    onLogout: this.onLogout
                }}
            >
                {this.props.children}
            </LoginContext.Provider>
        )
    }
}