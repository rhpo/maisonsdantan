import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faShippingFast } from '@fortawesome/free-solid-svg-icons';

interface NotificationState {
	show: boolean;
	message: string;
	icon: IconDefinition;
	colors: { background: string; text: string };
}

function createNotification() {
	let state = $state<NotificationState>({
		show: true,
		message: 'Livraison partout en Algérie.',
		icon: faShippingFast,
		colors: { background: 'black', text: 'white' }
	});

	return {
		get state() {
			return state;
		},
		set(partial: Partial<NotificationState>) {
			state = { ...state, ...partial };
		},
		hide() {
			state = { ...state, show: false };
		},
		show() {
			state = { ...state, show: true };
		}
	};
}

export const notification = createNotification();
