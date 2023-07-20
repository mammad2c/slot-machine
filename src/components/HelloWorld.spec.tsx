import { renderComponent } from "@/tests/render-component";
import HelloWorld from "@/components/HelloWorld.vue";

describe(HelloWorld.name, () => {
  it("should render correctly", () => {
    const { queryByText } = renderComponent(<HelloWorld />);
    expect(queryByText(/get started/i)).toBeInTheDocument();
  });
});
