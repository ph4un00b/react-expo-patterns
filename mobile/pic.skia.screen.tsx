import {
  Blur,
  Canvas,
  Circle,
  Drawing,
  Group,
  Image,
  rect,
  Skia,
  SkiaValue,
  SkImage,
  SkMatrix,
  useFont,
  useImage,
  useValue,
} from "@shopify/react-native-skia";
import { Dimensions, View, Text } from "react-native";
import Animated from "react-native-reanimated";
/** @ts-ignore */
import pic from "./assets/necro.webp";
import { DragDetector, DragHandler } from "./gestures/dnd";
import { ActionsDetector } from "./gestures/race";

export default function PicScreen() {
  const img = useImage(pic);
  const pictureMatrix = useValue(Skia.Matrix());
  if (!img) return null;
  return (
    <View style={{ flex: 1 }}>
      <DragDetector>
        <Canvas style={{ flex: 1 }}>
          <Picture matrix={pictureMatrix} image={img} />
        </Canvas>
      </DragDetector>
    </View>
  );
}
const { width, height } = Dimensions.get("window");

type PictureProps = {
  matrix: SkiaValue<SkMatrix>;
  image: SkImage;
};

function Picture({ matrix, image }: PictureProps) {
  return (
    <Group matrix={matrix}>
      <Image
        x={0}
        y={0}
        width={width * 1}
        height={height * 1}
        image={image}
        fit="cover"
      />
    </Group>
  );
}
