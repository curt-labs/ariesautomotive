import React, { Component, PropTypes } from 'react';
import Link from '../Link';
import s from './VehicleResults.scss';
import CategorizedResult from './CategorizedResult';
import withStyles from '../../decorators/withStyles';
import VehicleStore from '../../stores/VehicleStore';
import CategoryStore from '../../stores/CategoryStore';
import connectToStores from 'alt-utils/lib/connectToStores';
// import VehicleStyle from './VehicleStyle';
// import Envision from './Envision';
// import Configurator from './Configurator';
import Configurator from './Envision/Configurator';

@withStyles(s)
@connectToStores
class VehicleResults extends Component {

	static propTypes = {
		className: PropTypes.string,
		activeIndex: PropTypes.number,
		vehicle: PropTypes.shape({
			base: PropTypes.shape({
				year: PropTypes.string,
				make: PropTypes.string,
				model: PropTypes.string,
			}),
			availableYears: PropTypes.array,
			availableMakes: PropTypes.array,
			availableModels: PropTypes.array,
			lookup_category: PropTypes.array,
			products: PropTypes.array,
		}),
		categories: PropTypes.array,
		fitments: PropTypes.array,
		error: PropTypes.object,
		envision: PropTypes.object,
		window: PropTypes.object,
	};

	constructor() {
		super();
		this.state = {
			activeKey: '0',
			activeCat: 0,
		};
		this.getMatched = this.getMatched.bind(this);
		this.createParentItem = this.createParentItem.bind(this);
		this.catSortFunc = this.catSortFunc.bind(this);
	}

	static getStores() {
		return [VehicleStore, CategoryStore];
	}

	static getPropsFromStores() {
		return {
			...VehicleStore.getState(),
			...CategoryStore.getState(),
		};
	}

	getMatched() {
		if (
			!this.props.vehicle ||
			!this.props.vehicle.lookup_category ||
			this.props.vehicle.lookup_category.length === 0 ||
			!this.props.categories ||
			this.props.categories.length === 0
		) {
			return <span></span>;
		}

		const groups = [];
		const categoriesGroup = {
			children: [],
		};

		if (this.props.categories && this.props.categories.length > 0) {
			this.props.categories.sort((a, b) => a.sort > b.sort);
		}
		this.props.categories.map((cat) => {
			const tmp = this.createParentItem(cat);
			categoriesGroup.children = categoriesGroup.children.concat(tmp.children);
		});
		categoriesGroup.children.map((c) => {
			if (!c.children || !c.children.length === 0) {
				return;
			}

			let subs = [];
			if (c.children && c.children.length > 0) {
				c.children.sort((a, b) => a.sort > b.sort);
				(c.children || []).map((cat) => {
					const tmp = this.props.vehicle.lookup_category.filter((t) => t.category.id === cat.cat.id);
					if (tmp.length > 0) {
						subs = subs.concat(tmp);
					}
				});
			} else {
				const tmp = this.props.vehicle.lookup_category.filter((t) => {
					return t.category.id === c.cat.id;
				});
				if (tmp.length > 0) {
					subs = subs.concat(tmp);
				}
				if (c.cat.id === 320) { // Seat Defenders
					// normally we would grab the different category struct type from the
					// lookup_category, but these are universal and dont exist in the lookup_category
					// so we create the new category
					const SeatDefender = {
						category: c.cat,
						style_options: [{
							style: 'all',
						}],
						children: [],
					};
					subs = subs.concat(SeatDefender);
				}
			}
			// sort subs which is an array of array
			let newSubs = [];
			newSubs = subs.sort(this.catSortFunc);
			if (subs.length > 0) {
				groups.push(
					<CategorizedResult
						activeIndex={this.props.activeIndex}
						parent={c}
						subs={newSubs}
						fitments={this.props.fitments}
						key={groups.length}
						iconParts={this.props.envision.partNumbers}
					/>
				);
			}
		});

		return groups;
	}

	catSortFunc(a, b) {
		if (a.category.sort < b.category.sort) {
			return -1;
		}
		return 1;
	}

	createParentItem(cat) {
		if (cat.children && cat.children.length > 0) {
			cat.children.sort((a, b) => a.sort > b.sort);
		}

		const newCat = {
			cat,
			title: cat.title,
		};

		if (cat.children) {
			newCat.children = cat.children.map(this.createParentItem);
			newCat.children.sort((a, b) => a.sort > b.sort);
		}

		return newCat;
	}

	render() {
		const matched = this.getMatched();
		return (
			<div className={s.root}>
				<ol className="breadcrumb">
					<li><Link to="/" title="Home">Home</Link></li>
					<li className="active">Vehicle Look Up Results</li>
				</ol>
				<div>
					<h1>VEHICLE LOOK UP RESULTS</h1>
					<p>Choose a category below to see the products that fit your vehicle.
						Some products may require the style of the vehicle to be specified.
					</p>
				</div>
				<Configurator
					products={this.props.vehicle.products}
					className={s.configurator}
					envision={this.props.envision}
				/>
				<div className={s.matched}>
					{matched}
				</div>
			</div>
		);
	}

}

export default VehicleResults;
