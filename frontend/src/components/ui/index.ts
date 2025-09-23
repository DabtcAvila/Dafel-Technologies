/**
 * DAFEL TECHNOLOGIES - PREMIUM UI COMPONENT LIBRARY
 * Complete export index for all premium components
 */

// === BASE COMPONENTS ===
export { Button, type ButtonProps, buttonVariants } from './Button';
export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription, type CardProps } from './Card';
export { Input, type InputProps } from './Input';
export { Badge, type BadgeProps, badgeVariants } from './Badge';
export { Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle, ModalDescription, type ModalProps } from './Modal';
export { ConfirmDialog } from './ConfirmDialog';

// === INTERACTIVE ELEMENTS ===
export {
  MagneticButton,
  TiltCard,
  RippleButton,
  GlowCard,
  FloatingActionButton,
  MorphingButton,
  SlidingPanel,
  InteractiveDemoCard,
  PremiumActionButton,
  type MagneticButtonProps,
  type TiltCardProps,
  type RippleButtonProps,
  type GlowCardProps,
  type FloatingActionButtonProps,
  type MorphingButtonProps,
  type SlidingPanelProps,
} from './InteractiveElements';

// === LAYOUT COMPONENTS ===
export {
  Container,
  Grid,
  Flex,
  Stack,
  Section,
  Masonry,
  HeroLayout,
  FeatureGrid,
  TwoColumnLayout,
  type ContainerProps,
  type GridProps,
  type FlexProps,
  type StackProps,
  type SectionProps,
  type MasonryProps,
} from '../layout/GridSystem';

// === ICON SYSTEM ===
export {
  // Business & Technology Icons
  AIBrainIcon,
  DatabaseIcon,
  CloudIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  ZapIcon,
  RocketIcon,
  
  // User Interface Icons
  MenuIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  SearchIcon,
  SettingsIcon,
  BellIcon,
  UserIcon,
  
  // Action Icons
  PlusIcon,
  MinusIcon,
  EditIcon,
  TrashIcon,
  SaveIcon,
  CopyIcon,
  DownloadIcon,
  UploadIcon,
  
  // Status Icons
  CheckIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  InfoIcon,
  LoadingIcon,
  
  // Brand & Communication Icons
  MailIcon,
  PhoneIcon,
  GlobeIcon,
  LinkIcon,
  
  // Icon system utilities
  icons,
  type IconProps,
  type IconName,
} from '../icons/IconSystem';

// === ANIMATION UTILITIES ===
export {
  easings,
  durations,
  springs,
  entranceAnimations,
  hoverAnimations,
  tapAnimations,
  staggerAnimations,
  pageTransitions,
  loadingAnimations,
  presetCombinations,
  createStaggeredAnimation,
  combineAnimations,
  createResponsiveAnimation,
} from '../../lib/animations';

// === UTILITY FUNCTIONS ===
export { cn } from '../../lib/utils';