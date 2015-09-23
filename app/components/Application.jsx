import React, { Component, PropTypes } from 'react'
import LoginBox from './LoginBox'
import LoadingScreen from './LoadingScreen'
import PasswordSelector from './PasswordSelector'
import ClipboardCountdown from './ClipboardCountdown'
import { connect } from 'react-redux'
import { HotKeys } from 'react-hotkeys'

import fetchPasswordList from '../actions/fetchPasswordList'
import requestPathDialog from '../actions/requestPathDialog'
import copyPassword from '../actions/copyPassword'

class Application extends Component {
  render () {
    const {
      dispatch,
      isUnlocked,
      isUnlocking,
      path,
      clipboard,
      passwordList
    } = this.props

    let mainComponent

    if (isUnlocked) {
      mainComponent = (
        <div>
          <ClipboardCountdown clipboardTimer={ clipboard } />
          <PasswordSelector copyPassword={ uuid => dispatch(copyPassword(uuid)) }
                            passwords={ passwordList } />
        </div>
      )
    } else if (isUnlocking) {
      mainComponent = (
        <LoadingScreen />
      )
    } else {
      mainComponent = (
        <LoginBox submitMasterKey={ key => dispatch(fetchPasswordList(key)) }
                  requestPathDialog={ () => dispatch(requestPathDialog()) }
                  path= { path }
                  isSubmitting={ isUnlocking } />
      )
    }

    let globalKeyHandlers = {
      'esc': () => {
        if (process.env.MENUBAR) {
          console.log('close this window')
        }
      }
    }

    return (
      <HotKeys keyMap={{}} handlers={ globalKeyHandlers }>
        {mainComponent}
      </HotKeys>
    )
  }
}

Application.propTypes = {
  dispatch: PropTypes.function,
  isUnlocked: PropTypes.bool,
  isUnlocking: PropTypes.bool,
  path: PropTypes.string,
  clipboard: PropTypes.obj,
  passwordList: PropTypes.array
}

export default connect(state => state)(Application)
