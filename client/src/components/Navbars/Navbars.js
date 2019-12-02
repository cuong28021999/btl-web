import React, { Component } from 'react'

import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Input,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';

import { MdEmail, MdLock } from 'react-icons/md'

import { LoginContext } from '../../contexts/Login'

import Cookies from 'js-cookie'

class Navbars extends Component {
    render() {
        const userId = Cookies.get('userId')
        return (
            <div className="Navbars">
                <Navbar color="light" light expand="md">
                    <NavbarBrand href="/">Test Awesome</NavbarBrand>
                    <Nav navbar className="d-flex mr-auto">
                        <NavItem>
                            <NavLink href="/">Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/about">About</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href={`/${userId}/class`}>Class</NavLink>
                        </NavItem>
                    </Nav>
                    <Nav>
                        <LoginContext.Consumer>
                            {
                                ({ handleEmail, handlePassword, onLogin, onLogout, isLogin }) => {
                                    if (!isLogin)
                                        return (
                                            <form
                                                onSubmit={onLogin}
                                                className="d-flex"
                                            >
                                                <InputGroup>
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText><MdEmail /></InputGroupText>
                                                    </InputGroupAddon>
                                                    <Input
                                                        name="email"
                                                        type="text"
                                                        placeholder="Email"
                                                        onChange={handleEmail}
                                                        required
                                                    />
                                                </InputGroup>
                                                <InputGroup className="mx-2">
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText><MdLock /></InputGroupText>
                                                    </InputGroupAddon>
                                                    <Input
                                                        name="password"
                                                        type="password"
                                                        placeholder="Password"
                                                        onChange={handlePassword}
                                                        required
                                                    />
                                                </InputGroup>
                                                <input
                                                    type="submit"
                                                    className="btn btn-primary"
                                                    value="Login"
                                                />
                                            </form>
                                        )
                                    else return (
                                        <UncontrolledDropdown nav inNavbar>
                                            <DropdownToggle nav caret>
                                                {`${Cookies.get('username')} (${Cookies.get('permission')})`}
                                            </DropdownToggle>
                                            <DropdownMenu right>
                                                <DropdownItem
                                                    href={`/${userId}/profile`}
                                                >
                                                    Profile
                                                </DropdownItem>
                                                <DropdownItem divider />
                                                <DropdownItem
                                                    className="bg-danger text-light"
                                                    onClick={onLogout}
                                                >
                                                    Logout
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    )
                                }
                            }
                        </LoginContext.Consumer>
                        <NavItem>
                            <a href="/register" className="btn btn-danger ml-3">Register</a>
                        </NavItem>
                    </Nav>
                </Navbar>
            </div>
        )
    }
}

export default Navbars;