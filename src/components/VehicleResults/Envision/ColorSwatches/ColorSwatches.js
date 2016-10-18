import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import s from './ColorSwatches.scss';
import Swatch from './Swatch';
import withStyles from '../../../../decorators/withStyles';

@withStyles(s)
class Configurator extends Component {

	static propTypes = {
		className: PropTypes.string,
		colors: PropTypes.array.isRequired,
	};

	render() {
		return (
			<div className={cx(s.root, this.props.className)}>
				{(this.props.colors || []).map((color, i) => <Swatch key={i} color={color} />)}
			</div>
		);
	}

}

export default Configurator;
