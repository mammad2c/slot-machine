import { renderComponent } from "@/tests/renderComponent";
import SlotMachine from "./SlotMachine.vue";
import { shapes } from "./config";

function getRollBtn(
  queryByText: ReturnType<typeof renderComponent>["queryByText"],
) {
  return queryByText(/roll/i);
}

describe(SlotMachine.name, () => {
  it("should have critical elements", () => {
    const { queryByText } = renderComponent(<SlotMachine />);

    expect(queryByText(/credit/i)).toBeInTheDocument();
    expect(queryByText(/roll/i)).toBeInTheDocument();
    expect(queryByText(/cash out/i)).toBeInTheDocument();
  });

  for (const [key, value] of Object.entries(shapes)) {
    it(`should add ${value.point} if all shapes are ${value.name}`, async () => {
      const { queryByText, user } = renderComponent(
        <SlotMachine
          rollingTimeout={0}
          initialCredit={10}
          shapesIncludedForRolling={[key]}
        />,
      );

      const rollBtn = getRollBtn(queryByText)!;

      await user.click(rollBtn);

      vi.useFakeTimers();
      vi.runAllTimers();
      vi.useRealTimers();
      vi.restoreAllMocks();

      expect(queryByText(/credit/i)).toHaveTextContent(
        `${value.point + 10 - 1}`,
      );
    });
  }

  it("should not re roll if credit is less than zero", async () => {
    const { queryByText, user } = renderComponent(
      <SlotMachine rollingTimeout={0} initialCredit={0} />,
    );

    const rollBtn = getRollBtn(queryByText)!;

    await user.click(rollBtn);

    vi.useFakeTimers();
    vi.runAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();

    expect(queryByText(/credit/i)).toHaveTextContent("0");
    expect(queryByText(/your chances has been fulfilled/i)).toBeInTheDocument();
  });

  it("should re roll if credit is between 40 and 60 or above 60 and user is won the round", async () => {
    const onOnCheatRequired = vi.fn();
    const { queryByText, user } = renderComponent(
      <SlotMachine
        rollingTimeout={0}
        initialCredit={50}
        onOnCheatRequired={onOnCheatRequired}
        shapesIncludedForRolling={["c"]}
      />,
    );

    const rollBtn = getRollBtn(queryByText)!;

    await user.click(rollBtn);

    expect(onOnCheatRequired).toBeCalled();
  });
});
