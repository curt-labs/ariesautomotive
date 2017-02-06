import 'babel-core/polyfill';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
import Router from './routes';
import Location from './core/Location';
import { addEventListener, removeEventListener } from './core/DOMUtils';
import { brand } from './config';

let cssContainer = document.getElementById('css');
const appContainer = document.getElementById('app');
const context = {
	insertCss: styles => styles._insertCss(),
	onSetTitle: value => document.title = `${brand.name} | ${value}`,
	onSetMeta: (name, content, type) => {
		// Remove and create a new <meta /> tag in order to make it work
		// with bookmarks in Safari
		const elements = document.getElementsByTagName('meta');
		let metaType = 'name';
		if (type) {
			metaType = type;
		}
		[].slice.call(elements).forEach((element) => {
			if (element.getAttribute(metaType) === name) {
				element.parentNode.removeChild(element);
			}
		});
		const meta = document.createElement('meta');
		meta.setAttribute(metaType, name);
		meta.setAttribute('content', content);
		document.getElementsByTagName('head')[0].appendChild(meta);
	},
	seo: (seoInput) => {
		const props = seoInput;
		props.url = brand.website;
		props.type = 'website';
		props.card = 'summary_large_card';
		const metaTags = [{ use: 'og', label: 'property' }, { use: 'twitter', label: 'name' }];
		metaTags.forEach((tag) => {
			for (const i in props) {
				if (!i) {
					continue;
				}
				const meta = document.createElement('meta');
				meta.setAttribute(tag.label, tag.use + ':' + i);
				meta.setAttribute('content', props[i]);
				document.getElementsByTagName('head')[0].appendChild(meta);
			}
		});
	},
};

function render(state) {
	Router.dispatch(state, (newState, component) => {
		ReactDOM.render(component, appContainer, () => {
			// Remove the pre-rendered CSS because it's no longer used
			// after the React app is launched
			window.scrollTo(0, 0);
			if (cssContainer) {
				cssContainer.parentNode.removeChild(cssContainer);
				cssContainer = null;
			}
		});
	});
}

function run() {
	let currentLocation = null;
	let currentState = null;
	const google = window.google;
	const navigator = window.navigator;
	const win = window;
	// Make taps on links and buttons work fast on mobiles
	FastClick.attach(document.body);

	// Re-render the app when window.location changes
	const unlisten = Location.listen(location => {
		currentLocation = location;
		currentState = Object.assign({}, location.state, {
			path: location.pathname,
			query: location.query,
			state: location.state,
			context,
			google,
			navigator,
			win,
		});

		render(currentState);
	});

	// Save the page scroll position into the current location's state
	const supportPageOffset = window.pageXOffset !== undefined;
	const isCSS1Compat = ((document.compatMode || '') === 'CSS1Compat');
	const setPageOffset = () => {
		currentLocation.state = currentLocation.state || Object.create(null);
		if (supportPageOffset) {
			// currentLocation.state.scrollX = window.pageXOffset;
			// currentLocation.state.scrollY = window.pageYOffset;
		} else {
			currentLocation.state.scrollX = isCSS1Compat ?
			document.documentElement.scrollLeft : document.body.scrollLeft;
			currentLocation.state.scrollY = isCSS1Compat ?
			document.documentElement.scrollTop : document.body.scrollTop;
		}
	};

	addEventListener(window, 'scroll', setPageOffset);
	addEventListener(window, 'pagehide', () => {
		removeEventListener(window, 'scroll', setPageOffset);
		unlisten();
	});
}

// Run the application when both DOM is ready and page content is loaded
if (['complete', 'loaded', 'interactive'].includes(document.readyState) && document.body) {
	run();
} else {
	document.addEventListener('DOMContentLoaded', run, false);
}
