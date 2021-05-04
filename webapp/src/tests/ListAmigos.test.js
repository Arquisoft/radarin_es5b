import { getByDisplayValue, render, screen } from "@testing-library/react"
import ReactDOM from "react-dom"
import { act } from "react-dom/test-utils"
import ListAmigos from "../components/ListAmigos"



test("list of friends is present", async () => {

	

	render(<ListAmigos />);



	const amigoscercanos = screen.getByText("Amigos cercanos");
	expect(amigoscercanos).toBeInTheDocument();

	const amigoslejanos = screen.getByText("Amigos lejanos");
	expect(amigoslejanos).toBeInTheDocument();

})