import cherry from "@/assets/cherry.svg";
import lemon from "@/assets/lemon.svg";
import orange from "@/assets/orange.svg";
import watermelon from "@/assets/watermelon.svg";

type Shape = {
  name: string;
  icon: string;
  point: number;
};

export const shapes: Record<string, Shape> = {
  c: {
    name: "Cherry",
    icon: cherry,
    point: 10,
  },
  l: {
    name: "Lemon",
    point: 20,
    icon: lemon,
  },
  o: {
    name: "Orange",
    point: 30,
    icon: orange,
  },
  w: {
    name: "Watermelon",
    point: 40,
    icon: watermelon,
  },
};
