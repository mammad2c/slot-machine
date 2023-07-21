import { renderComponent } from "@/tests/renderComponent";
import App from "./App.vue";
import { useGameStore } from "@/stores";

describe(App.name, () => {
  it("should start the game when we click on the start game button", async () => {
    const { queryByText, user } = renderComponent(<App />);
    const game = useGameStore();
    const startGameBtn = queryByText(/start the game/i);
    await user.click(startGameBtn);
    expect(queryByText(/welcome to slot machine/i)).not.toBeInTheDocument();
    expect(game.status).toBe("playing");
  });
});
