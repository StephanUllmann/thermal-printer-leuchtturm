declare global {
	type InsertDish = {
		title: string;
		image: string;
		id?: number;
	};
	type InsertVariant = {
		title: string;
		id?: number;
		mainDishId?: number;
	};
	type InsertCategory = {
		name: string;
		id?: number;
	};

	type Dish = {
		main_dishes: InsertDish;
		categories: InsertCategory;
		variants: InsertVariant[] | null;
	};

	type DishesResponse = {
		msg: string;
		result: Dish[];
	};

	type OutletContext = {
		trigger: boolean;
		setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
		mainDishes: Dish[] | null;
		setMainDishes: React.Dispatch<React.SetStateAction<Dish[] | null>>;
		categories: InsertCategory[] | null;
		setCategories: React.Dispatch<
			React.SetStateAction<InsertCategory[] | null>
		>;
		setRefetchCategories: React.Dispatch<React.SetStateAction<boolean>>;
	};

	/**
	 * The BeforeInstallPromptEvent is fired at the Window.onbeforeinstallprompt handler
	 * before a user is prompted to "install" a web site to a home screen on mobile.
	 *
	 * @deprecated Only supported on Chrome and Android Webview.
	 */
	interface BeforeInstallPromptEvent extends Event {
		readonly platforms: string[];
		readonly userChoice: Promise<{
			outcome: "accepted" | "dismissed";
			platform: string;
		}>;
		prompt(): Promise<void>;
	}

	interface WindowEventMap {
		beforeinstallprompt: BeforeInstallPromptEvent;
	}
}
