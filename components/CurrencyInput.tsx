import React from 'react';
import { Input } from './ui/input';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const formatCurrencyValue = (value: string) => {
  const [formattedWholeValue, decimalValue = '0'] = value.split('.');
  const significantValue = formattedWholeValue.replace(/,/g, '');
  const floatValue = parseFloat(
    `${significantValue}.${decimalValue.slice(0, 2)}`,
  );
  if (Number.isNaN(floatValue) === false) {
    // you can dispatch to your redux store here - floatValue should be
    // a number, that's well formed

    const n = new Intl.NumberFormat('en-EN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(floatValue);

    if (value.includes('.') && !n.includes('.')) {
      return `${n}.`;
    }
    return n;
  }
  return '0';
};

export const CurrencyInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ ...props }, ref) => {
    const [value, dispatchValue] = React.useReducer(
      (_state: string, newValue: string) => {
        return formatCurrencyValue(newValue);
      },
      formatCurrencyValue(String(props.value)),
    );

    return (
      <Input
        {...props}
        type="text"
        value={value}
        autoComplete="off"
        onChange={(e) => {
          if (props.onChange) {
            props.onChange(e);
          }
          dispatchValue(e.target.value);
        }}
        ref={ref}
      />
    );
  },
);

CurrencyInput.displayName = 'CurrencyInput';
