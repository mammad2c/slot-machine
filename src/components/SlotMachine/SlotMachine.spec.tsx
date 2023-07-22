import { renderComponent } from "@/tests/renderComponent";
import SlotMachine from "./SlotMachine.vue";

describe(SlotMachine.name, () => {
  it("should have critical elements", () => {
    const { queryByText } = renderComponent(<SlotMachine />);
    expect(queryByText(/credit/i)).toBeInTheDocument();
    expect(queryByText(/roll/i)).toBeInTheDocument();
    expect(queryByText(/cash out/i)).toBeInTheDocument();
  });
});
