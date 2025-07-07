import { useEffect, useState, type FormEvent } from "react";
import { NavLink } from "react-router-dom";
import LighthouseIcon from "./icons/LighthouseIcon";
import EditIcon from "./icons/EditIcon";
import SettingsIcon from "./icons/SettingsIcon";
import LightModeIcon from "./icons/LightModeIcon";
import DarkModeIcon from "./icons/DarkModeIcon";
import { toast } from "react-toastify";

const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;

const Dock = ({
	setTheme,
}: { setTheme: React.Dispatch<React.SetStateAction<string>> }) => {
	const [printer, setPrinter] = useState({
		input: "",
		oldIP: "",
		isConnected: false,
	});

	useEffect(() => {
		const fetchPrinterIP = async () => {
			try {
				const res = await fetch("http://localhost:3000/print/ip");
				const data = await res.json();
				setPrinter({
					input: data.ip,
					oldIP: data.ip,
					isConnected: data.isConnected,
				});
				if (!data.isConnected) {
					toast.error("Drucker nicht verbunden");
				}
			} catch (error) {
				console.log(error);
			}
		};

		fetchPrinterIP();
	}, []);

	const handlePrinterIPChange = async (e: FormEvent) => {
		e.preventDefault();
		const isIp = ipRegex.test(printer.input);
		if (!isIp) {
			toast.error("Tippfehler in der IP");
		}
		try {
			const res = await fetch("http://localhost:3000/print/ip", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ip: printer.input }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error("Update failed");
			setPrinter({
				input: data.ip,
				oldIP: data.ip,
				isConnected: data.isConnected,
			});
			if (!data.isConnected) {
				toast.error("Drucker nicht verbunden");
			} else {
				toast.success("Drucker verbunden");
			}
		} catch (error) {
			console.log(error);
			toast.error("Update ging schief");
			setPrinter((p) => ({
				input: p.oldIP,
				oldIP: p.oldIP,
				isConnected: p.isConnected,
			}));
		}
	};
	return (
		<footer>
			<div className="dock dock-lg">
				<NavLink
					to={"hinzufuegen"}
					className={({ isActive }) => (isActive ? "dock-active" : "")}
				>
					<EditIcon />
				</NavLink>

				<NavLink
					to={"/"}
					className={({ isActive }) => (isActive ? "dock-active" : "")}
				>
					<LighthouseIcon />
				</NavLink>

				<div className="dropdown dropdown-top items-center hover:opacity-100">
					{/* <div tabIndex={0} role='button' className='btn m-1'>
            Click ⬆️
          </div> */}
					<button type="button" className="block mx-auto h-full">
						<SettingsIcon />
					</button>
					<ul
						tabIndex={0}
						className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
					>
						<li>
							<div className="dropdown dropdown-left dropdown-end ">
								<button type="button" className="">
									Modus
								</button>
								<ul
									tabIndex={0}
									className="dropdown-content menu bg-base-100 rounded-box z-1 w-20 p-2 shadow-sm "
								>
									<li>
										<button
											type="button"
											onClick={() => setTheme("light")}
											className="flex justify-center"
										>
											<LightModeIcon />
										</button>
									</li>
									<li>
										<button
											type="button"
											onClick={() => setTheme("dark")}
											className="flex justify-center"
										>
											<DarkModeIcon />
										</button>
									</li>
								</ul>
							</div>
						</li>
						<li>
							<div className="dropdown dropdown-left dropdown-end ">
								<div className="indicator">
									<span
										className={`indicator-item status ${printer.isConnected ? "status-success" : "status-error"}`}
									/>
									<button type="button" className="">
										Drucker IP
									</button>
								</div>

								<ul
									tabIndex={0}
									className="dropdown-content menu bg-base-100 rounded-box z-1 w-72 p-2 shadow-sm "
								>
									<li>
										<form className="join" onSubmit={handlePrinterIPChange}>
											<input
												className="input"
												type="text"
												name="ip"
												value={printer.input}
												onChange={(e) =>
													setPrinter((p) => ({ ...p, input: e.target.value }))
												}
											/>
											<button
												type="submit"
												className="btn btn-warning cursor-pointer"
											>
												Ändern
											</button>
										</form>
									</li>
								</ul>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</footer>
	);
};

export default Dock;
