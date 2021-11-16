import React, {useState} from 'react'
import ReactDOM from 'react-dom'
import AutoComp from '../autocomp'
import './DevApp.less'

const root = document.getElementById('root')

function DevApp() {

    return (
        <div className="dev-app">
            <div className="dev-app__container t2-padding">
                <AutoComp/>
            </div>
        </div>
    )
}

ReactDOM.render(<DevApp/>, root)
