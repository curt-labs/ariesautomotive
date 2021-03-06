import React, { Component, PropTypes } from 'react';
import s from './Footer.scss';
import cx from 'classnames';
import withStyles from '../../decorators/withStyles';
import { brand } from '../../config';
import footer from '../../data/footer';
import SiteStore from '../../stores/SiteStore';
import connectToStores from 'alt-utils/lib/connectToStores';

@withStyles(s)
@connectToStores
class Footer extends Component {

	static propTypes = {
		contentMenus: PropTypes.array,
	}

	static getStores() {
		return [SiteStore];
	}

	static getPropsFromStores() {
		return SiteStore.getState();
	}

	getYear() {
		return new Date().getFullYear();
	}

	renderFooterNav() {
		const customContent = [];
		if (this.props.contentMenus && this.props.contentMenus.length > 0) {
			this.props.contentMenus.map((content, i) => {
				const path = `/page/${content.id}`;
				if (content.title && (content.requireAuthentication === undefined || content.requireAuthentication === false)) {
					customContent.push(<li key={i}><a href={path} title={content.title}>{content.title.toUpperCase()}</a></li>);
				}
			});
		}
		return (
			<ul className={cx(s.nav, 'nav')}>
				{footer.links.map((link, i) => {
					return (
						<li key={i} className={s.item}><a href={link.href} title={link.title} target={(link.target ? link.target : '_self')}>{link.value}</a></li>
					);
				})}
				{customContent}
			</ul>
			);
	}

