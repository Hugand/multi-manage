import React from 'react'
import AddFields from '../ModalComponents/AddFields'
import ModalBox from '../ModalBox'

import {connect} from 'react-redux'

class TablesManageComponent extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            dataFields: <AddFields />
        }
    }
    
    handleRowClick = (tableId) => {
        window.location.href = "/viewrow?type=manage_tables&tableId="+tableId
    }

    toggleModal = () => {
        const { showModal } = this.state
        this.setState({
            showModal: !showModal
        })
    }
    
    render(){
        return (
            <div id="content">
                <ModalBox dataFields={this.state.dataFields} isShown={this.state.showModal} toggleModal={this.toggleModal}/>

                <h1>{ this.state.tableName }</h1>
                <div className="actions">
                    <button className="btn" onClick={this.toggleModal}>Add item</button>
                    <input type="text" className="txt-field" placeholder="search"/>
                </div>

                {(this.props.tablesData !== undefined && this.props.tablesData !== null) ?
                    <table>
                        <thead>
                            <tr><th>Table name</th></tr>
                        </thead>

                        <tbody>
                            {this.props.tablesData.map((table, i) => 
                                <tr key={table.tableName} onClick={() => this.handleRowClick(table.tableId, table.tableName)}>
                                    <td>{table.tableName}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                : ""}

            </div>
        )
    }
}

const mapStateToProps = state => {
  return {
    userData: state.userData,
    tablesData: state.tablesData
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export const TablesManage = connect(
  mapStateToProps,
  mapDispatchToProps
)(TablesManageComponent)