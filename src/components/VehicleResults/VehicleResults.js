import React, { Component, PropTypes } from 'react';
// import cx from 'classnames';
import Loader from 'react-loader';
import s from './VehicleResults.scss';
import withStyles from '../../decorators/withStyles';
import VehicleStore from '../../stores/VehicleStore';
import VehicleActions from '../../actions/VehicleActions';
import CategoryStore from '../../stores/CategoryStore';
import CategoryActions from '../../actions/CategoryActions';
import connectToStores from 'alt-utils/lib/connectToStores';
import VehicleStyle from './VehicleStyle';
import Category from './Category';

@withStyles(s)
@connectToStores
class VehicleResults extends Component {

	static propTypes = {
		className: PropTypes.string,
		context: PropTypes.shape({
			params: PropTypes.shape({
				year: PropTypes.string,
				make: PropTypes.string,
				model: PropTypes.string,
			}),
		}),
		vehicle: PropTypes.shape({
			year: PropTypes.string,
			make: PropTypes.string,
			model: PropTypes.string,
		}),
		catStyleParts: PropTypes.array, //
		categories: PropTypes.array,
		activeCategory: PropTypes.object,
		catGroups: PropTypes.array,
	};

	static contextTypes = {
		onSetTitle: PropTypes.func.isRequired,
		onPageNotFound: PropTypes.func.isRequired,
		onSetMeta: PropTypes.func.isRequired,
		seo: PropTypes.func.isRequired,
	};

	constructor() {
		super();
		this.state = {
			context: {},
		};
	}

	componentWillMount() {
		VehicleActions.set({
			year: this.props.context.params.year,
			make: this.props.context.params.make,
			model: this.props.context.params.model,
		});
		const title = this.props.context.params.year && this.props.context.params.make && this.props.context.params.model ? `${this.props.context.params.year} ${this.props.context.params.make} ${this.props.context.params.model}` : 'Vehicle Results';
		this.context.onSetTitle(title);
		this.context.onSetMeta('description', title);
		const seo = {
			title,
			description: 'ARIES Automotive parts for ' + title,
		};
		this.context.seo(seo);
		CategoryActions.getCats();
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

	getCategoryStyles() {
		const output = [];

		if (!this.props.catGroups || this.props.catGroups[0].id === 0 || !this.props.categories || this.props.categories[0].id === 0) {
			return <span></span>;
		}

		this.props.catGroups.map((c) => {
			const subs = [];
			this.props.categories.map((cat) => {
				if (cat.category.parent_id === c.id) {
					subs.push({
						parent: c.id,
						cat,
					});
				}
			});

			output.push(
				<div className={'col-sm-12'}>
					<Category catTitle={c.title} subs={subs} />
				</div>
			);
		});

		return output;
	}

	setActiveCategory(cat) {
		VehicleActions.setActiveCategory(cat);
	}

	renderVehicleStyle() {
		return (
			<VehicleStyle
				className={s.vehicleStyle}
			/>
		);
	}

	render() {
		return (
			<div className={s.container}>
				<Loader loaded={(this.props.categories !== null)} top="30%">
					{this.getCategoryStyles()}
					{this.props.activeCategory ? this.renderVehicleStyle() : null}
				</Loader>
			</div>
		);
	}

}

export default VehicleResults;
