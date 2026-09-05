import React from 'react';
import { Svg, Path, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import { View, StyleSheet } from 'react-native';

interface LotusLogoProps {
  size?: number;
  opacity?: number;
}

export function LotusLogo({ size = 120, opacity = 1 }: LotusLogoProps) {
  // A sleek, rounded lotus petal shape. Wide and soft.
  const petalPath = "M 50,100 C 120,70 110,0 50,0 C -10,0 -20,70 50,100 Z";
  
  return (
    <View style={{ width: size, height: size * 0.8, opacity }}>
      <Svg viewBox="0 0 100 100" width="100%" height="100%">
        <Defs>
          {/* Main gradient for the petals (deep purple to light periwinkle) */}
          <LinearGradient id="petalGrad" x1="0" y1="1" x2="0" y2="0">
            <Stop offset="0" stopColor="#4A449F" stopOpacity="0.9" />
            <Stop offset="1" stopColor="#928DFA" stopOpacity="0.9" />
          </LinearGradient>
          
          <LinearGradient id="petalGradDark" x1="0" y1="1" x2="0" y2="0">
            <Stop offset="0" stopColor="#383378" stopOpacity="0.95" />
            <Stop offset="1" stopColor="#7E77EB" stopOpacity="0.9" />
          </LinearGradient>

          <LinearGradient id="petalGradLight" x1="0" y1="1" x2="0" y2="0">
            <Stop offset="0" stopColor="#5E58C2" stopOpacity="0.8" />
            <Stop offset="1" stopColor="#A8A4FF" stopOpacity="0.85" />
          </LinearGradient>
        </Defs>

        <G>
          {/* Outer Left */}
          <G rotation="-55" origin="50, 100">
            <Path d={petalPath} fill="url(#petalGradLight)" />
          </G>
          
          {/* Outer Right */}
          <G rotation="55" origin="50, 100">
            <Path d={petalPath} fill="url(#petalGradLight)" />
          </G>

          {/* Middle Left */}
          <G rotation="-30" origin="50, 100">
            <Path d={petalPath} fill="url(#petalGradDark)" />
          </G>

          {/* Middle Right */}
          <G rotation="30" origin="50, 100">
            <Path d={petalPath} fill="url(#petalGradDark)" />
          </G>

          {/* Center */}
          <G rotation="0" origin="50, 100">
            <Path d={petalPath} fill="url(#petalGrad)" />
          </G>
        </G>
      </Svg>
    </View>
  );
}
