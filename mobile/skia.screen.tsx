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
} from "@shopify/react-native-skia";

export function SkiaScreen() {
  const size = 256;
  const r = size * 0.33;
  return (
    <Canvas style={{ flex: 1 }}>
      <Group blendMode="multiply">
        <Drawing
          drawing={({ canvas, paint }) => {
            paint.setColor(Skia.Color("cyan"));
            canvas.drawCircle(r, r, r, paint);
            paint.setColor(Skia.Color("magenta"));
            canvas.drawCircle(size - r, r, r, paint);
            paint.setColor(Skia.Color("yellow"));
            canvas.drawCircle(size / 2, size - r, r, paint);
          }}
        />
      </Group>
    </Canvas>
  );
}