	render() {
		const styles = {
			background: "url('https://storage.googleapis.com/luverne/website/misc-images/footerBackground.png')",
		};
		return (
			<footer>
				<div className={cx(s.root, 'row', 'footer-outer-row')} style={styles}>
					<div className={cx('container', s.container)}>
						<div className={cx('col-xs-12', 'col-sm-3', 'col-md-3', 'col-lg-3')}>
							<h4>REACH US</h4>
							<address itemScope itemType="//schema.org/Organization">
								<div className={s.phoneNumber}>
									<img src="https://storage.googleapis.com/aries-website/site-assets/phone.png" alt="phone image" />
									<span className={s.phone}>
										CALL
										<a itemProp="telephone" href="tel:+18772878634" title="Call Us (877) 287-8634">
											(888) 265-5615
										</a>
									</span>
								</div>
								<span itemProp="name" className={s.addressName}>{brand.name}</span>
								<div className={s.addressInfo} itemProp="address" itemScope itemType="//schema.org/PostalAddress">
									<span itemProp="streetAddress">6208 Industrial Drive</span>
									<br />
									<span itemProp="addressLocality">Eau Claire,</span>
									<span itemProp="addressRegion">WI</span>
									<span itemProp="postalCode">54701</span>
								</div>
							</address>
						</div>
						<div className={cx('col-xs-6', 'col-sm-3', 'col-md-2', 'col-lg-2', s.footerNav)}>
							{this.renderFooterNav()}
						</div>
						<div className="col-xs-6 col-sm-3 col-md-4 col-lg-3">
							<div className={cx('row', 'col-lg-10', 'col-md-10', 'col-xs-8', s.social)}>
								<h4 className="hidden-xs hidden-sm">GET THE LATEST</h4>
								<div className="col-xs-12 col-md-12 col-lg-12">
									<a href={brand.facebook.link} title="Visit us on Facebook">
										<img src="https://storage.googleapis.com/aries-website/site-assets/facebook-icon.png" alt="Facebook Logo" />
									</a>
									<a href={`https://twitter.com/${brand.twitter}`} title="Visit us on Twitter">
										<img src="https://storage.googleapis.com/aries-website/site-assets/twitter-icon.png" alt="Twitter Logo" />
									</a>
									<a href={`http://www.youtube.com/user/${brand.youtube}`} title="Visit us on YouTube">
										<img src="https://storage.googleapis.com/aries-website/site-assets/youtube-icon.png" alt="YouTube Logo" />
									</a>
								</div>
							</div>
							<div className="row col-lg-2 col-md-2 col-xs-4">
								<div className={s.semaLogo}>
									<a href="http://www.sema.org" title="SEMA Website">
										<img src="https://storage.googleapis.com/aries-website/site-assets/sema-logo.png" width="64px" alt="SEMA Logo" />
									</a>
								</div>
							</div>
						</div>
						<div className="col-xs-12 col-sm-3 col-md-3 col-lg-4">
							<img src={brand.footerLogo} alt={brand.name} className={cx('img-responsive', s.footerLogo)} />
							<div className={cx(s.footerclear, 'clearfix')}>&nbsp;</div>
							<br />
							<span className={s.conditions}>
								&copy;
								{brand.copyrightStart ? `${brand.copyrightStart} - ${this.getYear()}` : this.getYear()}
								{brand.name}
								<br />
								<a href="/terms" className={s.terms}>TERMS & CONDITIONS</a>
							</span>
							<br />
							<br />
							<span className={s.jiraFeedbackContainer}><a href="#" id="jirafeedback">PROVIDE FEEDBACK</a></span>
						</div>
					</div>
				</div>
				<div className={cx(s.root, 'row', 'footer-outer-row')} style={styles}>
					<div className={cx('container', s.container, s.brandsContainer)}>
						<ul className={s.brandsIcons}>
							<li className={cx(s.brandItem, s.groupLogoItem)}>
								<a href="https://curtgroup.com/" alt="CURT Group" target="_blank">
									<div className={s.fadeContainer}>
										<img className={cx(s.bottom, s.groupLogo)} src="https://storage.googleapis.com/curt-groups/CURT-Group-Logo.png" alt="CURT Group" title="CURT Group" />
										<img className={cx(s.top, s.groupLogo)} src="https://storage.googleapis.com/curt-groups/CURT-Group-Logo.png" alt="CURT Group" title="CURT Group" />
									</div>
								</a>
							</li>
							<li className={s.brandItem}>
								<a href="https://curtmfg.com/" alt="CURT Manufacturing" target="_blank">
									<div className={s.fadeContainer}>
										<img className={s.bottom} src="https://storage.googleapis.com/curt-groups/new-brand-logos/CURT-Logo-Orange.png" alt="CURT" title="CURT" />
										<img className={s.top} src="https://storage.googleapis.com/curt-groups/new-brand-logos/CURT-Logo-40-Grey.png" alt="CURT" title="CURT" />
									</div>
								</a>
							</li>
							<li className={s.brandItem}>
								<a href="http://ariesautomotive.com/" alt="ARIES Automotive" target="_blank">
									<div className={s.fadeContainer}>
										<img className={s.bottom} src="https://storage.googleapis.com/curt-groups/new-brand-logos/ARIES-Logo-Red.png" alt="ARIES" title="ARIES" />
										<img className={s.top} src="https://storage.googleapis.com/curt-groups/new-brand-logos/ARIES-Logo-40-Grey.png" alt="ARIES" title="ARIES" />
									</div>
								</a>
							</li>
							<li className={s.brandItem}>
								<a href="http://www.luvernetruck.com/" alt="Luverne Truck Equipment" target="_blank">
									<div className={s.fadeContainer}>
										<img className={s.bottom} src="https://storage.googleapis.com/curt-groups/new-brand-logos/LUVERNE-Logo-Blue.png" alt="LUVERNE" title="LUVERNE" />
										<img className={s.top} src="https://storage.googleapis.com/curt-groups/new-brand-logos/LUVERNE-Logo-40-Grey.png" alt="LUVERNE" title="LUVERNE" />
									</div>
								</a>
							</li>
							<li className={s.brandItem}>
								<a href="http://www.retracmirrors.com/" alt="Retrac Mirrors" target="_blank">
									<div className={s.fadeContainer}>
										<img className={s.bottom} src="https://storage.googleapis.com/curt-groups/new-brand-logos/RETRAC-Logo-White.png" alt="RETRAC" title="RETRAC" />
										<img className={s.top} src="https://storage.googleapis.com/curt-groups/new-brand-logos/RETRAC-Logo-40-Grey.png" alt="RETRAC" title="RETRAC" />
									</div>
								</a>
							</li>
							<li className={s.brandItem}>
								<a href="http://www.uwsta.com/" alt="UWS Truck Accessories" target="_blank">
									<div className={s.fadeContainer}>
										<img className={s.bottom} src="https://storage.googleapis.com/curt-groups/new-brand-logos/UWS-Logo-Blue.png" alt="UWS" title="UWS" />
										<img className={s.top} src="https://storage.googleapis.com/curt-groups/new-brand-logos/UWS-Logo-40-Grey.png" alt="UWS" title="UWS" />
									</div>
								</a>
							</li>
						</ul>
					</div>
				</div>
			</footer>
		);
	}

}

export default Footer;
