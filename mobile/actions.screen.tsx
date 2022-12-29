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
import pic from "./assets/necro.webp";
import { DragDetector, DragHandler } from "./gestures/dnd";
import { ActionsDetector, ActionsHandler } from "./gestures/race";

const { width, height } = Dimensions.get("window");
const PictureDimensions = rect(0, 0, width * 0.5, height * 0.5);

export default function ActionsScreen() {
  const size = 256;
  const r = size * 0.33;
  const img = useImage(pic);
  const pictureMatrix = useValue(Skia.Matrix());
  if (!img) return null;
  return (
    <View style={{ flex: 1 }}>
      <ActionsDetector>
      <Canvas style={{ flex: 1 }}>
        <Picture matrix={pictureMatrix} image={img} />
      </Canvas>
      </ActionsDetector>
      <Canvas style={{ flex: 1 }}>
        <Picture matrix={pictureMatrix} image={img} />
      </Canvas>
      <ActionsHandler matrix={pictureMatrix} dimensions={PictureDimensions} />
    </View>
  );
}


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
        width={width * 0.5}
        height={height * 0.5}
        image={image}
        fit="cover"
      />
    </Group>
  );
}
