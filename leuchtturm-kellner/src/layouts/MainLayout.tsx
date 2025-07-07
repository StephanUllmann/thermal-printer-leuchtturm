import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Nav from "../components/Nav";
import Dock from "../components/Dock";

const themeMap: Record<string, string> = {
	light: "garden",
	dark: "night",
};

const MainLayout = () => {
	const [theme, setTheme] = useState<string>("garden");
	const [installEvent, setInstallEvent] =
		useState<BeforeInstallPromptEvent | null>(null);

	useEffect(() => {
		let installed = false;

		window.addEventListener(
			"appinstalled",
			() => {
				installed = true;
				setInstallEvent(null);
			},
			{ once: true },
		);

		window.addEventListener(
			"beforeinstallprompt",
			async (e: BeforeInstallPromptEvent) => {
				if (installed) return;
				setInstallEvent(e);
			},
			{ once: true },
		);
	}, []);

	return (
		<div
			data-theme={themeMap[theme]}
			className="grid grid-rows-[1fr_2rem] min-h-screen"
		>
			<Nav />
			<main className="mt-20 mx-auto">
				<Outlet />
			</main>
			<Dock setTheme={setTheme} />
			<ToastContainer aria-label={"Toaster"} />
			{installEvent && (
				<button
					type="button"
					onClick={async () => {
						await installEvent.prompt();
					}}
					className="btn btn-warning absolute top-3 right-5 z-50"
				>
					Install
				</button>
			)}
		</div>
	);
};

export default MainLayout;
