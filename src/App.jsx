import React from 'react';
import './css/App.css';
import './css/Dashboard.scss';
import {Navbar} from './components/Navbar'
import CustomTable from './components/TableDataComponents/CustomTable'
import {TablesManage} from './components/TableDataComponents/TablesManage'
import {UsersManage} from './components/TableDataComponents/UsersManage'

import {connect} from 'react-redux'
import {updateUserData, updateTablesData} from './actions.js'
import { deleteState } from './localStorage.js'
import { deleteSessionCookies, getSessionCookie, ORG_TOKEN, USER_TOKEN } from './helpers/session/auth.js'

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

class App extends React.Component {

  constructor(props){
    super(props)
    const params = getUrlParams(window.location.href)
    this.state = {
      tableId: params.tableId,
    }

    if((this.state.tableId === 'manage_tables' || this.state.tableId === 'manage_users') && this.props.userData.admin === false)
      window.location = "/"

    if(this.state.tableId === undefined)
      if(this.props.tablesData.length === 0)
      fetch('https://ugomes.com/mm-api/getNavbarTablesData?orgId='+getSessionCookie(ORG_TOKEN), {
          method: 'GET',
          headers: {"x-access-token": getSessionCookie(USER_TOKEN)},
        })
          .then(res => {
              switch(res.status){
                case 200:
                    return res
                case 401:
                    deleteSessionCookies()
                    deleteState()
                    window.location.reload(false)
                    break
                case 403:
                    window.location = "/"
                    break
                default:
              }
          })
         .then(res => res.json())
          .then(res => {
              if(res.status === "deauth"){
                  deleteSessionCookies()
                  deleteState()
                  window.location.reload(false)
              }
              return res
          })
          .then(res => {
              this.props.updateTables(res)
              if(this.props.tablesData.length > 0)
                window.location = "/?tableId="+this.props.tablesData[0].tableId
          })
          .catch(err => {
              if(err.status === "deauth"){
                console.log("dsad")
                deleteSessionCookies()
                deleteState()
                window.location.reload(false)
              }else
                throw err
          })
      else if(this.props.tablesData.length > 0)
        window.location = "/?tableId="+this.props.tablesData[0].tableId

  }

  render(){
    return (
      <div className="App">
        <Navbar />
        {
          (this.state.tableId === 'manage_tables') ?
            <TablesManage/>
          : (this.state.tableId === 'manage_users') ?
            <UsersManage />
          : (this.state.tableId === undefined) ?
            <div id="content">
              <h1 style={{"margin": "auto"}}>No tables available</h1>
            </div>
          : <CustomTable tableId={this.state.tableId}/>
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userData: state.userData,
    tablesData: state.tablesData
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateUser: (newUserData) => dispatch(updateUserData(newUserData)),
    updateTables: (newTableData) => dispatch(updateTablesData(newTableData))
  }
}

export const AppComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
