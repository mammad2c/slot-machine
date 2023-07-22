import { renderComponent } from "@/tests/renderComponent";
import Welcome from "./Welcome.vue";
import { useGameStore } from "@/stores";

describe(Welcome.name, () => {
  it("should start the game when we click on the start game button", async () => {
    const { queryByText, user } = renderComponent(<Welcome />);
    const game = useGameStore();
    const startGameBtn = queryByText(/start the game/i);
    await user.click(startGameBtn!);
    expect(game.status).toBe("playing");
  });
});
