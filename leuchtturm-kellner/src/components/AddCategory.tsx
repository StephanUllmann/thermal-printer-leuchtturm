import { useRef, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { fetcher, createCategory } from "../utils";
import useSWR from "swr";

interface CategoryFormElements extends HTMLFormControlsCollection {
	"new-category": HTMLInputElement;
}

const AddCategory = () => {
	const dialogRef = useRef<null | HTMLDialogElement>(null);

	const {
		data: categories,
		mutate,
		isValidating,
	} = useSWR<InsertCategory[]>(
		"http://localhost:3000/dishes/categories",
		fetcher,
	);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		const elements = (e.target as HTMLFormElement)
			.elements as CategoryFormElements;
		const newCategory = elements["new-category"].value;
		if (!newCategory) return;

		try {
			await mutate(createCategory(newCategory), {
				optimisticData: [...categories!, { name: newCategory }],
				rollbackOnError: true,
				populateCache: true,
				revalidate: true,
			});

			toast.success("Neue Kategorie hinzugefügt");
			(e.target as HTMLFormElement).reset();
			dialogRef.current?.close();
		} catch (error) {
			console.log(error);
			toast.error("Etwas ist schief gelaufen");
		}
	};

	return (
		<>
			<button
				type="button"
				className="btn"
				onClick={() => dialogRef.current?.showModal()}
			>
				+
			</button>
			{createPortal(
				<dialog ref={dialogRef} className="modal">
					<form
						onSubmit={handleSubmit}
						className="modal-box flex flex-col"
						inert={isValidating}
					>
						<label className="label" htmlFor="new-category">
							Neue Kategorie
						</label>
						<input
							type="text"
							className="input w-full"
							placeholder="Neue Kategorie"
							id="new-category"
							name="new-category"
						/>
						<div className="modal-action">
							<button
								disabled={isValidating}
								type="button"
								onClick={() => dialogRef.current?.close()}
								className="btn btn-warning"
							>
								Schließen
							</button>
							<button disabled={isValidating} className="btn btn-primary">
								Hinzufügen
							</button>
						</div>
					</form>
				</dialog>,
				document.body,
			)}
		</>
	);
};

export default AddCategory;
