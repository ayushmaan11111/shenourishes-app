import React from 'react';
import { Check } from 'lucide-react';

interface SingleSelectOption<T extends string> {
  value: T;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface SingleCardSelectProps<T extends string> {
  options: SingleSelectOption<T>[];
  value: T | '';
  onChange: (value: T) => void;
}

export function SingleCardSelect<T extends string>({
  options,
  value,
  onChange,
}: SingleCardSelectProps<T>) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <div
            key={opt.value}
            role="button"
            tabIndex={0}
            onClick={() => onChange(opt.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onChange(opt.value);
              }
            }}
            className={`selectable-card ${isSelected ? 'is-selected' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              {opt.icon && (
                <div style={{ color: isSelected ? '#4F5C38' : '#6B7063', display: 'flex' }}>
                  {opt.icon}
                </div>
              )}
              <div>
                <div className="card-title" style={{ fontSize: '14px', fontWeight: 500, color: '#242820' }}>
                  {opt.label}
                </div>
                {opt.description && (
                  <div style={{ fontSize: '12px', color: '#6B7063', marginTop: '2px' }}>
                    {opt.description}
                  </div>
                )}
              </div>
            </div>

            <div className="selectable-card-radio">
              {isSelected && (
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFDF8',
                  }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface MultiSelectOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

interface MultiCardSelectProps<T extends string> {
  options: MultiSelectOption<T>[];
  values: T[];
  onChange: (values: T[]) => void;
  noneOptionValue?: T;
}

export function MultiCardSelect<T extends string>({
  options,
  values,
  onChange,
  noneOptionValue,
}: MultiCardSelectProps<T>) {
  const handleToggle = (val: T) => {
    if (noneOptionValue && val === noneOptionValue) {
      // If user clicks "None", clear all others
      if (values.includes(noneOptionValue)) {
        onChange([]);
      } else {
        onChange([noneOptionValue]);
      }
      return;
    }

    // If user clicked any regular option and "None" was selected, remove "None"
    let updated = values.filter((v) => v !== noneOptionValue);
    if (updated.includes(val)) {
      updated = updated.filter((v) => v !== val);
    } else {
      updated = [...updated, val];
    }
    onChange(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {options.map((opt) => {
        const isSelected = values.includes(opt.value);
        return (
          <div
            key={opt.value}
            role="button"
            tabIndex={0}
            onClick={() => handleToggle(opt.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggle(opt.value);
              }
            }}
            className={`selectable-card ${isSelected ? 'is-selected' : ''}`}
          >
            <div style={{ flex: 1 }}>
              <div className="card-title" style={{ fontSize: '14px', fontWeight: 500, color: '#242820' }}>
                {opt.label}
              </div>
              {opt.description && (
                <div style={{ fontSize: '12px', color: '#6B7063', marginTop: '2px' }}>
                  {opt.description}
                </div>
              )}
            </div>

            <div className="selectable-card-checkbox">
              {isSelected && <Check size={14} strokeWidth={3} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}
