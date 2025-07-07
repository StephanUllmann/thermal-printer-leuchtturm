import type { FormEvent } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import { fetcher } from "../utils";

interface VariantsElements extends HTMLFormControlsCollection {
	newVariant: HTMLInputElement;
}

const createVariant = async (dishId: number, title: string) => {
	const res = await fetch(`http://localhost:3000/dishes/${dishId}/variants`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ title }),
	});
	if (!res.ok) throw new Error("Error posting new variant", { cause: res });
	const data = await res.json();
	return data;
};

const deleteVariant = async (dishId: number, variantId: number) => {
	const res = await fetch(
		`http://localhost:3000/dishes/${dishId}/variants/${variantId}`,
		{
			method: "DELETE",
		},
	);
	if (!res.ok) throw new Error("Error deleting variant", { cause: res });
	const data = await res.json();
	return data;
};

const VariantsForm = ({ dishId }: { dishId: Dish["main_dishes"]["id"] }) => {
	const {
		data: mainDishes,
		mutate,
		isValidating,
	} = useSWR<Dish[]>("http://localhost:3000/dishes", fetcher);
	const dish = mainDishes?.find((d) => d.main_dishes.id === dishId);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		const elements = (e.target as HTMLFormElement).elements as VariantsElements;
		if (!elements.newVariant || !dish) return;
		const title = elements.newVariant.value;
		if (!title || !dishId) return;

		// const optimisticData = mainDishes?.map((d) => {
		//   if (d.main_dishes.id !== dishId) return d;
		//   return { ...d, [d.variants]: [...d.variants] };
		// });

		try {
			await mutate(createVariant(dishId, title), {
				// optimisticData,
				rollbackOnError: true,
				populateCache: true,
				revalidate: true,
			});

			(e.target as HTMLFormElement).reset();
			// setTrigger((p) => !p);
		} catch (error) {
			console.error(error);
			toast.error("Etwas ist schief gelaufen");
		}
	};

	const handleDelete = async (variantId: number) => {
		if (!dish || !dishId) return;
		try {
			await mutate(deleteVariant(dishId, variantId), {
				// optimisticData,
				rollbackOnError: true,
				populateCache: true,
				revalidate: true,
			});
			// setTrigger((p) => !p);
		} catch (error) {
			console.error(error);
			toast.error("Etwas ist schief gelaufen");
		}
	};

	// console.log('VARIANTS: ', dish?.variants);
	return (
		<div
			data-dish
			className="flex flex-col items-center my-3 max-h-80 overflow-y-auto
    "
		>
			<h2>Varianten</h2>
			{dish &&
				Array.isArray(dish.variants) &&
				dish.variants.map((v) => (
					<div key={v.title + dishId} className="w-xs  join">
						<span className="input join-item">{v.title}</span>

						<button
							disabled={isValidating}
							onClick={() => v.id && handleDelete(v.id)}
							type="button"
							className="btn join-item w-12"
						>
							-
						</button>
					</div>
				))}
			<form className="w-xs join" onSubmit={handleSubmit}>
				<input type="text" className="input join-item" name="newVariant" />
				<button
					type="submit"
					disabled={isValidating}
					className="btn join-item w-12"
				>
					+
				</button>
			</form>
		</div>
	);
};

export default VariantsForm;
