import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'

export default function verifyToken(ComponentToProtect) {
    return class extends Component {
        constructor(props) {
            super(props)
            this.state = {
                loading: true,
                redirect: false,
            }
        }

        componentDidMount() {
            axios({
                baseURL: process.env.REACT_APP_baseURL,
                url: "/verifyToken",
                headers: {
                    token: Cookies.get('token')
                },
                method: "GET",
            }).then(res => {
                if (res.status === 200) {
                    this.setState({ loading: false })
                }
            }).catch(err => {
                Cookies.remove('token')
                Cookies.remove('username')
                Cookies.remove('userId')
                Cookies.remove('permission')
                this.setState({ loading: false, redirect: true })
            });
        }
        
        render() {
            const { loading, redirect } = this.state
            if (loading) {
                return null
            }
            if (redirect) {
                return <Redirect to="/register" />
            }
            return (
                <React.Fragment>
                    <ComponentToProtect {...this.props} />
                </React.Fragment>
            );
        }
    }
}