import { renderComponent } from "@/tests/renderComponent";
import SlotMachine from "./SlotMachine.vue";
import { shapes } from "./config";
import { useGameStore } from "@/stores";
import { nextTick } from "vue";

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

      expect(queryByText(/credit/i)).toHaveTextContent(`${value.point + 10}`);
    });
  }

  it("should not re roll if credit is less than zero", async () => {
    const { queryByText, user } = renderComponent(
      <SlotMachine rollingTimeout={0} initialCredit={0} />,
    );

    const gameStore = useGameStore();

    const rollBtn = getRollBtn(queryByText)!;

    await user.click(rollBtn);

    vi.useFakeTimers();
    vi.runAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();

    expect(queryByText(/credit/i)).toHaveTextContent("0");
    expect(queryByText(/game over/i)).toBeInTheDocument();
    expect(gameStore.status).toBe("finished");
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

  it("should move the cash out by hover on it based on the chance", async () => {
    const { queryByTestId, queryByText, user } = renderComponent(
      <SlotMachine cashOutHoverMoveDirectionChance={1} />,
    );

    const cashOutBtn = queryByText(/cash out/i)!;

    await user.hover(cashOutBtn);

    const cashOutWrapper = queryByTestId("slot-machine__cash-out")!;

    expect(cashOutWrapper).not.toHaveClass("slot-machine__cash-out--null");
  });

  it("should disable the cash out by hover on it based on the chance", async () => {
    const { queryByText, user } = renderComponent(
      <SlotMachine
        cashOutHoverDisableClickChance={0}
        cashOutHoverMoveDirectionChance={0}
      />,
    );

    const gameStore = useGameStore();

    gameStore.startGame();

    const cashOutBtn = queryByText(/cash out/i)!;

    await user.hover(cashOutBtn);

    await user.click(cashOutBtn);

    expect(gameStore.status).toBe("not-started");
  });

  it("should restore cash out hover effects if game is finished", async () => {
    const { queryByText, user, queryByTestId } = renderComponent(
      <SlotMachine
        cashOutHoverDisableClickChance={1}
        cashOutHoverMoveDirectionChance={1}
      />,
    );

    const gameStore = useGameStore();

    const cashOutBtn = queryByText(/cash out/i)!;

    await user.hover(cashOutBtn);

    const cashOutWrapper = queryByTestId("slot-machine__cash-out")!;

    expect(cashOutWrapper).not.toHaveClass("slot-machine__cash-out--null");

    gameStore.finishGame();

    await nextTick();

    expect(queryByText(/game over/i)).toBeInTheDocument();

    expect(cashOutWrapper).toHaveClass("slot-machine__cash-out--null");
  });
});
