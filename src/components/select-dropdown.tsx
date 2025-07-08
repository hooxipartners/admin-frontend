import Select from '@/components/ui/select'

interface SelectDropdownProps {
  onValueChange?: (value: string) => void
  defaultValue: string | undefined
  placeholder?: string
  isPending?: boolean
  items: { label: string; value: string }[] | undefined
  disabled?: boolean
  className?: string
  isControlled?: boolean
}

export function SelectDropdown({
  defaultValue,
  onValueChange,
  isPending,
  items,
  placeholder,
  className = '',
}: SelectDropdownProps) {
  return (
    <Select
      options={isPending ? [{ label: 'Loading...', value: 'loading' }] : items ?? []}
      placeholder={placeholder ?? 'Select'}
      className={className}
      value={defaultValue}
      onValueChange={onValueChange}
    />
  )
}
