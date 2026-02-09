import React, { useEffect, useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';

interface HeartConfig {
  id: number;
  startX: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  color: string;
}

function FloatingHeart({ config }: { config: HeartConfig }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      config.delay,
      withRepeat(
        withTiming(1, { duration: config.duration, easing: Easing.linear }),
        -1,
        false
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const { height } = Dimensions.get('window');
    const translateY = interpolate(progress.value, [0, 1], [height + 50, -80]);
    const translateX = interpolate(
      progress.value,
      [0, 0.25, 0.5, 0.75, 1],
      [0, 15, -10, 20, 0]
    );
    const rotate = interpolate(
      progress.value,
      [0, 0.5, 1],
      [-15, 15, -15]
    );
    const scale = interpolate(
      progress.value,
      [0, 0.5, 1],
      [0.8, 1.1, 0.8]
    );

    return {
      transform: [
        { translateY },
        { translateX },
        { rotate: `${rotate}deg` },
        { scale },
      ],
      opacity: config.opacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.heart,
        { left: config.startX },
        animatedStyle,
      ]}
    >
      <Ionicons name="heart" size={config.size} color={config.color} />
    </Animated.View>
  );
}

interface FloatingHeartsProps {
  intensity?: number;
}

export default function FloatingHearts({ intensity = 1 }: FloatingHeartsProps) {
  const { width } = Dimensions.get('window');
  const heartColors = [
    Colors.pinkLight,
    Colors.rose,
    Colors.blush,
    Colors.pink,
    Colors.heartRed,
    Colors.pinkDark,
  ];

  const count = Math.floor(12 * intensity);

  const hearts = useMemo<HeartConfig[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      startX: Math.random() * (width - 40),
      size: 14 + Math.random() * 20,
      delay: Math.random() * 6000,
      duration: 8000 + Math.random() * 6000,
      opacity: 0.15 + Math.random() * 0.35,
      color: heartColors[i % heartColors.length],
    }));
  }, [count]);

  return (
    <View style={styles.container} pointerEvents="none">
      {hearts.map((heart) => (
        <FloatingHeart key={heart.id} config={heart} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  heart: {
    position: 'absolute',
  },
});
