import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import parsePath from 'history/lib/parsePath';
import Location from '../../core/Location';
import s from './Lookup.scss';
import NewVehicle from './NewVehicle';
import VehicleActions from '../../actions/VehicleActions';
import VehicleStore from '../../stores/VehicleStore';
import withStyles from '../../decorators/withStyles';
import connectToStores from 'alt-utils/lib/connectToStores';

@withStyles(s)
@connectToStores
class Lookup extends Component {

	static propTypes = {
		className: PropTypes.string,
		valid: PropTypes.bool,
		vehicle: PropTypes.shape({
			base: PropTypes.shape({
				year: PropTypes.string,
				make: PropTypes.string,
				model: PropTypes.string,
			}),
			availableYears: PropTypes.array,
			availableMakes: PropTypes.array,
			available_odels: PropTypes.array,
			lookup_category: PropTypes.array,
			products: PropTypes.array,
		}),
	};

	static defaultProps = {
		vehicle: {
			year: '',
			make: '',
			model: '',
		},
	};

	constructor(props) {
		super(props);

		this.viewParts = this.viewParts.bind(this);
		this.resetVehicle = this.resetVehicle.bind(this);

		if (props.vehicle.base.model && props.vehicle.base.model !== '') {
			this.state = {
				valid: true,
			};
		}
	}

	static getStores() {
		return [VehicleStore];
	}

	static getPropsFromStores() {
		return VehicleStore.getState();
	}

	viewParts() {
		const vehicle = this.props.vehicle.base || {};
		Location.push({
			...(parsePath(
				`/vehicle/${vehicle.year}/${vehicle.make}/${vehicle.model}`
			)),
			state: this.props,
		});
	}

	resetVehicle() {
		this.vehicleSet = false;
		VehicleActions.setVehicle('', '', '');
	}

	showVehicle() {
		const link = `/vehicle/${this.props.vehicle.base.year}/${this.props.vehicle.base.make}/${this.props.vehicle.base.model}`;
		const v = `${this.props.vehicle.base.year} ${this.props.vehicle.base.make} ${this.props.vehicle.base.model}`;
		return (
			<div className={s.vehicleName}>
				<a href={link}>
					{v.toUpperCase()}
				</a>
				<button
					className={cx('red-transparent-button', s.viewParts)}
					onClick={this.resetVehicle}
				>
					Change
				</button>
			</div>
		);
	}

	render() {
		let valid = <NewVehicle vehicle={this.props.vehicle} onSubmit={this.viewParts} />;
		if (
			this.props.vehicle &&
			this.props.vehicle.base.year !== '' &&
			this.props.vehicle.base.make !== '' &&
			this.props.vehicle.base.model !== '' &&
			this.props.vehicle.products
		) {
			valid = this.showVehicle();
		}
		return (
			<div className={cx(s.root, this.props.className)} role="navigation">
				{ valid }
			</div>
		);
	}

}

export default Lookup;
