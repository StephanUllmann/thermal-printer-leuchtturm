import { useCallback, useRef, useState } from "react";
import Categories from "../components/Categories";
import { fetcher } from "../utils";
import useSWR from "swr";
import { toast } from "react-toastify";

const Home = () => {
	const { data: mainDishes } = useSWR<Dish[]>(
		"http://localhost:3000/dishes",
		fetcher,
	);
	const [selectedCat, setSelectedCat] = useState<string | null>(null);
	const [selection, setSelection] = useState<null | Record<string, number>>(
		null,
	);
	const [tableNum, setTableNum] = useState("");
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [toPrint, setToPrint] = useState<string[][] | null>(null);

	const changeSelection = useCallback(
		(name: string, operation: "inc" | "dec") => {
			setSelection((prev) => {
				const d = operation === "inc" ? 1 : -1;

				if (!prev && operation === "inc") return { [name]: 1 };
				if (prev && name in prev && prev[name] === 1 && operation === "dec") {
					const newSelection = { ...prev };
					delete newSelection[name];
					return newSelection;
				}
				if (prev && !(name in prev) && operation === "inc")
					return { ...prev, [name]: 1 };
				if (prev && name in prev) return { ...prev, [name]: prev[name] + d };
				return prev;
			});
		},
		[],
	);

	// console.log(selection);
	// console.dir(mainDishes);

	const ordered =
		mainDishes &&
		Object.entries(
			Object.groupBy(mainDishes, ({ categories }) => categories.name),
		).sort((a, b) => a[0].localeCompare(b[0]));

	const dishesToDisplay =
		ordered && selectedCat
			? ([
					Object.entries(
						Object.groupBy(mainDishes, ({ categories }) => categories.name),
					).find(([cat]) => cat === selectedCat),
				] as [string, Dish[]][])
			: ordered;

	const handleConfirm = () => {
		if (!selection) return;
		dialogRef.current?.showModal();
		setToPrint(() => {
			const list = Object.entries(selection)
				.sort((a, b) => a[0].localeCompare(b[0]))
				.map(([title, count]) => [title, count.toString()]);

			if (tableNum) list.unshift(["Tischnummer", tableNum]);
			return list;
		});
	};

	const handleSendToKitchen = async () => {
		if (!selection || !toPrint) return;

		try {
			const res = await fetch("http://localhost:3000/print/order", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(toPrint),
			});

			const { msg } = await res.json();
			if (msg !== "Printed") throw new Error("Print failed");
			setSelection(null);
			toast.success("🧑‍🍳");
		} catch (error) {
			console.log(error);
			toast.error("Das ist schief gegangen");
		}
	};

	return (
		<>
			<input
				type="number"
				className="input fixed top-3 left-28 !z-50"
				placeholder="Tischnummer"
				value={tableNum}
				onChange={(e) => setTableNum(e.target.value)}
				min={0}
			/>
			{selection && (
				<>
					<button
						type="button"
						onClick={() => setSelection(null)}
						className="fixed top-3 left-5 z-50 btn-warning btn "
					>
						Reset
					</button>
					<button
						type="button"
						onClick={handleConfirm}
						className="fixed top-3 right-5 z-50 btn-primary btn"
					>
						In die Küche!
					</button>
				</>
			)}
			<div className="flex gap-16 relative ">
				<nav className="">
					<ul className="sticky top-20 space-y-1 max-h-[70dvh] overflow-y-auto">
						<li>
							<button
								type="button"
								className={` w-full text-start py-3 px-2 bg-accent/20 mb-3 hover:bg-accent/30 rounded-xl shadow cursor-pointer ${
									!selectedCat ? "bg-accent/40" : ""
								}`}
								onClick={() => setSelectedCat(null)}
							>
								Alle
							</button>
						</li>
						{ordered?.map(([category]) => (
							<li key={`list-menu-${category}`}>
								<button
									type="button"
									onClick={() => setSelectedCat(category)}
									className={`w-full text-start py-3 px-2 bg-accent/10 hover:bg-accent/20 rounded-xl shadow cursor-pointer ${
										selectedCat === category
											? "ring ring-accent/50 bg-accent/40"
											: ""
									}`}
								>
									{category}
								</button>
							</li>
						))}
					</ul>
				</nav>
				<div className=" ">
					{dishesToDisplay?.map(([category, dishes]) => (
						<Categories
							key={category}
							category={category}
							dishes={dishes as Dish[]}
							selection={selection}
							changeSelection={changeSelection}
						/>
					))}
				</div>
			</div>
			<dialog ref={dialogRef} className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Zusammenfassung</h3>
					<ul className="max-h-[10lh] leading-8 overflow-y-auto">
						{toPrint?.map(([val, qty], ind) => {
							if (ind === 0 && tableNum) {
								return (
									<li key={val}>
										<span className="font-bold">Tisch {qty}</span>
									</li>
								);
							}
							return (
								<li key={val} data-qty={qty} className="qty-marker ml-2">
									{qty}x: <span className="truncate">{val}</span>
								</li>
							);
						})}
					</ul>
					<div className="modal-action flex justify-between">
						<form method="dialog">
							<button className="btn btn-warning" type="submit">
								Abbrechen
							</button>
						</form>
						<button
							className="btn btn-success"
							type="button"
							onClick={handleSendToKitchen}
						>
							In die Küche
						</button>
					</div>
				</div>
			</dialog>
		</>
	);
};

export default Home;
