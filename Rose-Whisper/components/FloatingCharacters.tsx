import React, { useEffect, useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/colors';

type CharType = 'heart' | 'star' | 'sparkle' | 'flower' | 'diamond' | 'moon' | 'bow' | 'kiss';

interface CharConfig {
  id: number;
  startX: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  color: string;
  type: CharType;
  wiggleAmount: number;
}

const CHAR_ICONS: Record<CharType, { set: 'ion' | 'mci' | 'fa'; name: string }> = {
  heart: { set: 'ion', name: 'heart' },
  star: { set: 'ion', name: 'star' },
  sparkle: { set: 'ion', name: 'sparkles' },
  flower: { set: 'mci', name: 'flower-tulip' },
  diamond: { set: 'ion', name: 'diamond' },
  moon: { set: 'ion', name: 'moon' },
  bow: { set: 'mci', name: 'bow-tie' },
  kiss: { set: 'mci', name: 'lipstick' },
};

function FloatingChar({ config }: { config: CharConfig }) {
  const progress = useSharedValue(0);
  const wiggle = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      config.delay,
      withRepeat(
        withTiming(1, { duration: config.duration, easing: Easing.linear }),
        -1,
        false
      )
    );
    wiggle.value = withDelay(
      config.delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 2000 + Math.random() * 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(-1, { duration: 2000 + Math.random() * 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const { height } = Dimensions.get('window');
    const translateY = interpolate(progress.value, [0, 1], [height + 60, -60]);
    const translateX = wiggle.value * config.wiggleAmount;
    const rotate = interpolate(
      progress.value,
      [0, 0.25, 0.5, 0.75, 1],
      [0, 20, -15, 25, 0]
    );
    const scale = interpolate(
      progress.value,
      [0, 0.3, 0.7, 1],
      [0.6, 1.1, 1.0, 0.7]
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

  const charInfo = CHAR_ICONS[config.type];

  return (
    <Animated.View style={[styles.char, { left: config.startX }, animatedStyle]}>
      {charInfo.set === 'ion' && (
        <Ionicons name={charInfo.name as any} size={config.size} color={config.color} />
      )}
      {charInfo.set === 'mci' && (
        <MaterialCommunityIcons name={charInfo.name as any} size={config.size} color={config.color} />
      )}
      {charInfo.set === 'fa' && (
        <FontAwesome name={charInfo.name as any} size={config.size} color={config.color} />
      )}
    </Animated.View>
  );
}

interface FloatingCharactersProps {
  intensity?: number;
  celebrationMode?: boolean;
}

export default function FloatingCharacters({ intensity = 1, celebrationMode = false }: FloatingCharactersProps) {
  const { width } = Dimensions.get('window');

  const charColors = [
    Colors.pinkLight,
    Colors.rose,
    Colors.blush,
    Colors.pink,
    Colors.heartRed,
    Colors.pinkDark,
    Colors.gold,
    'rgba(255, 255, 255, 0.7)',
  ];

  const charTypes: CharType[] = celebrationMode
    ? ['heart', 'sparkle', 'star', 'flower', 'heart', 'diamond', 'heart', 'kiss']
    : ['heart', 'star', 'sparkle', 'flower', 'heart', 'diamond', 'moon', 'bow'];

  const count = Math.floor(16 * intensity);

  const chars = useMemo<CharConfig[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      startX: Math.random() * (width - 30),
      size: 10 + Math.random() * 18,
      delay: Math.random() * 8000,
      duration: 9000 + Math.random() * 7000,
      opacity: 0.12 + Math.random() * 0.3,
      color: charColors[i % charColors.length],
      type: charTypes[i % charTypes.length],
      wiggleAmount: 10 + Math.random() * 20,
    }));
  }, [count, celebrationMode]);

  return (
    <View style={styles.container} pointerEvents="none">
      {chars.map((c) => (
        <FloatingChar key={c.id} config={c} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  char: {
    position: 'absolute',
  },
});
