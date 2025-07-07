import { useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "../utils";

const AddVariants = ({
	setDishSelected,
	selected,
}: {
	setDishSelected: React.Dispatch<React.SetStateAction<Dish | null>>;
	selected: number | undefined;
}) => {
	const { data } = useSWR<Dish[]>("http://localhost:3000/dishes", fetcher);

	useEffect(() => {
		const clickOutside = (e: MouseEvent) => {
			if (
				!(e.target as HTMLElement).closest("[data-dish]") &&
				!(e.target as HTMLElement).closest("form")
			) {
				setDishSelected(null);
			}
		};
		document.addEventListener("click", clickOutside);
		return () => document.removeEventListener("click", clickOutside);
	}, [setDishSelected]);

	return (
		<div className="py-4 px-3 flex flex-wrap justify-center gap-4 overflow-y-auto my-5 max-w-xl max-h-96 scroll-smooth  snap-y snap-mandatory snap-always snap-end">
			{data?.map((d) => (
				<button
					data-dish
					onClick={() => setDishSelected(d)}
					className={`border size-36 grid overflow-clip rounded shrink-0 ${
						selected === d.main_dishes.id
							? "ring-3 ring-offset-3 ring-primary"
							: ""
					}`}
					key={"dish-" + d.main_dishes.id}
				>
					<img
						className="col-end-1 row-end-1"
						draggable="false"
						src={
							`https://res.cloudinary.com/dvniua4ab/image/upload/c_thumb,g_center,h_150,w_150/f_webp/q_auto:eco/` +
							d.main_dishes.image
						}
						alt=""
					/>
					<p className="col-end-1 row-end-1 text-slate-100 bg-slate-800/70 h-fit w-fit py-0.5 px-2 rounded mb-2 max-w-full self-end-safe truncate text-wrap">
						{d.main_dishes.title}
					</p>
				</button>
			))}
		</div>
	);
};

export default AddVariants;
