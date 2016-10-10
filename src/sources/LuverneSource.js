import LuverneActions from '../actions/LuverneActions';
import fetch from '../core/fetch';
import { apiBase, apiKey, brand } from '../config';

const KEY = apiKey;

const LuverneSource = {
	fetchVehicle() {
		return {
			remote(st, year, make, model) {
				let path = `${apiBase}/luverne/vehicle`;

				if (year && year !== '') {
					path = `${path}/${year}`;
				}
				if (make && make !== '') {
					path = `${path}/${make}`;
				}
				if (model && model !== '') {
					path = `${path}/${model}`;
				}

				return new Promise((res, rej) => {
					fetch(`${path}?key=${KEY}&brandID=${brand.id}`)
					.then((resp) => {
						return resp.json();
					}).then(res).catch(rej);
				});
			},

			local(st, args) {
				if (!args && (!st.vehicle.available_years || st.vehicle.available_years.length === 0)) {
					return null;
				} else if (args) {
					if (args[0] && args[0] !== st.vehicle.base_vehicle.year) {
						return null;
					}
					if (args[1] && args[1] !== st.vehicle.base_vehicle.make) {
						return null;
					}
					if (args[2] && args[2] !== st.vehicle.base_vehicle.model) {
						return null;
					}
				}
				return st.vehicle;
			},

			success: LuverneActions.updateVehicle,
			error: LuverneActions.failedVehicle,
			loading: LuverneActions.fetchVehicle,
		};
	},

	fetchFitments() {
		return {
			remote(st, result, style) {
				let fits = [];

				// map fitments for all style options that fit the supplied style
				// to back into the array.
				result.style_options
				.filter((so) => so.style.toLowerCase() === style.toLowerCase())
				.map((so) => {
					// push all fitment data into the array
					fits = fits.concat(
						so.fitments
					);
				});
				return new Promise((res, rej) => {
					const ids = [];
					for (let i = 0; i < fits.length; i++) {
						const ft = fits[i];
						if (!ft.product_identifier) {
							continue;
						}

						ids.push(ft.product_identifier);
					}

					fetch(
						`${apiBase}/part/multi?key=${KEY}&brandID=${brand.id}`,
						{
							method: 'post',
							headers: {
								'Accept': 'application/json',
							},
							body: JSON.stringify(ids),
						},
					)
					.then((resp) => {
						return resp.json();
					/* eslint-disable no-loop-func */
					}).then((parts) => {
						parts.map((p) => {
							fits.map((f, j) => {
								if (f.product_identifier === p.part_number) {
									fits[j].product = p;
									if (fits.every((t) => t.product)) {
										res(fits);
									}
								}
							});
						});
					}).catch(rej);
				});
			},

			local(st, result, style) {
				const id = result.category.id;
				let fits = [];

				// map fitments for all style options that fit the supplied style
				// to back into the array.
				result.fitments
				.filter((so) => so.style.toLowerCase() === style.toLowerCase())
				.map((so) => {
					// push all fitment data into the array
					fits = fits.concat(
						so.fitments
					);
				});

				if (!st.fitments[id] || fits.length > 0) {
					return null;
				}

				st.fitments.sort((a, b) => a.product_identifier > b.product_identifier);
				fits.sort((a, b) => a.product_identifier > b.product_identifier);

				let same = true;
				st.fitments.map((ft, i) => {
					if (!fits[i] || fits[i].product_identifier !== ft.product_identifier) {
						same = false;
					}
				});

				if (!same) {
					return null;
				}

				return st.fitments[id];
			},

			success: LuverneActions.updateFitments,
			error: LuverneActions.failedFitments,
			loading: LuverneActions.fetchFitments,
		};
	},

	fetchParts() {
		return {
			remote(st, ids) {
				return new Promise((res, rej) => {
					// const fits = [];
					fetch(
						`${apiBase}/part/multi?key=${KEY}&brandID=${brand.id}`,
						{
							method: 'post',
							headers: {
								'Accept': 'application/json',
							},
							body: JSON.stringify(ids),
						},
					)
					.then((resp) => {
						return resp.json();
					/* eslint-disable no-loop-func */
					}).then((parts) => {
						res(parts);
					}).catch(rej);
				});
			},

			// local(st, result) {
			// 	const id = result.category.id;
			// 	let fits = [];
			//
			// 	// map fitments for all style options that fit the supplied style
			// 	// to back into the array.
			// 	result.fitments
			// 	.filter((so) => so.style.toLowerCase() === style.toLowerCase())
			// 	.map((so) => {
			// 		// push all fitment data into the array
			// 		fits = fits.concat(
			// 			so.fitments
			// 		);
			// 	});
			//
			// 	if (!st.fitments[id] || fits.length > 0) {
			// 		return null;
			// 	}
			//
			// 	st.fitments.sort((a, b) => a.product_identifier > b.product_identifier);
			// 	fits.sort((a, b) => a.product_identifier > b.product_identifier);
			//
			// 	let same = true;
			// 	st.fitments.map((ft, i) => {
			// 		if (!fits[i] || fits[i].product_identifier !== ft.product_identifier) {
			// 			same = false;
			// 		}
			// 	});
			//
			// 	if (!same) {
			// 		return null;
			// 	}
			//
			// 	return st.fitments[id];
			// },

			success: LuverneActions.updateFitments,
			error: LuverneActions.failedFitments,
			loading: LuverneActions.fetchFitments,
		};
	},
};

module.exports = LuverneSource;
