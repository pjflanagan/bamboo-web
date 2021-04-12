import React from 'react';

import { Header, Sidebar, SidebarItem } from '../../elements';
import { ChromeWebStoreLink } from '../../helpers';

import SplashOverlay from './splash-overlay/SplashOverlay.js';
import EditOverlay from './edit-overlay/EditOverlay.js'; // TODO: get rid of this
// FIXME: uncomment this just debugging FIXME: import WelcomeOverlay from './welcome-overlay/WelcomeOverlay.js';
// TODO: turn this into library
import Phrases from './phrases/Phrases.js'
import SubHeader from './sub-header/SubHeader.js';

import Style from './style.module.css';

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSplashOverlayOpen: true,
      isLoggedIn: false, // TODO: not necessary now that there are multiple pages
      editPhrase: {},
      filter: {},
      phraseAction: { // TODO:
        action: '', // ADD, REMOVE
        phrase: {} // PHRASE
      },
      numPhrases: 0, // TODO:
    }

    this.updateFilter = this.updateFilter.bind(this);
    this.setNeedsLoad = this.setNeedsLoad.bind(this);
    this.closeSplashOverlay = this.closeSplashOverlay.bind(this);
    this.setEditPhrase = this.setEditPhrase.bind(this);
    this.changePhraseAction = this.changePhraseAction.bind(this);
    this.logout = this.logout.bind(this);
    this.openChromeStore = this.openChromeStore.bind(this);

    // check if we are logged in, if not redirect
    // do this before the component mounts to avoid seeing any elements
    this.isLoggedIn();
  }

  componentDidMount() {
    this.confirmLogin();
  }

  // TODO: rename this and remove instance of it being used in logic?, a false will always redirect
  isLoggedIn() {
    const { mongodb } = this.props;
    if (!mongodb || !mongodb.isLoggedIn()) {
      window.location = '/login';
      return false;
    }
    return true;
  }

  confirmLogin() {
    const { mongodb } = this.props;
    if (mongodb.isLoggedIn()) {
      this.setState({
        needsLoad: true,
        isLoggedIn: true
      });
    }
    // TODO: wait for initial phrases to load before removing splash
    this.closeSplashOverlay();
  }

  logout() {
    this.props.mongodb.logout();
  }

  openChromeStore() {
    window.open(ChromeWebStoreLink, '_blank');
  }

  closeSplashOverlay() {
    this.setState({
      isSplashOverlayOpen: false
    });
  }

  changePhraseAction(phraseAction) {
    this.setState({
      phraseAction
    })
  }

  setNeedsLoad(needsLoad) {
    this.setState({
      needsLoad
    });
  }

  setEditPhrase(phrase) {
    this.setState({
      editPhrase: phrase
    });
  }

  updateFilter(newFilter, needsLoad) {
    this.setState({
      filter: newFilter,
      needsLoad
    });
  }

  render() {
    const { mongodb } = this.props;
    return (
      <div>
        <SplashOverlay
          isSplashOverlayOpen={this.state.isSplashOverlayOpen}
        />
        {/* <WelcomeOverlay /> */}
        <EditOverlay
          mongodb={mongodb}
          editPhrase={this.state.editPhrase}
          setEditPhrase={this.setEditPhrase}
          changePhraseAction={this.changePhraseAction}
        />
        <Header
          setEditPhrase={this.setEditPhrase}
          mongodb={mongodb}
          isLoggedIn={this.state.isLoggedIn}
          isLoading={this.state.needsLoad}
        />
        <Sidebar>
          <SidebarItem></SidebarItem>
        </Sidebar>
        <div
          className={Style.Container}
          hidden={!this.state.isLoggedIn}
        >
          <SubHeader
            updateFilter={this.updateFilter}
            phrasesCount={this.state.numPhrases}
          />
          <Phrases
            mongodb={mongodb}
            setEditPhrase={this.setEditPhrase}
            filter={this.state.filter}
            needsLoad={this.state.needsLoad}
            setNeedsLoad={this.setNeedsLoad}
            changePhraseAction={this.changePhraseAction}
            phraseAction={this.state.phraseAction}
          />
        </div>
      </div>
    );
  }
}

export default Main;
