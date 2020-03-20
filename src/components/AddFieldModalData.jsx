import React from 'react'
import { MdEdit } from "react-icons/md";
import {IoIosRemoveCircleOutline, IoIosAdd} from 'react-icons/io'
import Checkbox from 'react-checkbox-component'
import { getSessionCookie, ORG_TOKEN, USER_TOKEN, deleteSessionCookies } from '../helpers/session/auth'

function getUrlParams(url) {
	var params = {};
	var parser = document.createElement('a')
	parser.href = url
	var query = parser.search.substring(1)
	var vars = query.split('&')
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=')
		params[pair[0]] = decodeURIComponent(pair[1])
	}
	return params
}


class AddFieldModalData extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            fieldName: "",
            fieldType: 'text',
            selectData: [],
            displayTable: true,
            selectFieldValue: ""
        }
    }

    handleSelectFieldValueChange = (e) => this.setState({selectFieldValue: e.target.value})
    handleFieldNameChange = (e) => this.setState({fieldName: e.target.value})
    handleFielTypeChange = (e) => this.setState({fieldType: e.target.value})
    handleCheckboxChange = (e) => this.setState((state) => ({displayTable: !state.displayTable}))
    addSelectValue = (e) => (this.state.selectFieldValue !== '') ? this.setState((state) => ({
            selectData: [...state.selectData, state.selectFieldValue],
            selectFieldValue: ""
        })) : null
    
    removeSelectDataValue = (removeIndex) => {
        let {selectData} = this.state
        selectData.splice(removeIndex, 1)

        this.setState({
            selectData: selectData
        })
    }

    submitUpdate = (e) => {
        console.log(this.state.modalFieldData)
        this.setState({dataSubmited: true})
        fetch('https://us-central1-multi-manage.cloudfunctions.net/addTableField', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orgId: getSessionCookie(ORG_TOKEN),
                    tableId: getUrlParams(window.location.href).tableId,
                    // rowData: JSON.stringify(this.state.modalFieldData),
                    tokenId: getSessionCookie(USER_TOKEN),
                    // rowIndex: parseInt(getUrlParams(window.location.href).rowIndex)
                    fieldName: this.state.fieldName,
                    fieldType: this.state.fieldType,
                    selectData: this.state.selectData,
                    displayTable: this.state.displayTable,
                }),
            })
            .then(res => {
                console.log(res)
                if(res.json().status === "deauth"){
                    deleteSessionCookies()
                }
                window.location.reload(false)
            })
            .catch(err => {
                throw err
            })
    }

    render(){
        return (
            <div>
                <h1>Create field</h1>
                <form onSubmit={async (e) =>  {
                    e.preventDefault()
                }}>
                    <div>
                        <input type="text" name="fieldName" value={this.state.fieldName} onChange={this.handleFieldNameChange} placeholder="Field name" className="txt-field"/>
                        <h3>Field type</h3>
                        <div id="field-type-radio-group">
                            <input type="radio" onChange={this.handleTypeChange}
                                checked={this.state.fieldType === 'text'} onChange={this.handleFielTypeChange} value="text" id="text" name="field-type"/>
                            <label for="text">Text</label>
                            <input type="radio" onChange={this.handleTypeChange}
                                checked={this.state.fieldType === 'date'} onChange={this.handleFielTypeChange} value="date" id="date" name="field-type"/>
                            <label for="date">Date</label>
                            <input type="radio" onChange={this.handleTypeChange}
                                checked={this.state.fieldType === 'time'} onChange={this.handleFielTypeChange} value="time" id="time" name="field-type"/>
                            <label for="time">Time</label>
                            <input type="radio" onChange={this.handleTypeChange}
                                checked={this.state.fieldType === 'number'} onChange={this.handleFielTypeChange} value="number" id="number" name="field-type"/>
                            <label for="number">Number</label>
                            <input type="radio" onChange={this.handleTypeChange}
                                checked={this.state.fieldType === 'select'} onChange={this.handleFielTypeChange} value="select" id="select" name="field-type"/>
                            <label for="select">Select</label>
                            <input type="radio" onChange={this.handleTypeChange}
                                checked={this.state.fieldType === 'checkbox'} onChange={this.handleFielTypeChange} value="checkbox" id="checkbox" name="field-type"/>
                            <label for="checkbox">Checkbox</label>
                        </div>

                        {
                            (this.state.fieldType === 'select') ? 
                                <div>
                                    <h3>Select Field Values</h3>
                                        <div id="select-values">
                                            <div id="select-values-container">
                                                {this.state.selectData.map((value, i) => 
                                                    <div className="chip">{value}
                                                        <button className="remove-btn" onClick={() => {
                                                            this.removeSelectDataValue(i)
                                                        }}><IoIosRemoveCircleOutline /></button></div>
                                                )}
                                            </div>
                                            <div id="select-values-inputs">
                                                <input type="text" className="txt-field" placeholder="Select value" value={this.state.selectFieldValue}
                                                    /* onKeyDown={this.handleSelectValueKeyDown} */ onChange={this.handleSelectFieldValueChange}/>
                                                <button className="btn" onClick={this.addSelectValue} disabled={this.state.selectFieldValue === ''}>Add value</button>
                                            </div>
                                        </div>
                                </div>
                            : ""
                        }

                        <div className="table-display">
                            <Checkbox size="small" onChange={this.handleCheckboxChange} color="#11152f" isChecked={this.state.displayTable}/>
                            <label>Display in dashboard table</label>
                        </div>
                    </div>
                                            
                    <input type="submit" className="btn" disabled={this.state.dataSubmited} onClick={this.submitUpdate} value="Submit changes"/>
                </form>
            </div>
        )
    }
}

export default AddFieldModalData