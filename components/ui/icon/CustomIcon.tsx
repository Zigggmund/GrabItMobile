import React from 'react';
import {
  Image,
  ImageProps,
  ImageSourcePropType,
  Pressable,
} from 'react-native';

interface CustomIconProps extends ImageProps {
  source: ImageSourcePropType;
  size?: number;
  color?: string;
  onPress?: () => void;
  className?: string;
}

export const CustomIcon = ({
  source,
  size = 24,
  color,
  onPress,
  className = '',
  ...props
}: CustomIconProps) => {
  const tintStyle = color ? { tintColor: color } : {};

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
      >
        <Image
          source={source}
          className={className}
          style={[
            { resizeMode: 'contain', width: size, height: size },
            tintStyle,
          ]}
          {...props}
        />
      </Pressable>
    );
  }

  return (
    <Image
      className={className}
      source={source}
      style={[{ resizeMode: 'contain', width: size, height: size }, tintStyle]}
    />
  );
};
