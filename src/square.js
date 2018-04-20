import React,{Component} from 'react';


export default class Square extends Component {
    render(){
        return (
        <div className="square wall dark" id={this.props.id} ref={this.props.id}>
        </div>  
        )
    }
}