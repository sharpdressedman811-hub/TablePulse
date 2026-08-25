import React from 'react';
import { View, Text } from 'react-native';
import { useColors } from '@/hooks/useColors';

type StatusType = 'live' | 'draft' | 'awaiting' | 'critical' | 'warning' | 'ok' | 'action_required' | 'monitor' | 'opportunity';

interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, label, size = 'md' }: StatusBadgeProps) {
  const colors = useColors();

  const getConfig = () => {
    switch (status.toLowerCase()) {
      case 'live':
      case 'active':
      case 'ok':
        return { bg: 'rgba(34, 197, 94, 0.12)', text: '#16A34A', dot: '#16A34A', displayLabel: label ?? 'Live' };
      case 'draft':
        return { bg: colors.primaryMuted, text: colors.primary, dot: colors.primary, displayLabel: label ?? 'Draft' };
      case 'awaiting':
      case 'awaiting_approval':
        return { bg: 'rgba(59, 130, 246, 0.12)', text: '#2563EB', dot: '#2563EB', displayLabel: label ?? 'Awaiting Approval' };
      case 'critical':
      case 'action_required':
        return { bg: 'rgba(239, 68, 68, 0.12)', text: colors.danger, dot: colors.danger, displayLabel: label ?? 'Action Required' };
      case 'warning':
      case 'monitor':
        return { bg: 'rgba(245, 158, 11, 0.12)', text: colors.accent, dot: colors.accent, displayLabel: label ?? 'Monitor' };
      case 'opportunity':
        return { bg: colors.primaryMuted, text: colors.primary, dot: colors.primary, displayLabel: label ?? 'Opportunity' };
      default:
        return { bg: colors.surfaceSecondary, text: colors.textSecondary, dot: colors.textSecondary, displayLabel: label ?? status };
    }
  };

  const config = getConfig();
  const isSmall = size === 'sm';

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: config.bg,
        borderRadius: 6,
        paddingHorizontal: isSmall ? 6 : 8,
        paddingVertical: isSmall ? 2 : 3,
        alignSelf: 'flex-start',
      }}
    >
      <View
        style={{
          width: isSmall ? 5 : 6,
          height: isSmall ? 5 : 6,
          borderRadius: 3,
          backgroundColor: config.dot,
        }}
      />
      <Text
        style={{
          fontSize: isSmall ? 10 : 11,
          fontWeight: '600',
          color: config.text,
          fontFamily: 'DMSans_600SemiBold',
        }}
      >
        {config.displayLabel}
      </Text>
    </View>
  );
}
