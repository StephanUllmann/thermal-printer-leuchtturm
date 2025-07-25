//  @ts-expect-error  No type checking on these arguments
export const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const createDish = async (formData: FormData) => {
	const res = await fetch("http://localhost:3000/dishes", {
		method: "POST",
		body: formData,
	});
	const data = await res.json();
	return data;
};

export const createCategory = async (newCategory: string) => {
	const res = await fetch("http://localhost:3000/dishes/categories", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ name: newCategory }),
	});
	if (!res.ok) throw new Error("Error creating new category", { cause: res });
	const data = await res.json();
	return data;
};

export const editDish = async (dishId: number, formData: FormData) => {
	const res = await fetch(`http://localhost:3000/dishes/${dishId}`, {
		method: "PUT",
		body: formData,
	});

	if (!res.ok) throw new Error("Error editing dish", { cause: res });
	const data = await res.json();
	return data;
};
export const deleteDish = async (dishId: number) => {
	const res = await fetch(`http://localhost:3000/dishes/${dishId}`, {
		method: "DELETE",
	});

	if (!res.ok) throw new Error("Error deleting dish", { cause: res });
	const data = await res.json();
	return data;
};
