import React from 'react';
import { icons } from 'lucide-react-native';

const Icon = ({ name, color, size }) => {
    const LucideIcon = icons[name];
    return <LucideIcon color={color} size={size} />;
};
  
export default Icon;