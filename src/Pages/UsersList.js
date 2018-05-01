import React, { Component } from 'react';
import { connect } from 'react-redux';
import {fetchUsers, moreUsers, fetchGroups} from '../Actions/List';
import {addUser} from '../Actions/Create';
import {deleteUser} from '../Actions/Update';
import {handleModal} from "../Actions/Global";

import UserModal from '../Components/UserModal';

class UsersList extends Component {
    constructor(props){
        super(props);
        this.state = {
            skip: 0,
            perPage: 24,
            inPage: 24,
            loading: false,
            msgContent: null,
            msgType: null,
            Fullname: "",
            email: "",
            group: "",
            userupdates: props.userupdates
        };
        this.loadMore = this.loadMore.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.editUser = this.editUser.bind(this);
    }
    loadMore(){
        this.setState({skip: this.state.skip + this.state.perPage, inPage: this.state.inPage + this.state.perPage}, function () {
            this.props.moreUsers(this.state.skip , this.state.perPage);
        });
    }
    handleInput(e) {
        this.setState({ [e.target.name]: e.target.value.replace(/(<([^>]+)>)/ig,"")});
    }
    handleDelete(userid){
        this.props.deleteUser(userid);
    }
    handleSubmit(e) {
        e.preventDefault();
        const { Fullname, email, group } = this.state;
        if(!Fullname){
            this.setState({msgContent: 'Please enter Full Name', msgType: 'alert error'})
        }else if(!email){
            this.setState({msgContent: 'Please provide email address', msgType: 'alert error'})
        }else if(!group){
            this.setState({msgContent: 'Please select group', msgType: 'alert error'})
        }else{
            this.setState({loading: true}, function(){
                this.props.addUser({Fullname, email, group});
            })
        }
    }
    editUser(user){
        this.props.handleModal(user);
    }
    componentDidMount(){
        this.props.fetchUsers(this.state.skip , this.state.perPage);
        this.props.fetchGroups();
        window.scrollTo(0, 0);
    }
    static getDerivedStateFromProps(props, state) {
        if(props.userupdates && props.userupdates !== state.userupdates){
            window.scrollTo(0, 0);
            if(props.userupdates.code === 200){
                props.fetchUsers(state.skip , state.perPage);
                return{
                    msgContent: props.userupdates.message,
                    msgType: 'alert success',
                    userupdates: props.userupdates,
                    loading: false,
                    Fullname: "",
                    email: "",
                    group: ""
                }
            }else{
                return{
                    msgContent: props.userupdates.error,
                    msgType: 'alert error',
                    userupdates: props.userupdates,
                    loading: false
                }
            }
        }else{
            return null;
        }
  }
    render() {
        const users = this.props.users;
        const groups = this.props.groups;
        let loadMore = users.length === this.state.inPage;
        return (
            <div className="list-page">
                {this.state.msgContent &&
                <div className={this.state.msgType} role="alert">
                    {this.state.msgContent}
                </div>
                }
                <div className="wrap">
                    <div className="col-half">
                        <div className="card">
                            <div className="card-header">
                                <i className="fa fa-align-justify"></i> Users List
                            </div>
                            <div className="card-body">
                                <table className="table table-responsive-sm">
                                    <thead>
                                        <tr>
                                            <th>Full Name</th>
                                            <th>Email</th>
                                            <th>Group</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user)=>
                                         <tr key={user._id}>
                                            <td>{user.Fullname}</td>
                                            <td>{user.email}</td>
                                            <td>{user.group.title}</td>
                                            <td>
                                                <button className="btn btn-primary" onClick={()=> this.editUser(user)}><i className="fa fa-edit"></i></button>
                                                <button 
                                                className="btn btn-danger"
                                                onClick={() => { if (window.confirm('Are you sure to delete this user?')) this.handleDelete(user._id) } }><i className="fa fa-trash"></i></button>
                                            </td>
                                        </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {loadMore &&
                            <div className="card-footer">
                                <button type="button" className="btn btn-sm btn-success"><i className="fa fa-more"></i> Load more</button>
                            </div>
                            }
                        </div>
                    </div>

                    <div className="col-half">
                        <div className="card">
                            <form className="form-horizontal" onSubmit={this.handleSubmit}>
                                <div className="card-header">
                                    <i className="fa fa-user-plus"></i> Add User
                                </div>
                                <div className="card-body">
                                    <div className="form-group wrap">
                                        <div className="col-full">
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text"><i className="fa fa-user"></i></span>
                                                </div>
                                                <input 
                                                    onChange={this.handleInput} 
                                                    value={this.state.Fullname} 
                                                    name="Fullname" 
                                                    className="form-control form-control-lg" 
                                                    placeholder="Full Name" 
                                                    type="text" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group wrap">
                                        <div className="col-full">
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text"><i className="fa fa-envelope"></i></span>
                                                </div>
                                                <input 
                                                    onChange={this.handleInput} 
                                                    value={this.state.email} 
                                                    name="email" 
                                                    className="form-control form-control-lg" 
                                                    placeholder="Email" 
                                                    type="email" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group wrap">
                                        <div className="col-full">
                                            <div className="input-group">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text"><i className="fa fa-users"></i></span>
                                                </div>
                                                <select onChange={this.handleInput} 
                                                name="group" 
                                                defaultValue={this.state.group}
                                                className="form-control form-control-lg">
                                                    <option value="">Select Group</option>
                                                    {groups.map((group)=>
                                                    <option value={group._id} key={group._id}>{group.title}</option>
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer">
                                {this.state.loading ?(
                                    <button type="button" className="btn btn-success loading" disabled><i className="fas fa-sync-alt fa-spin"></i></button>
                                ):(
                                    <button type="submit" className="btn btn-success"><i className="far fa-dot-circle"></i> Submit</button>
                                )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <UserModal />
            </div>
        )
    }
}
                
function mapStateToProps(globalState) {
    return {
        users: globalState.users,
        groups: globalState.groups,
        userupdates: globalState.userupdates
    };
}

export default connect(mapStateToProps, {fetchUsers, moreUsers, addUser, fetchGroups, deleteUser, handleModal})(UsersList);