import React, { Component, PropTypes } from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';
import cx from 'classnames';
import bt from 'bootstrap/dist/css/bootstrap.css?root=./node_modules/bootstrap/dist/'; // eslint-disable-line import/no-unresolved, max-len
import s from './App.scss';
import Header from '../Header';
import Footer from '../Footer';

class App extends Component {

	static propTypes = {
		context: PropTypes.shape({
			insertCss: PropTypes.func,
			onSetTitle: PropTypes.func,
			onSetMeta: PropTypes.func,
			onPageNotFound: PropTypes.func,
			categories: PropTypes.array,
			vehicle: PropTypes.array,
			params: PropTypes.object,
			siteContents: PropTypes.array,
			siteMenu: PropTypes.array,
		}),
		children: PropTypes.element.isRequired,
		error: PropTypes.object,
	};

	static childContextTypes = {
		insertCss: PropTypes.func.isRequired,
		onSetTitle: PropTypes.func.isRequired,
		onSetMeta: PropTypes.func.isRequired,
		onPageNotFound: PropTypes.func.isRequired,
		seo: PropTypes.func.isRequired,
	};

	getChildContext() {
		const context = this.props.context;
		return {
			insertCss: context.insertCss || emptyFunction,
			onSetTitle: context.onSetTitle || emptyFunction,
			onSetMeta: context.onSetMeta || emptyFunction,
			onPageNotFound: context.onPageNotFound || emptyFunction,
			seo: context.seo || emptyFunction,
		};
	}

	componentWillMount() {
		this.removeBootstrap = this.props.context.insertCss(bt);
		this.removeCss = this.props.context.insertCss(s);
	}

	componentWillUnmount() {
		this.removeBootstrap();
		this.removeCss();
	}

	render() {
		const styles = {
			background: "url('https://storage.googleapis.com/aries-website/site-assets/bgtexture.png')",
		};

		const noticeStyles = {
			minHeight: '45px',
			backgroundColor: '#444',
			textAlign: 'center',
			color: 'white',
			padding: '10px',
			fontStyle: 'italic',
		};
		const noticeLink = {
			color: 'white',
			textDecoration: 'underline',
		};
		return (
			<div className={cx(s.root)} style={styles}>
				<Header context={this.props.context} />
				<div className="children">
					{this.props.children}
				</div>
				<Footer siteContents={this.props.context.siteContents} />
				<div style={noticeStyles}>
					<span>
						This Website will be deprecated as of November 1, 2020. Please visit our <a href="https://www.ariesautomotive.com" style={noticeLink}>New Website</a> and contact us if there are any missing features.
					</span>
				</div>
			</div>
		);
	}

}

export default App;
