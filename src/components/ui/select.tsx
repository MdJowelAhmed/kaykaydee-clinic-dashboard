import * as React from 'react'
import { Select as AntSelect } from 'antd'
import { cn } from '@/utils/cn'

/**
 * Ant Design–backed drop-in replacement for the previous Radix Select.
 *
 * The whole app uses the compositional shadcn-style API:
 *
 *   <Select value onValueChange>
 *     <SelectTrigger className error><SelectValue placeholder /></SelectTrigger>
 *     <SelectContent>
 *       <SelectItem value>Label</SelectItem>
 *     </SelectContent>
 *   </Select>
 *
 * To avoid touching ~34 call sites, `Select` reads the trigger / content / item
 * markers from its children and renders a single antd `<Select>` underneath.
 * The marker components (`SelectTrigger`, `SelectContent`, `SelectItem`, …) carry
 * props only — they never render on their own.
 */

interface AntOption {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

function collectItems(children: React.ReactNode, out: AntOption[]) {
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return
    const el = child as React.ReactElement<Record<string, unknown>>
    if (el.type === SelectItem) {
      out.push({
        value: String(el.props.value),
        label: el.props.children as React.ReactNode,
        disabled: el.props.disabled as boolean | undefined,
      })
    } else if (el.type === SelectGroup || el.type === React.Fragment) {
      collectItems(el.props.children as React.ReactNode, out)
    }
  })
}

export interface SelectProps {
  value?: string
  defaultValue?: string
  // Method signature (not arrow) so handlers typed with a narrower string union
  // — e.g. (v: 'active' | 'archived') => void — remain assignable (bivariant).
  onValueChange?(value: string): void
  disabled?: boolean
  children?: React.ReactNode
}

function Select({ value, defaultValue, onValueChange, disabled, children }: SelectProps) {
  let triggerClassName: string | undefined
  let triggerError = false
  let triggerDisabled: boolean | undefined
  let placeholder: React.ReactNode

  const options: AntOption[] = []

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return
    const el = child as React.ReactElement<Record<string, unknown>>
    if (el.type === SelectTrigger) {
      triggerClassName = el.props.className as string | undefined
      triggerError = Boolean(el.props.error)
      triggerDisabled = el.props.disabled as boolean | undefined
      React.Children.forEach(el.props.children as React.ReactNode, (grand) => {
        if (React.isValidElement(grand) && grand.type === SelectValue) {
          placeholder = (grand.props as { placeholder?: React.ReactNode }).placeholder
        }
      })
    } else if (el.type === SelectContent) {
      collectItems(el.props.children as React.ReactNode, options)
    }
  })

  return (
    <AntSelect
      value={value === '' ? undefined : value}
      defaultValue={defaultValue}
      onChange={(v: string) => onValueChange?.(v)}
      disabled={disabled ?? triggerDisabled}
      status={triggerError ? 'error' : undefined}
      placeholder={placeholder}
      options={options}
      className={cn('kkd-antd-select', triggerClassName)}
      popupMatchSelectWidth={false}
    />
  )
}

/* ---- Marker components (props only; Select reads them, they render nothing) ---- */

interface MarkerProps {
  className?: string
  children?: React.ReactNode
  error?: boolean
  disabled?: boolean
  value?: string
  placeholder?: React.ReactNode
  position?: string
  /** Call sites may pass extra props (id, name, aria-*) onto markers. */
  [key: string]: unknown
}

const noop = (): null => null

const SelectGroup = (_props: MarkerProps) => null
const SelectValue = (_props: MarkerProps) => null
const SelectTrigger = (_props: MarkerProps) => null
const SelectContent = (_props: MarkerProps) => null
const SelectLabel = (_props: MarkerProps) => null
const SelectItem = (_props: MarkerProps) => null
const SelectSeparator = noop
const SelectScrollUpButton = noop
const SelectScrollDownButton = noop

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
