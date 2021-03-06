import React, { Component, PropTypes } from 'react';
import s from './NotFoundPage.scss';
import withStyles from '../../decorators/withStyles';

const title = 'Page Not Found';

@withStyles(s)
class NotFoundPage extends Component {

	static contextTypes = {
		onSetTitle: PropTypes.func.isRequired,
		onPageNotFound: PropTypes.func.isRequired,
		seo: PropTypes.func.isRequired,
	};

	componentWillMount() {
		this.context.onSetTitle(title);
		this.context.onPageNotFound();
		const seo = {
			title,
		};
		this.context.seo(seo);
	}

	render() {
		return (
			<div className={s.root}>
				<h1>{title}</h1>
				<p>Sorry, but the page you were trying to view does not exist.</p>
			</div>
		);
	}

}

export default NotFoundPage;
