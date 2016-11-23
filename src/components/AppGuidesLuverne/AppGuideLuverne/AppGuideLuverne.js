import React, { Component, PropTypes } from 'react';
import s from './AppGuideLuverne.scss';
import AppGuideActions from '../../../actions/AppGuideActionsLuverne';
import AppGuideStore from '../../../stores/AppGuideStoreLuverne';
import withStyles from '../../../decorators/withStyles';
import cx from 'classnames';
import connectToStores from 'alt-utils/lib/connectToStores';
import { Glyphicon } from 'react-bootstrap';
import { brand } from '../../../config';

const cache = '61027060';

@withStyles(s)
@connectToStores
class AppGuideLuverne extends Component {

	static propTypes = {
		title: PropTypes.string,
		guide: PropTypes.object,
		page: PropTypes.number,
	};

	static contextTypes = {
		onSetTitle: PropTypes.func.isRequired,
		onPageNotFound: PropTypes.func.isRequired,
		onSetMeta: PropTypes.func.isRequired,
	};

	static defaultProps = {
		guides: [],
		guide: null,
	};

	constructor() {
		super();
		this.getAttr = this.getAttr.bind(this);
		this.renderBreadCrumbs = this.renderBreadCrumbs.bind(this);
	}

	componentWillMount() {
		const title = this.props.title;
		this.context.onSetTitle(title);
		this.context.onSetMeta('description', `${title} Application Guides`);
	}

	static getStores() {
		return [AppGuideStore];
	}

	static getPropsFromStores() {
		return AppGuideStore.getState();
	}

	getAttrs() {
		const output = [];
		if (!this.props.guide.name) {
			return null;
		}

		this.props.guide.finishes.map((finish, i) => {
			output.push(<th key={i}>{finish}</th>);
		});
		return output;
	}

	getAttr(application) {
		const appguideSlice = [];
		const attrToAppguide = {};
		let attrToSearch = [];
		attrToSearch = this.props.guide.finishes;

		attrToSearch.map((attr) => {
			attrToAppguide[attr] = [];
			application.parts.map((part, j) => {
				if (part.finish === attr) {
					const url = `/part/${part.part_number}`;
					const ins = `https://www.curtmfg.com/masterlibrary/01LUVERNE/${part.part_number}/installsheet/${part.part_number}.pdf`;
					const appguideCell = (<div key={j}><a href={url}>{part.part_number} - {part.short_description}</a><a href={ins} target="_blank"><Glyphicon glyph="wrench" className={s.wrench} /></a></div>);
					attrToAppguide[attr].push(appguideCell);
				}
			});
		});
		attrToSearch.map((attr) => {
			for (const i in attrToAppguide) {
				if (i === attr) {
					appguideSlice.push(<td key={i}>{attrToAppguide[i]}</td>);
				}
			}
		});
		return appguideSlice;
	}

	handlePagination(inc) {
		if (this.props.page && this.props.page === 0 && inc === -1) {
			return;
		}
		let currentPage = 0;
		if (this.props.page) {
			currentPage = this.props.page;
		}
		const page = currentPage + inc;
		AppGuideActions.set(this.props.guide.name, page);
	}

	renderBreadCrumbs() {
		if (this.props.guide) {
			return (
				[
					<li key="app"><a href={`/appguides`}>Application Guides</a></li>,
					<li key="apps" className="active">{this.props.guide ? this.props.title : null}</li>,
				]
			);
		}
		return <li key="apps" className="active">Application Guides</li>;
	}

	renderApplications() {
		return (
			<table className={cx('table table-hover table-bordered')}>
				<thead>
					<tr>
						<th>Make</th>
						<th>Model</th>
						<th>Body</th>
						<th>Box Length</th>
						<th>Cab Length</th>
						<th>Fuel Type</th>
						<th>Wheel Type</th>
						<th>Start Year</th>
						<th>End Year</th>
						{this.getAttrs()}
					</tr>
				</thead>
				<tbody>{this.renderApplicationRows()}</tbody>
			</table>
		);
	}

	renderApplicationRows() {
		const output = [];
		if (!this.props.guide.applications) {
			return null;
		}
		this.props.guide.applications.map((app, i) => {
			let attr = {};
			attr = this.getAttr(app);
			output.push(
				<tr key={i}>
					<td>{app.make}</td>
					<td>{app.model}</td>
					<td>{app.body}</td>
					<td>{app.boxLength}</td>
					<td>{app.cabLength}</td>
					<td>{app.fuelType}</td>
					<td>{app.wheelType}</td>
					<td>{app.min_year}</td>
					<td>{app.max_year}</td>
				{attr}</tr>);
		});
		return output;
	}

	renderPagination() {
		return (
			<div className={s.pagination}>
				{this.props.page > 0 ? <div className={s.left} onClick={this.handlePagination.bind(this, -1)}></div> : null}
				<div className={s.right} onClick={this.handlePagination.bind(this, 1)}></div>
			</div>
		);
	}

	renderDownloadLinks() {
		const guide = this.props.guide;
		if (guide === undefined || guide === null) {
			return <span></span>;
		}
		let page = this.props.guide.name;
		let render = false;
		page = (page) ? page.toLowerCase() : '';
		const links = [];
		if (guide.appGuide === undefined || guide.appGuide === null) {
			return <span></span>;
		}
		if (guide.appGuide.pdfPath) {
			const pdfLink = `${guide.appGuide.pdfPath}?cache=${cache}`;
			links.push(
				<a key={1} href={pdfLink} target="_blank" analytics-on="click" analytics-event={`${page}:pdf`}>
					<img src={'https://storage.googleapis.com/curt-icons/PDF-Icon-Aries.png'} alt="App Guide" className={cx('icon', s.appguideIcon)} />
				</a>
			);
			render = true;
		}
		if (guide.appGuide.xlsPath) {
			const xlsLink = `${guide.appGuide.xlsPath}?cache=${cache}`;
			links.push(
				<a key={2} href={xlsLink} target="_blank" analytics-on="click" analytics-event={`${page}:pdf`}>
					<img src={'https://storage.googleapis.com/curt-icons/Excel-Icon.png'} alt="App Guide" className={cx('icon', s.appguideIcon)} />
				</a>
			);
			render = true;
		}

		if (!render) {
			return null;
		}
		return (
			<div className={s.downloads}>
				<span className="heading">Download a Copy</span>
				{links}
			</div>
			);
	}

	render() {
		if (!this.props.guide) {
			return null;
		}
		return (
			<div className={s.appguideContainer}>
				<div className={s.breadcrumbContainer}>
					<ol className="breadcrumb">
						<li><a href="/">Home</a></li>
						{this.renderBreadCrumbs()}
					</ol>
				</div>
				<h1 className={s.header}>{this.props.title}</h1>
				<div className={s.install}>Click the <Glyphicon glyph="wrench"/> next to a product for installation instructions.</div>
				{this.renderDownloadLinks()}
				<p className={s.subheading}>The application guides below will help you determine which {brand.code} parts will fit your vehicle. Each app guide is category-specific and broken down by vehicle make, model, year and style.</p>
				{this.renderApplications()}
				{this.renderPagination()}
			</div>
		);
	}

}

export default AppGuideLuverne;
