function createUI() {
	let darkMode = $state(false);
	let menuOpen = $state(false);

	return {
		get darkMode() {
			return darkMode;
		},
		get menuOpen() {
			return menuOpen;
		},
		toggleDark() {
			darkMode = !darkMode;
		},
		toggleMenu() {
			menuOpen = !menuOpen;
		},
		closeMenu() {
			menuOpen = false;
		}
	};
}

export const ui = createUI();
