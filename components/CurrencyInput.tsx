import React from 'react';
import { Input } from './ui/input';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const CurrencyInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ ...props }, ref) => {
    const [value, dispatchValue] = React.useReducer(
      (state: string, newValue: string) => {
        const [formattedWholeValue, decimalValue = '0'] = newValue.split('.');
        const significantValue = formattedWholeValue.replace(/,/g, '');
        const floatValue = parseFloat(
          significantValue + '.' + decimalValue.slice(0, 2)
        );
        if (isNaN(floatValue) === false) {
          // you can dispatch to your redux store here - floatValue should be
          // a number, that's well formed

          let n = new Intl.NumberFormat('en-EN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          }).format(floatValue);

          if (newValue.includes('.') && !n.includes('.')) {
            return n + '.';
          }
          return n;
        }
        return '0';
      },
      ''
    );

    return (
      <Input
        {...props}
        type="text"
        value={value}
        onChange={(e) => {
          if (props.onChange) {
            props.onChange(e);
          }
          dispatchValue(e.target.value);
        }}
        ref={ref}
      />
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';
