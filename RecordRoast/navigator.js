// @flow

import React from 'react'
import {
  NavigationExperimental,
  StyleSheet,
  View,
  Platform,
  TouchableOpacity
} from 'react-native'
import shortid from 'shortid'
import { connect } from 'react-redux'
import SelectBeans from './SelectBeans'
import RecorderRoast from './index'
import Blend from './Blend'
import Melange from './Melange'
import Degrees from './Degrees'
import moment from 'moment'
import {
  Popup,
  Text,
  BackIcon,
} from 'panza'

import _ from 'lodash'

import type {
  BeanType
} from '../data/beans'

import {
  NavTouchableIcon,
  NavTitle,
  CloseIcon,
  NavTouchableText
} from 'panza'

import {
  addCoffee
} from '../actions/coffee'

const {
  CardStack,
  Header,
  Transitioner,
  StateUtils
} = NavigationExperimental

import {
  hideRecorder,
  showRecorder
} from '../actions/recorder'

/**
 * Record a Roast navigator
 */

type Props = {
  dispatch: Function;
  roast: Object;
}

type RouteType = {
  key: string;
  title?: string;
}

class RoastNavigator extends React.Component {

  props: Props;

  state: {
    navigation: Object;
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      navigation: {
        index: 0,
        routes: [
          { key: 'beans', title: 'Select beans' }
        ]
      }
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'RESET_ROAST'
    })
  }

  _back() {
    const popped = StateUtils.pop(this.state.navigation)
    if (popped !== this.state.navigation) {
      this.setState({ navigation: popped })
    }
  }

  _push(route: RouteType) {
    const pushed = StateUtils.push(this.state.navigation, route)
    if (pushed !== this.state.navigation) {
      this.setState({ navigation: pushed })
    }
  }

  _closeModal() {
    this.props.dispatch(hideRecorder)
  }

  _renderHeader(sceneProps: Object): ReactElement<any> {


    return (
      <Header
        {...sceneProps}
        style={{
          backgroundColor: '#e9e9ef',
          elevation: 0,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: 'rgba(0,0,0,0.25)'
        }}
        renderTitleComponent={(props) => {
          const { title } = props.scene.route
          if (title) {
            return <NavTitle>{title}</NavTitle>
          }
          // return (
          //   <Text>{}</Text>
          // )
        }}
        renderLeftComponent={(props) => {
          if (props.scene.index === 0 && Platform.OS === 'ios') {
            return (
              <NavTouchableIcon
                onPress={this._closeModal.bind(this)}
                accessibilityLabel='Close'>
                <CloseIcon color='black' size={40} />
              </NavTouchableIcon>
            )
          } else {
            return (
              <NavTouchableIcon
                accessibilityLabel='Close'
                onPress={() => {
                  if (props.scene.index === 0) {
                    this._closeModal()
                  } else {
                    this._back()
                  }
                }}>

                  <BackIcon color='black' size={25} />
              </NavTouchableIcon>
            )
          }

        }}
        onNavigateBack={() => {
          this._back()
        }}
        renderRightComponent={(props) => {
          if (props.scene.index === 0) {
            return (
              <NavTouchableText
                color='black'
                onPress={() => {
                  if (this.props.roast.beans.length > 1) {
                    this._push({
                      key: 'blend',
                      title: 'Blend details'
                    })
                  } else {
                    this._showRecorder()
                  }
                }}
                disabled={this.props.roast.beans.length === 0}
                bold>
                Next
              </NavTouchableText>
            )
          }

          const { index, routes } = props.navigationState
          const activeRoute = routes[index]
          if (activeRoute && activeRoute.key === 'blend') {
            let total = 0

            // ensure total === 100
            if (this.props.roast) {
              this.props.roast.beans.forEach(d => {
                total = total + d.percentage
              })
            }



            return (
              <NavTouchableText
                color='black'
                onPress={() => {
                  this._showRecorder()
                }}
                disabled={total < 99 || !this.props.roast.name.trim()}
                bold>
                  Next
                </NavTouchableText>
            )
          }

          if (activeRoute && activeRoute.key === 'recorder') {

            return (
              <NavTouchableText
                color='black'
                disabled={this.props.roast.isRecording}
                onPress={() => {
                  this._save()
                }}
                bold>
                  Finish
                </NavTouchableText>
            )
          }
        }}
      />
    )
  }

  render(): ReactElement<any> {
    return (
      <View style={styles.navigator}>
        <CardStack
          onNavigateBack={this._back.bind(this)}
          navigationState={this.state.navigation}
          renderHeader={this._renderHeader.bind(this)}
          renderScene={this._renderScene.bind(this)}
          style={styles.navigatorCardStack}
        />
      </View>
    )
  }

  _save() {
    const { roast } = this.props
    const cloned = _.clone(roast)

    // remove any fields with null
    cloned.roasts = cloned.roasts.map((r) => {
      r.other = r.other.filter(o => {
        if (o.value) return true
        return false
      })
      return r
    })

    console.log('save roast %o', cloned)
    this.props.dispatch(addCoffee(cloned._id, cloned))
    this._closeModal()
  }

  _showRecorder() {
    // we need to properly deal with out state here.
    const { roast } = this.props
    const isBlend = roast.beans.length > 1

    const { roasts } = roast
    if (roasts.length === 0) {
      // add an 'all' roast
      this.props.dispatch({
        type: 'QUEUE_ROAST_ADD',
        roast: {
          name: '',
          beans: roast.beans,
          date: moment.utc().format(),
          _id: shortid.generate(),
          other: [],
          cracks: []
        }
      })
    }

    this._push({
      key: 'recorder'
    })
  }

  _renderScene(sceneProps: Object): ReactElement<any> {
    const { routes, index } = sceneProps.navigationState
    const scene = routes[index]
    const { key } = scene


    switch (key) {
      case 'beans':
        return <SelectBeans />
      case 'blend':
        return (
          <Blend />
        )
      case 'recorder':
        return (
          <RecorderRoast />
        )
    }

    throw new Error('Route not found')
  }
}

function getState(state) {
  return {
    roast: state.roast
  }
}

export default connect(getState)(RoastNavigator)

const styles = StyleSheet.create({
  navigator: {
    flex: 1
  },
  navigatorCardStack: {
    flex: 20
  }
})
