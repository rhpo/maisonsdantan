interface PriceConfig {
	rouleau: number;
	poster: number;
}

interface AppConfig {
	maxWidth: number;
	maxHeight: number;
	securityMargin: number;
	price: PriceConfig;
}

function createConfig() {
	let config = $state<AppConfig>({
		maxWidth: Infinity,
		maxHeight: 600,
		securityMargin: 5,
		price: { rouleau: 2600, poster: 2000 }
	});

	return {
		get value() {
			return config;
		},
		get price() {
			return config.price;
		},
		calculatePrice(width: number, height: number, material: keyof PriceConfig): number {
			return Math.ceil(((width / 100) * (height / 100) * config.price[material]) / 5) * 5;
		},
		formatPrice(n: number): string {
			return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' DA';
		}
	};
}

export const appConfig = createConfig();
