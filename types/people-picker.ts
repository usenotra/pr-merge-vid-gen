import type { PrMergePerson } from "@/types/pr-merge-video"
export type PeoplePickerProps = {
  people: PrMergePerson[]
  selectedLogins: string[]
  maxSelected: number
  truncated: boolean
  onToggle: (login: string) => void
}
