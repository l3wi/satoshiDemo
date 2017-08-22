import React from "react"
import styled from "styled-components"
import Fab from "./fab"
import Wallet from "./wallet"
import Channel, { isWindow } from "../../libs/channel"

export default class extends React.Component {
  state = {
    balance: 0,
    drawerOpen: false
  }

  async componentDidMount() {
    var state = await store.get("state")
    var purchases = await store.get("purchases")

    console.log(state)

    this.setState({
      balance: state ? state.flash.balance : 0,
      state,
      purchases
    })
  }

  toggle = () => {
    var state = store.get("state")
    var purchases = store.get("purchases")

    console.log(state)
    this.setState({
      drawerOpen: !this.state.drawerOpen,
      balance: state.flash ? state.flash.balance : 0,
      state,
      purchases
    })
  }

  render() {
    isWindow()
    Channel.initialize()
    var { drawerOpen, balance } = this.state
    return (
      <div>
        <Wallet {...this.state} toggle={this.toggle} />
        <Fab balance={balance} toggle={this.toggle} />
      </div>
    )
  }
}
