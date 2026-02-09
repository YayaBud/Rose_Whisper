import React, { useEffect, useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '@/constants/colors';

type ParticleType = 'heart' | 'sparkle' | 'rose' | 'star' | 'diamond';

interface Particle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  delay: number;
  type: ParticleType;
  color: string;
  wave: number;
}

function ExplosionParticle({ particle }: { particle: Particle }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      particle.delay + particle.wave * 400,
      withTiming(1, { duration: 2500, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const rad = (particle.angle * Math.PI) / 180;
    const dist = interpolate(progress.value, [0, 1], [0, particle.distance]);
    const translateX = Math.cos(rad) * dist;
    const gravity = interpolate(progress.value, [0, 0.4, 1], [0, -80, 50]);
    const translateY = Math.sin(rad) * dist + gravity;
    const scale = interpolate(progress.value, [0, 0.15, 0.5, 1], [0, 1.5, 1, 0]);
    const opacity = interpolate(progress.value, [0, 0.1, 0.7, 1], [0, 1, 1, 0]);
    const rotate = interpolate(progress.value, [0, 1], [0, 540]);

    return {
      transform: [
        { translateX },
        { translateY },
        { scale },
        { rotate: `${rotate}deg` },
      ],
      opacity,
    };
  });

  const renderIcon = () => {
    switch (particle.type) {
      case 'heart':
        return <Ionicons name="heart" size={particle.size} color={particle.color} />;
      case 'sparkle':
        return <Ionicons name="sparkles" size={particle.size} color={particle.color} />;
      case 'star':
        return <Ionicons name="star" size={particle.size} color={particle.color} />;
      case 'diamond':
        return <Ionicons name="diamond" size={particle.size} color={particle.color} />;
      case 'rose':
        return <MaterialCommunityIcons name="flower-tulip" size={particle.size} color={particle.color} />;
    }
  };

  return (
    <Animated.View style={[styles.particle, animatedStyle]}>
      {renderIcon()}
    </Animated.View>
  );
}

function ScreenFlash() {
  const flash = useSharedValue(0);

  useEffect(() => {
    flash.value = withSequence(
      withTiming(1, { duration: 150 }),
      withTiming(0, { duration: 600, easing: Easing.out(Easing.ease) })
    );
  }, []);

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flash.value * 0.7,
  }));

  return (
    <Animated.View style={[styles.flash, flashStyle]} />
  );
}

function RingWave({ wave }: { wave: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      wave * 500,
      withTiming(1, { duration: 1200, easing: Easing.out(Easing.ease) })
    );
  }, []);

  const ringStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [0, 4]);
    const opacity = interpolate(progress.value, [0, 0.3, 1], [0.6, 0.3, 0]);
    return {
      transform: [{ scale }],
      opacity,
      borderColor: Colors.rose,
    };
  });

  return <Animated.View style={[styles.ring, ringStyle]} />;
}

export default function HeartExplosion() {
  const { width, height } = Dimensions.get('window');
  const colors = [
    Colors.heartRed,
    Colors.rose,
    Colors.pink,
    Colors.pinkLight,
    Colors.gold,
    Colors.pinkDark,
    Colors.blush,
    '#fff',
  ];

  const types: ParticleType[] = ['heart', 'sparkle', 'star', 'rose', 'diamond'];

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 60 }, (_, i) => {
      const wave = i < 20 ? 0 : i < 40 ? 1 : 2;
      return {
        id: i,
        angle: (i / 20) * 360 + Math.random() * 30,
        distance: 80 + Math.random() * 250 + wave * 30,
        size: 14 + Math.random() * 28,
        delay: Math.random() * 300,
        type: types[i % types.length],
        color: colors[i % colors.length],
        wave,
      };
    });
  }, []);

  return (
    <View style={[styles.container, { left: width / 2, top: height / 2 - 50 }]} pointerEvents="none">
      <ScreenFlash />
      <RingWave wave={0} />
      <RingWave wave={1} />
      <RingWave wave={2} />
      {particles.map((p) => (
        <ExplosionParticle key={p.id} particle={p} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 0,
    height: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  particle: {
    position: 'absolute',
  },
  flash: {
    position: 'absolute',
    width: Dimensions.get('window').width * 3,
    height: Dimensions.get('window').height * 3,
    backgroundColor: Colors.pinkLight,
    left: -Dimensions.get('window').width * 1.5,
    top: -Dimensions.get('window').height * 1.5,
  },
  ring: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    left: -40,
    top: -40,
  },
});
