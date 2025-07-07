import { useState } from "react";
import AddVariants from "../components/AddVariants";
import AddDishForm from "../components/AddDishForm";
import EditDishForm from "../components/EditDishForm";

const AddDish = () => {
	const [dishSelected, setDishSelected] = useState<null | Dish>(null);

	return (
		<>
			{dishSelected ? (
				<EditDishForm
					key={dishSelected.main_dishes.id}
					dishId={dishSelected.main_dishes.id}
					setDishSelected={setDishSelected}
				/>
			) : (
				<AddDishForm />
			)}
			<AddVariants
				setDishSelected={setDishSelected}
				selected={dishSelected?.main_dishes.id}
			/>
		</>
	);
};

export default AddDish;
